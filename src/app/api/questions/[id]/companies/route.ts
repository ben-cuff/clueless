import { COMPANIES, Company } from "@/constants/companies";
import { prismaLib } from "@/lib/prisma";
import {
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import type { Company as CompanyEnum } from "@prisma/client";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const numId = Number(id);

    if (isNaN(numId)) {
      return get400Response("Invalid question number");
    }

    const { companies } = await req.json();

    if (!companies || !Array.isArray(companies)) {
      return get400Response("Invalid or missing companies array");
    }

    const validCompanies: (string | undefined)[] = companies.map(
      (company: Company) => COMPANIES[company]
    );

    if (validCompanies.some((company) => company === undefined)) {
      return get400Response("Invalid company name provided");
    }

    const updatedQuestion = await prismaLib.question.update({
      where: { id: numId },
      data: {
        companies: validCompanies as CompanyEnum[],
      },
    });

    return get200Response(updatedQuestion);
  } catch (error) {
    console.error("Error during question update:", error);
    return UnknownServerError;
  }
}
