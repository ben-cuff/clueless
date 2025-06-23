import { COMPANIES, Company } from "@/constants/companies";
import { DIFFICULTIES, Difficulty } from "@/constants/difficulties";
import { Topic, TOPICS } from "@/constants/topics";
import { prismaLib } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const {
      questionNumber,
      title,
      accuracy,
      testcases,
      starterCode,
      solutions,
      topics,
      prompt,
      companies,
      difficulty,
      article,
    } = await req.json();

    if (
      typeof questionNumber !== "number" ||
      typeof title !== "string" ||
      typeof accuracy !== "number" ||
      typeof prompt !== "string" ||
      typeof difficulty !== "string" ||
      !Array.isArray(topics) ||
      !Array.isArray(companies) ||
      typeof testcases !== "object" ||
      typeof starterCode !== "object" ||
      typeof solutions !== "object" ||
      typeof article !== "string"
    ) {
      return new Response(JSON.stringify({ error: "Invalid input data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const validCompanies = companies.map(
      (company: Company) => COMPANIES[company]
    );

    const validTopics = topics.map(
      (topic: Topic) => TOPICS[topic.toLowerCase().replace(" ", "_") as Topic]
    );

    const validDifficulty =
      DIFFICULTIES[difficulty.toLowerCase() as Difficulty];

    let question;
    try {
      question = await prismaLib.question.create({
        data: {
          questionNumber,
          title,
          accuracy,
          testcases,
          starterCode,
          solutions,
          prompt,
          difficulty: validDifficulty,
          topics: validTopics,
          companies: validCompanies,
          article,
        },
      });
    } catch {
      return new Response(
        JSON.stringify({ error: "A question with that number already exists" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(JSON.stringify(question), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during question creation:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
  try {
    // TODO: Implement pagination, full text search, and filtering by difficulty and topic

    const questions = await prismaLib.question.findMany({
      orderBy: { questionNumber: "asc" },
    });
    return new Response(JSON.stringify(questions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during question retrieval:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
