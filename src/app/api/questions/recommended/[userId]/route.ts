import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismaLib } from "@/lib/prisma";
import redisLib from "@/lib/redis";
import { Question } from "@/types/question";
import {
  ForbiddenError,
  get200Response,
  get400Response,
} from "@/utils/api-responses";
import type { Topic } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const cacheKey = `recommended_questions_${userId}`;

  const cachedData = await redisLib.get(cacheKey);
  if (cachedData) {
    return get200Response(JSON.parse(cachedData));
  }

  const interviews: InterviewWithFeedback[] =
    await prismaLib.interview.findMany({
      where: {
        userId,
      },
      select: {
        updatedAt: true,
        questionNumber: true,
        question: {
          select: {
            topics: true,
          },
        },
        feedback: true,
      },
    });

  // prisma does not support random ordering directly, so we use a raw query
  const questions: Question[] = await prismaLib.$queryRawUnsafe(
    `SELECT
        "id",
        "title",
        "accuracy", 
        "difficulty",
        "topics",
        "companies",
        "titleSlug" 
       FROM "Question" ORDER BY RANDOM() LIMIT 40;`
  );

  const recommendedQuestions = getRecommendedQuestions(interviews, questions);

  redisLib.set(cacheKey, JSON.stringify(recommendedQuestions), {
    EX: 60 * 30,
  });

  return get200Response(recommendedQuestions);
}

function getRecommendedQuestions(
  interviews: InterviewWithFeedback[],
  questions: Question[]
): Question[] {
  // Filter interviews to only include those with feedback given in the last 30 days
  const recentInterviews = getRecentValidInterviews(interviews);

  // Filter out questions that have received feedback in the last 30 days
  const filteredQuestions = questions.filter(
    (question) =>
      !recentInterviews.some(
        (interview) => interview.questionNumber === question.id
      )
  );

  const topicWeights = getTopicWeights(recentInterviews);

  const weightedQuestions = getSortedWeightedQuestions(
    filteredQuestions,
    topicWeights
  );

  // get the top 5 questions based on the highest weights
  const recommendedQuestions = weightedQuestions.slice(0, 5);

  return recommendedQuestions;
}

function getRecentValidInterviews(
  interviews: InterviewWithFeedback[]
): InterviewWithFeedback[] {
  return interviews.filter(
    (interview) =>
      interview.feedback?.feedbackNumber !== -1 &&
      interview.updatedAt > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );
}

function getTopicWeights(
  interviews: InterviewWithFeedback[]
): Map<string, number> {
  const topicWeights = new Map<string, number>();

  // assigns a weight to each topic based on the feedback number
  // the higher the feedback number, the lower the weight
  interviews.forEach((interview) => {
    const weight = 1 / (interview?.feedback?.feedbackNumber ?? 0 + 1);

    interview.question.topics.forEach((topic) => {
      const currentWeight = topicWeights.get(topic) || 0;
      topicWeights.set(topic, currentWeight + weight);
    });
  });

  return topicWeights;
}

function getSortedWeightedQuestions(
  questions: Question[],
  topicWeights: Map<string, number>
): Question[] {
  // sum up the weights for each question based on its topics
  const weightedQuestions = questions.map((question) => {
    let totalWeight = 0;

    question.topics.forEach((topic) => {
      totalWeight += topicWeights.get(topic) || 0;
    });

    return {
      ...question,
      weight: totalWeight,
    };
  });

  weightedQuestions.sort((a, b) => b.weight - a.weight);
  return weightedQuestions;
}

type InterviewWithFeedback = {
  updatedAt: Date;
  questionNumber: number;
  question: {
    topics: Topic[];
  };
  feedback: {
    id: string;
    interviewId: string;
    feedback: string;
    feedbackNumber: number;
  } | null;
};
