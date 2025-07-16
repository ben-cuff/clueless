import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { prismaLib } from "@/lib/prisma";
import { InterviewWithFeedback } from "@/types/interview";
import { Question } from "@/types/question";
import {
  ForbiddenError,
  get200Response,
  get400Response,
} from "@/utils/api-responses";
import { debugLog } from "@/utils/logger";
import { getDifficultyWeights } from "@/utils/recommendation/difficulty";
import { getTopicWeights } from "@/utils/recommendation/topic";
import { millisecondsInDay } from "date-fns/constants";
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

  // const cacheKey = `recommended_questions_${userId}`;

  // const cachedData = await redisLib.get(cacheKey);
  // if (cachedData) {
  //   return get200Response(JSON.parse(cachedData));
  // }

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
            difficulty: true,
            companies: true,
          },
        },
        feedback: true,
      },
    });

  const NUM_RANDOM_QUESTIONS = 1000;

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
       FROM "Question" ORDER BY RANDOM() LIMIT ${NUM_RANDOM_QUESTIONS};`
  );

  const recommendedQuestions = getRecommendedQuestions(interviews, questions);

  // redisLib.set(cacheKey, JSON.stringify(recommendedQuestions), {
  //   EX: secondsInHour / 2, // cache for half an hour
  // });

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
  const difficultyWeights = getDifficultyWeights(recentInterviews);

  // TODO: IMPLEMENT COMPANY WEIGHTS
  const companyWeights = new Map<string, number>();

  const weightedQuestions = getSortedWeightedQuestions(
    filteredQuestions,
    topicWeights,
    difficultyWeights,
    companyWeights
  );

  // get the top 5 questions based on the highest weights
  const recommendedQuestions = weightedQuestions.slice(0, 5);

  return recommendedQuestions;
}

function getRecentValidInterviews(
  interviews: InterviewWithFeedback[]
): InterviewWithFeedback[] {
  const NO_FEEDBACK_NUMBER = -1;
  const LONGEST_VALID_INTERVIEW_DAYS = 30;

  return interviews.filter(
    (interview) =>
      interview.feedback?.feedbackNumber !== NO_FEEDBACK_NUMBER &&
      interview.updatedAt >
        new Date(Date.now() - millisecondsInDay * LONGEST_VALID_INTERVIEW_DAYS) // within the last 30 days
  );
}

/**
 * For example, if the topicWeights map contains {'Arrays': 0.5, 'Dynamic Programming': 0.7, 'Trees': 0.3},
 * the difficultyWeights map contains {EASY: 0.4, MEDIUM: 0.6, HARD: 0.8},
 * and the companyWeights map contains {'Google': 0.2, 'Meta': 0.1},
 * then for a question with topics ['Arrays', 'Trees'], difficulty HARD, and companies ['Google'],
 * the question's weight would be calculated as:
 * (0.5 + 0.3) * TOPICS_SCALER + 0.8 * DIFFICULTY_SCALER + 0.2 * COMPANY_SCALER + noise * NOISE_SCALER,
 * where noise is a random value between 0 and NOISE_SCALER.
 * After calculating the weights for all questions, they are sorted in descending order based on their weights.
 */
function getSortedWeightedQuestions(
  questions: Question[],
  topicWeights: Map<string, number>,
  difficultyWeights: Map<number, number>,
  companyWeights: Map<string, number>
): Question[] {
  const TOPICS_SCALER = 5;
  const DIFFICULTY_SCALER = 1;
  const COMPANY_SCALER = 1;
  const NOISE_SCALER = 1;

  // sum up the weights for each question based on its topics
  let totalTopicWeight = 0;
  let totalDifficultyWeight = 0;
  let totalCompanyWeight = 0;
  let noiseWeight = 0;

  const weightedQuestions = questions.map((question) => {
    let totalWeight = 0;

    const numTopics = question.topics.length || 1;
    let topicWeight = 0;
    question.topics.forEach((topic) => {
      topicWeight +=
        ((topicWeights.get(topic) ?? 0) * TOPICS_SCALER) / numTopics;
    });
    totalTopicWeight += topicWeight;
    totalWeight += topicWeight;

    const difficultyWeight =
      (difficultyWeights.get(question.difficulty) ?? 0) * DIFFICULTY_SCALER;
    totalDifficultyWeight += difficultyWeight;
    totalWeight += difficultyWeight;

    let companyWeight = 0;
    question.companies.forEach((company) => {
      companyWeight += (companyWeights.get(company) ?? 0) * COMPANY_SCALER;
    });
    totalCompanyWeight += companyWeight;
    totalWeight += companyWeight;

    noiseWeight += Math.random() * NOISE_SCALER;
    totalWeight += noiseWeight;

    return {
      ...question,
      weight: totalWeight,
    };
  });

  const numQuestions = questions.length || 1;
  debugLog("Average topic weight added: " + totalTopicWeight / numQuestions);
  debugLog(
    "Average difficulty weight added: " + totalDifficultyWeight / numQuestions
  );
  debugLog(
    "Average company weight added: " + totalCompanyWeight / numQuestions
  );
  debugLog("Average noise weight added: " + noiseWeight / numQuestions);

  weightedQuestions.sort((a, b) => b.weight - a.weight);
  return weightedQuestions;
}
