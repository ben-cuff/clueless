/**
 * This file handles the API route for fetching recommended questions for a user.
 *
 * It first checks if the User already has cached recommended questions.
 * If cached data is found, it returns that data.
 * If not, it fetches the user's interview history and companies,
 * retrieves a set of random questions from the database,
 * and then generates recommendations based on the user's interviews (topics and difficulty) and companies.
 * Finally, it caches the recommended questions for future requests and returns the recommended questions.
 *
 * Recommended questions are selected based on the user's interview history, and the companies they are interested in.
 * It weights questions heavier if the user has previously interviewed and struggled on similar topics.
 * It also considers the difficulty of the questions that the user has previously attempted,
 * and uses how well they performed to adjust the recommendations.
 *
 * For example, if a user has previously struggled with medium difficulty questions,
 * the system will recommend more more medium and easy questions.
 *
 * If the user struggles on easy questions, the system will recommend more easy questions.
 * If the user seems to be unable to answer any questions and especially struggles with easy questions,
 * the algorithm will recommend 5 "core" questions that are fundamental to interviewing.
 *
 * If the user struggles on hard questions, the system will recommend more hard questions and medium questions.
 *
 * The algorithm will also not recommend questions that the user has attempted in the last 30 days.
 *
 * The algorithm also will weight questions heavier if the question is from a company that the user has targeted.
 * If the user has answered many questions from a specific company, the algorithm will recommend less questions from that company.
 */

import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prismaLib } from '@/lib/prisma';
import redisLib from '@/lib/redis';
import { InterviewWithFeedback } from '@/types/interview';
import { QuestionPartial } from '@/types/question';
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { debugLog } from '@/utils/logger';
import { getRecommendedQuestions } from '@/utils/recommendation/get-recommendations';
import { secondsInHour } from 'date-fns/constants';
import { getServerSession } from 'next-auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  const userId = Number(resolvedParams.userId);

  if (isNaN(userId)) {
    return get400Response('Invalid user ID');
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const cacheKey = `recommended_questions_${userId}`;
  try {
    const cachedData = await redisLib.get(cacheKey);
    if (cachedData) {
      return get200Response(JSON.parse(cachedData));
    }
  } catch (error) {
    debugLog('Error fetching cached recommended questions: ' + error);
    // Proceed to fetch from database if cache fails
  }

  let user;
  try {
    user = await prismaLib.user.findUnique({
      where: { id: userId },
      select: {
        interview: {
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
        },
        companies: true,
      },
    });
  } catch (error) {
    debugLog('Error fetching user: ' + error);
    return UnknownServerError;
  }

  const interviews: InterviewWithFeedback[] = user?.interview ?? [];
  const companies = user?.companies ?? null;

  const NUM_RANDOM_QUESTIONS = 1000;

  let questions: QuestionPartial[] = [];
  try {
    // prisma does not support random ordering directly, so we use a raw query
    questions = await prismaLib.$queryRawUnsafe(
      `SELECT
          "id",
          "title",
          "accuracy", 
          "difficulty",
          "topics",
          "companies",
          "titleSlug",
          "prompt",
          "createdAt",
          "updatedAt"
         FROM "Question" ORDER BY RANDOM() LIMIT ${NUM_RANDOM_QUESTIONS};`
    );
  } catch (error) {
    debugLog('Error fetching questions: ' + error);
    return UnknownServerError;
  }

  const recommendedQuestions = getRecommendedQuestions(
    interviews,
    questions,
    companies
  );

  try {
    redisLib.set(cacheKey, JSON.stringify(recommendedQuestions), {
      EX: secondsInHour / 2, // cache for half an hour
    });
  } catch (error) {
    debugLog('Error caching recommended questions: ' + error);
    return UnknownServerError;
  }

  return get200Response(recommendedQuestions);
}
