import { COMPANIES, Company } from "@/constants/companies";
import { DIFFICULTIES, Difficulty } from "@/constants/difficulties";
import { Topic, TOPICS } from "@/constants/topics";
import { prismaLib } from "@/lib/prisma";
import { get200Response, UnknownServerError } from "@/utils/api-responses";
import { Prisma, Question } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("query");

    const whereClause = getWhereClause(url);
    const paginationSQL = getPaginationSQL(url);

    let baseQuery = `
      SELECT 
        "id", 
        "title",
        "accuracy", 
        "difficulty",
        "topics",
        "companies",
        "titleSlug",
        ts_rank(to_tsvector('english', "title"), plainto_tsquery('english', $1)) AS rank
      FROM "Question"
      WHERE 1=1
    `;

    if (search) {
      baseQuery += `
        AND (
          to_tsvector('english', "title") @@ plainto_tsquery('english', $1)
          OR levenshtein(lower("title"), lower($1)) <= 3
        )
      `;
    }

    if (whereClause) {
      baseQuery += ` AND ${whereClause}`;
    }

    baseQuery += paginationSQL;

    // use of any here is straight fronm Prisma documentation, Also this should be safe
    // https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/raw-queries#safely-using-queryraw-and-executeraw-in-more-complex-scenarios
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlQuery: any = Prisma.sql([baseQuery]);

    sqlQuery.values = [search ?? ""];

    const questions: Array<Question> = await prismaLib.$queryRaw(sqlQuery);

    if (
      questions &&
      questions.length > 1 &&
      questions[0].id > questions[1].id
    ) {
      return get200Response(questions.reverse());
    }

    return get200Response(questions);
  } catch (error) {
    console.error("Error during question search:", error);
    return UnknownServerError;
  }
}

function getWhereClause(url: URL) {
  const topics = url.searchParams.get("topics");
  const difficulty = url.searchParams.get("difficulty");
  const companies = url.searchParams.get("companies");

  let whereClause = "";

  // topics should be formatted as a space-separated string of topic keys
  if (topics) {
    let topicArray: (string | undefined)[] = topics
      .split(" ")
      .map((t) => TOPICS[t as Topic]);
    topicArray = topicArray.filter((t) => t !== undefined);
    if (topicArray.length !== 0) {
      if (whereClause) {
        whereClause += " AND ";
      }
      whereClause += `"topics" && ARRAY[${topicArray
        .map((t) => `'${t}'`)
        .join(",")}]::"Topic"[]`;
    }
  }

  // difficulty should be formatted as a space-separated string of difficulty levels
  if (difficulty) {
    let difficultyArray: (number | undefined)[] = difficulty
      .split(" ")
      .map((d) => DIFFICULTIES[d as Difficulty]);
    difficultyArray = difficultyArray.filter((d) => d !== undefined);
    if (difficultyArray.length !== 0) {
      if (whereClause) {
        whereClause += " AND ";
      }
      whereClause += `"difficulty" IN (${difficultyArray
        .map((d) => `'${d}'`)
        .join(",")})`;
    }
  }

  // companies should be formatted as a space-separated string of company keys
  if (companies) {
    let companyArray: (string | undefined)[] = companies
      .split(" ")
      .map((c) => COMPANIES[c as Company]);
    companyArray = companyArray.filter((c) => c !== undefined);
    if (companyArray.length !== 0) {
      if (whereClause) {
        whereClause += " AND ";
      }
      whereClause += `"companies" && ARRAY[${companyArray
        .map((c) => `'${c}'`)
        .join(",")}]::"Company"[]`;
    }
  }

  return whereClause;
}

function getPaginationSQL(url: URL) {
  const cursor = parseInt(url.searchParams.get("cursor") || "0");
  const take = parseInt(url.searchParams.get("take") || "20");
  const skip = parseInt(url.searchParams.get("skip") || "0");
  const sortBy = url.searchParams.get("sortBy") || "id";

  let cursorClause = "";
  if (cursor !== 0) {
    cursorClause = ` AND "id" > ${cursor}`;
  }

  let orderLimitOffset = "";
  if (sortBy === "rank") {
    orderLimitOffset += ` ORDER BY "rank" DESC`;
  } else {
    orderLimitOffset += ` ORDER BY "id" ASC`;
  }

  if (skip > 0) {
    orderLimitOffset += ` OFFSET ${skip}`;
  }
  if (take < 0) {
    orderLimitOffset += ` LIMIT ${-take}`;
    if (cursor !== 0) {
      cursorClause = ` AND "id" < ${cursor}`;
    }
    orderLimitOffset = orderLimitOffset.replace(
      'ORDER BY "id" ASC',
      'ORDER BY "id" DESC'
    );
  } else {
    orderLimitOffset += ` LIMIT ${take}`;
  }

  return cursorClause + orderLimitOffset;
}
