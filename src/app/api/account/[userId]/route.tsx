import { prismaLib } from '@/lib/prisma';
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
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
    const deletedAccount = await prismaLib.user.delete({
      where: { id: userId },
    });

    return get200Response(deletedAccount);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025' // User not found
    ) {
      return get400Response('User with that userId not found');
    }
    return UnknownServerError;
  }
}
