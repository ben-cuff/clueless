import { COMPANIES, Company } from "@/constants/companies";
import { prismaLib } from "@/lib/prisma";
import type { Company as CompanyEnum } from "@prisma/client";

export async function PATCH(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const questionNumber = Number(segments[segments.length - 2]);

    if (isNaN(questionNumber)) {
      return new Response(
        JSON.stringify({ error: "Invalid question number" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { companies } = await req.json();

    if (!companies || !Array.isArray(companies)) {
      return new Response(
        JSON.stringify({ error: "Companies must be an array" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validCompanies: (string | undefined)[] = companies.map(
      (company: Company) => COMPANIES[company]
    );

    if (validCompanies.includes(undefined)) {
      return new Response(
        JSON.stringify({ error: "Invalid company(ies) provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedQuestion = await prismaLib.question.update({
      where: { questionNumber },
      data: {
        companies: validCompanies as CompanyEnum[],
      },
    });

    return new Response(JSON.stringify(updatedQuestion), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during question update:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
