import PRISMA_ERROR_CODES from '@/constants/prisma-error-codes';
import { prismaLib } from '@/lib/prisma';
import { ActivityAPI } from '@/utils/activity-api';
import {
  ForbiddenError,
  get201Response,
  get400Response,
  get409Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { NotificationsAPI } from '@/utils/notifications-api';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const { userId, interviewId, feedback } = body;

  if (!interviewId || !feedback) {
    return get400Response('Missing required fields:  interviewId, feedback');
  }

  const session = await getServerSession(authOptions);

  if (session?.user.id !== userId) {
    return ForbiddenError;
  }

  const interview = await prismaLib.interview.findUnique({
    where: { id: interviewId },
  });

  if (!interview) {
    return get400Response('Interview not found');
  }

  const feedbackNumber = getFeedbackNumberFromFeedback(feedback);

  try {
    const feedbackEntry = await prismaLib.feedback.create({
      data: {
        interviewId,
        feedback,
        feedbackNumber,
      },
    });

    await prismaLib.interview.update({
      where: { id: interviewId },
      data: {
        completed: true,
      },
    });

    ActivityAPI.updateActivity(userId, 'questions');

    NotificationsAPI.postNotification(userId);

    return get201Response(feedbackEntry);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED // Unique constraint failed on the feedback entry
    ) {
      return get409Response('Feedback for this interview already exists.');
    } else {
      return UnknownServerError;
    }
  }
}

const getFeedbackNumberFromFeedback = (feedback: string) => {
  const lowerFeedback = feedback.toLowerCase();

  const feedbackRatings = [
    { pattern: 'strong hire', value: 5 },
    { pattern: 'strong no-hire', value: 0 },
    { pattern: 'lean hire', value: 3 },
    { pattern: 'lean no-hire', value: 2 },
    { pattern: 'no-hire', value: 1 },
    { pattern: 'hire', value: 4 },
  ];

  for (const { pattern, value } of feedbackRatings) {
    if (lowerFeedback.includes(pattern)) {
      return value;
    }
  }

  return -1;
};
