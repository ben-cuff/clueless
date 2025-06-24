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
    // TODO: Implement pagination, full text search
    // To implement full text, we will need to use raw SQL queries

    const url = new URL(req.url);

    const whereClause = getWhereClause(url);

    const questions = await prismaLib.question.findMany({
      orderBy: { questionNumber: "asc" },
      where: whereClause,
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

function getWhereClause(url: URL) {
  const topics = url.searchParams.get("topics");
  const difficulty = url.searchParams.get("difficulty");
  const companies = url.searchParams.get("companies");

  let whereClause = {};

  if (topics) {
    const topicArray = topics.split(" ").map((t) => TOPICS[t as Topic]);
    whereClause = {
      topics: {
        hasSome: topicArray,
      },
    };
  }

  if (difficulty) {
    const difficultyArray = difficulty
      .split(" ")
      .map((d) => DIFFICULTIES[d as Difficulty]);

    whereClause = {
      ...whereClause,
      difficulty: { in: difficultyArray },
    };
  }

  if (companies) {
    const companyArray = companies
      .split(" ")
      .map((c) => COMPANIES[c as Company]);

    whereClause = {
      ...whereClause,
      companies: { hasSome: companyArray },
    };
  }

  return whereClause;
}
