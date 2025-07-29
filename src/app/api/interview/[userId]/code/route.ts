import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { prismaLib } from '@/lib/prisma';
import {
  ForbiddenError,
  get200Response,
  get400Response,
  get404Response,
  UnknownServerError,
} from '@/utils/api/api-responses';
import { errorLog } from '@/utils/logger';
import { Language } from '@prisma/client';
import { getServerSession } from 'next-auth';

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

  const { id, code, language } = body;

  if (!id || !code || !language) {
    return get400Response('Missing required fields: id, code, language');
  }

  try {
    const interview = await prismaLib.interview.findUnique({
      where: { id },
    });

    if (!interview) {
      return get404Response('Interview not found');
    }

    const updatedInterview = await prismaLib.interview.update({
      where: { id },
      data: {
        code,
        codeLanguage: language.toUpperCase() as Language,
      },
    });

    return get200Response(updatedInterview);
  } catch (error) {
    errorLog('Error updating interview code: ' + error);
    return UnknownServerError;
  }
}
