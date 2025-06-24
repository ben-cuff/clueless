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

    // validate topics by converting them to the format defined in TOPICS
    // replace spaces and dashed with underscores, and remove parentheses
    const validTopics = topics.map(
      (topic: Topic) =>
        TOPICS[
          topic
            .toLowerCase()
            .replace(/ +/g, "_")
            .replace(/-/g, "_")
            .replace(/[()]/g, "") as Topic
        ]
    );

    console.log("Valid topics:", validTopics);

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
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "A question with that number already exists",
          errorData: error,
        }),
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
    // TODO: full text search
    // To implement full text, we will need to use raw SQL queries

    const url = new URL(req.url);

    const whereClause = getWhereClause(url);

    const pagination = getPagination(url);

    const questions = await prismaLib.question.findMany({
      ...pagination,
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

  // topics should be formatted as a space-separated string of topic names
  // e.g. "array string hash_table"
  if (topics) {
    const topicArray = topics.split(" ").map((t) => TOPICS[t as Topic]);
    whereClause = {
      topics: {
        hasSome: topicArray,
      },
    };
  }

  // difficulty should be formatted as a space-separated string of difficulty levels
  // e.g. "easy medium hard"
  if (difficulty) {
    const difficultyArray = difficulty
      .split(" ")
      .map((d) => DIFFICULTIES[d as Difficulty]);

    whereClause = {
      ...whereClause,
      difficulty: { in: difficultyArray },
    };
  }

  // companies should be formatted as a space-separated string of company names
  // e.g. "google microsoft amazon"
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

function getPagination(url: URL) {
  const cursor = parseInt(url.searchParams.get("cursor") || "0");
  const take = parseInt(url.searchParams.get("take") || "20");
  const skip = parseInt(url.searchParams.get("skip") || "0");

  // If cursor is provided, we use it to set the cursor for pagination
  if (cursor !== 0) {
    return {
      take,
      skip: 1 + skip, // skip the cursor question
      cursor: {
        questionNumber: cursor,
      },
    };
  }

  // If cursor is not provided, we use skip and take for pagination
  return {
    take,
    skip,
  };
}

export async function DELETE(req: Request) {
  try {
    await prismaLib.question.deleteMany();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during question deletion:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
