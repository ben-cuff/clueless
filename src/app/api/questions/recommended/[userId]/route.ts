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
        goal: true,
      },
    });
  } catch (error) {
    debugLog('Error fetching user: ' + error);
    return UnknownServerError;
  }

  const interviews: InterviewWithFeedback[] = user?.interview ?? [];
  const goal = user?.goal ?? null;

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
    goal
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
