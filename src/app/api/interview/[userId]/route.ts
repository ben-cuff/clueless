import { prismaLib } from '@/lib/prisma';
import {
  ForbiddenError,
  get200Response,
  get201Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { errorLog } from '@/utils/logger';
import { NotificationsAPI } from '@/utils/notifications-api';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function POST(
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

  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const { id, messages, questionNumber, code, codeLanguage, type } = body;

  if (!id || !messages || !questionNumber || !code || !codeLanguage) {
    return get400Response(
      'Missing required fields: id, messages, questionNumber, code, codeLanguage'
    );
  }

  try {
    const interview = await prismaLib.interview.upsert({
      where: { id },
      update: {
        messages,
        questionNumber,
        code,
        codeLanguage,
      },
      create: {
        id,
        userId,
        messages,
        questionNumber,
        code,
        codeLanguage,
        type,
      },
    });

    const createdTime = interview.createdAt.getTime();
    const updatedTime = interview.updatedAt.getTime();

    const isNewRecord = createdTime === updatedTime;

    NotificationsAPI.postNotification(userId);

    return isNewRecord ? get201Response(interview) : get200Response(interview);
  } catch (error) {
    errorLog('Error upserting interview: ' + error);
    return UnknownServerError;
  }
}

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

  try {
    const interviews = await prismaLib.interview.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        question: {
          select: { title: true, difficulty: true },
        },
      },
    });

    return get200Response(interviews);
  } catch (error) {
    errorLog('Error fetching interviews: ' + error);
    return UnknownServerError;
  }
}
