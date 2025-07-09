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
import { millisecondsInWeek, secondsInHour } from "date-fns/constants";
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
    EX: secondsInHour / 2, // cache for half an hour
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
  const NO_FEEDBACK_NUMBER = -1;

  return interviews.filter(
    (interview) =>
      interview.feedback?.feedbackNumber !== NO_FEEDBACK_NUMBER &&
      interview.updatedAt > new Date(Date.now() - millisecondsInWeek * 4) // within the last 4 weeks
  );
}

/**  ["Arrays", "Trees"] feedbackNumber: 2
 *   ["Dynamic Programming", "Arrays"] feedbackNumber: 3
 *
 *   - Arrays: (1/3 + 1/4)/2 = 0.292
 *   - Trees: (1/3)/1 = 0.333
 *   - Dynamic Programming: (1/4)/1 = 0.25
 *
 * higher weight means user has performed worse on that topic
 */
function getTopicWeights(
  interviews: InterviewWithFeedback[]
): Map<string, number> {
  const topicWeights = new Map<string, number>();
  const topicCounts = new Map<string, number>();

  interviews.forEach((interview) => {
    const weight = 1 / ((interview?.feedback?.feedbackNumber ?? 0) + 1);

    interview.question.topics.forEach((topic) => {
      const currentCount = topicCounts.get(topic) ?? 0;
      topicCounts.set(topic, currentCount + 1);

      const currentWeight = topicWeights.get(topic) ?? 0;
      topicWeights.set(topic, currentWeight + weight);
    });
  });

  for (const [topic, weight] of topicWeights.entries()) {
    const count = topicCounts.get(topic) ?? 1;
    topicWeights.set(topic, weight / count);
  }

  return topicWeights;
}

// If we have topicWeights with: {'Arrays': 0.5, 'Dynamic Programming': 0.7, 'Trees': 0.3}
// And a question with topics ['Arrays', 'Trees'], its weight would be 0.5 + 0.3 = 0.8
// Then we sort all questions by their weights in descending order
function getSortedWeightedQuestions(
  questions: Question[],
  topicWeights: Map<string, number>
): Question[] {
  // sum up the weights for each question based on its topics
  const weightedQuestions = questions.map((question) => {
    let totalWeight = 0;

    question.topics.forEach((topic) => {
      totalWeight += topicWeights.get(topic) ?? 0;
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
