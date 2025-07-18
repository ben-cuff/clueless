import PRISMA_ERROR_CODES from '@/constants/prisma-error-codes';
import { prismaLib } from '@/lib/prisma';
import {
  get200Response,
  get400Response,
  get404Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { errorLog } from '@/utils/logger';
import { Prisma } from '@prisma/client';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    if (isNaN(numId)) {
      return get400Response('Invalid question number');
    }

    const question = await prismaLib.question.findUnique({
      where: { id: numId },
    });

    if (!question) {
      return get404Response('Question not found');
    }

    return get200Response(question);
  } catch (error) {
    errorLog('Error during question retrieval: ' + error);
    return UnknownServerError;
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return get400Response('Invalid question ID');
  }

  try {
    const question = await prismaLib.question.delete({
      where: { id: numId },
    });

    return get200Response(question);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND
    ) {
      return get404Response('Question not found');
    }
    errorLog('Error deleting question: ' + error);
    return UnknownServerError;
  }
}
