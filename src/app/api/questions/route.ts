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

    // validate topics by converting them to the format defined in TOPICS
    // replace spaces and dashed with underscores, and remove parentheses
    const validTopics: (string | undefined)[] = topics.map(
      (topic: Topic) =>
        TOPICS[
          topic
            .toLowerCase()
            .replace(/ +/g, "_")
            .replace(/-/g, "_")
            .replace(/[()]/g, "") as Topic
        ]
    );

    if (validTopics.includes(undefined)) {
      return new Response(
        JSON.stringify({ error: "Invalid topic(s) provided" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const validDifficulty =
      DIFFICULTIES[difficulty.toLowerCase() as Difficulty];

    if (validDifficulty === undefined) {
      return new Response(
        JSON.stringify({ error: "Invalid difficulty level" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
      omit: {
        testcases: true,
        starterCode: true,
        solutions: true,
        article: true,
      },
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
    let topicArray: (string | undefined)[] = topics
      .split(" ")
      .map((t) => TOPICS[t as Topic]);
    if (topicArray.includes(undefined)) {
      topicArray = topicArray.filter((t) => t !== undefined);
    }
    if (topicArray.length !== 0) {
      whereClause = {
        topics: {
          hasSome: topicArray,
        },
      };
    }
  }

  // difficulty should be formatted as a space-separated string of difficulty levels
  // e.g. "easy medium hard"
  if (difficulty) {
    let difficultyArray: (number | undefined)[] = difficulty
      .split(" ")
      .map((d) => DIFFICULTIES[d as Difficulty]);

    if (difficultyArray.includes(undefined)) {
      difficultyArray = difficultyArray.filter((d) => d !== undefined);
    }

    if (difficultyArray.length !== 0) {
      whereClause = {
        ...whereClause,
        difficulty: { in: difficultyArray },
      };
    }
  }

  // companies should be formatted as a space-separated string of company names
  // e.g. "google microsoft amazon"
  if (companies) {
    let companyArray: (string | undefined)[] = companies
      .split(" ")
      .map((c) => COMPANIES[c as Company]);

    if (companyArray.includes(undefined)) {
      companyArray = companyArray.filter((c) => c !== undefined);
    }

    if (companyArray.length !== 0) {
      whereClause = {
        ...whereClause,
        companies: { hasSome: companyArray },
      };
    }
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
    cursor: { questionNumber: 0 },
  };
}

export async function DELETE(req: Request) {
  try {
    try {
      await prismaLib.question.deleteMany();
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: "Failed to delete questions",
          errorData: error,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
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
