import { COMPANIES } from '@/constants/companies';
import { prismaLib } from '@/lib/prisma';
import { Optional } from '@/types/util';
import {
  get200Response,
  get400Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { errorLog } from '@/utils/logger';
import type { Company as CompanyEnum } from '@prisma/client';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);

  if (isNaN(numId)) {
    return get400Response('Invalid question number');
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return get400Response('Invalid JSON body');
  }

  const { companies } = body;

  if (!companies || !Array.isArray(companies)) {
    return get400Response('Invalid or missing companies array');
  }

  const validCompanies: Optional<string>[] = companies.map(
    (company: keyof typeof COMPANIES) => COMPANIES[company]
  );

  if (validCompanies.some((company) => company === undefined)) {
    return get400Response('Invalid company name provided');
  }

  try {
    const updatedQuestion = await prismaLib.question.update({
      where: { id: numId },
      data: {
        companies: validCompanies as CompanyEnum[],
      },
    });

    return get200Response(updatedQuestion);
  } catch (error) {
    errorLog('Error updating question companies: ' + error);
    return UnknownServerError;
  }
}
