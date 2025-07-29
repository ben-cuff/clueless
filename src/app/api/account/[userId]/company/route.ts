import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import PRISMA_ERROR_CODES from '@/constants/prisma-error-codes';
import { prismaLib } from '@/lib/prisma';
import {
  ForbiddenError,
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api/api-responses';
import { errorLog } from '@/utils/logger';
import { Company, Prisma } from '@prisma/client';
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

  try {
    const user = await prismaLib.user.findUnique({
      where: { id: userId },
      select: {
        companies: true,
      },
    });

    if (!user) {
      return get400Response('User with that userId not found');
    }

    return get200Response(user.companies);
  } catch (error) {
    errorLog('Unexpected error while fetching user: ' + error);
    return UnknownServerError;
  }
}

export async function PATCH(
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

  const { companies } = body;

  if (!Array.isArray(companies) || companies.length === 0) {
    return get400Response('You must provide a non-empty companies array');
  }

  const validCompanies = Object.values(Company);

  if (companies.some((company) => !validCompanies.includes(company))) {
    return get400Response('One or more companies are invalid');
  }

  try {
    const updatedUser = await prismaLib.user.update({
      where: { id: userId },
      data: { companies },
    });

    return get200Response(updatedUser);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_ERROR_CODES.RECORD_NOT_FOUND
    ) {
      return get400Response('No user found for this userId');
    } else {
      errorLog('Unexpected error while updating user companies: ' + error);
      return UnknownServerError;
    }
  }
}
