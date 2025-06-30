import { COMPANIES, Company } from "@/constants/companies";
import { prismaLib } from "@/lib/prisma";
import {
  get200Response,
  get400Response,
  UnknownServerError,
} from "@/utils/api-responses";
import type { Company as CompanyEnum } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const questionNumber = Number(segments[segments.length - 2]);

    if (isNaN(questionNumber)) {
      return get400Response("Invalid question number");
    }

    const { companies } = await req.json();

    if (!companies || !Array.isArray(companies)) {
      return get400Response("Invalid or missing companies array");
    }

    const validCompanies: (string | undefined)[] = companies.map(
      (company: Company) => COMPANIES[company]
    );

    if (validCompanies.includes(undefined)) {
      return get400Response("Invalid company name provided");
    }

    const updatedQuestion = await prismaLib.question.update({
      where: { questionNumber },
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
