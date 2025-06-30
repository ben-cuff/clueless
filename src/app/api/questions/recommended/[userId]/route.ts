import { prismaLib } from "@/lib/prisma";
import { Question } from "@/types/question";
import { get200Response, get400Response } from "@/utils/api-responses";
import { Topic } from "@prisma/client";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const userId = Number(segments[segments.length - 1]);

  if (isNaN(userId)) {
    return get400Response("Invalid user ID");
  }

  //commented out for now, as testing is being done without authentication
  //   const session = getServerSession(authOptions);

  //   if (session?.user.id !== userId) {
  //     return ForbiddenError;
  //   }

  // Get past feedback with interview data
  const pastFeedback: PastFeedback[] = await prismaLib.feedback.findMany({
    where: {
      userId,
    },
    select: {
      feedbackNumber: true,
      interview: {
        select: {
          updatedAt: true,
          questionNumber: true,
          question: {
            select: {
              topics: true,
            },
          },
        },
      },
    },
  });

  // prisma does not support random ordering directly, so we use a raw query
  const questions = await prismaLib.$queryRawUnsafe(
    `SELECT
        "questionNumber",
        "title",
        "accuracy", 
        "difficulty",
        "topics",
        "companies",
        "titleSlug" 
       FROM "Question" ORDER BY RANDOM() LIMIT 40;`
  );

  // Filter recent feedback from the last 30 days
  const recentFeedback = pastFeedback.filter(
    (feedback) =>
      feedback.feedbackNumber !== -1 &&
      feedback.interview.updatedAt >
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  const topicWeights = new Map<string, number>();

  console.log("topicWeights:", topicWeights);

  recentFeedback.forEach((feedback) => {
    const weight = 1 / (feedback.feedbackNumber + 1);

    feedback.interview.question.topics.forEach((topic) => {
      const currentWeight = topicWeights.get(topic) || 0;
      topicWeights.set(topic, currentWeight + weight);
    });
  });

  const weightedQuestions = (questions as Question[]).map((question) => {
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

  console.log("Weighted Questions:", weightedQuestions);

  const recommendedQuestions = weightedQuestions.slice(0, 5);

  return get200Response(recommendedQuestions);
}

type PastFeedback = {
  feedbackNumber: number;
  interview: {
    updatedAt: Date;
    questionNumber: number;
    question: {
      topics: Topic[];
    };
  };
};
