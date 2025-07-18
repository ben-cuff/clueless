import PRISMA_ERROR_CODES from '@/constants/prisma-error-codes';
import { prismaLib } from '@/lib/prisma';
import {
  get201Response,
  get400Response,
  get409Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { errorLog } from '@/utils/logger';
import { Prisma } from '@prisma/client';
import argon2 from 'argon2';

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const { username, password } = body;

  if (!username || !password) {
    return get400Response('Username and password are required');
  }

  const hashedPassword = await argon2.hash(password);

  try {
    const user = await prismaLib.user.create({
      data: { hashedPassword, username },
    });
    return get201Response({ success: true, user });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED // Unique constraint failed on the username field
    ) {
      return get409Response(
        'Username already exists. Please choose a different username.'
      );
    } else {
      errorLog('Error during user registration: ' + error);
      return UnknownServerError;
    }
  }
}
