import { prismaLib } from "@/lib/prisma";
import { get200Response, UnknownServerError } from "@/utils/api-responses";
import { getPagination, getWhereClause } from "@/utils/search-helpers";
import { Prisma, Question } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("query");

    const topics = url.searchParams.get("topics") ?? undefined;
    const difficulty = url.searchParams.get("difficulty") ?? undefined;
    const companies = url.searchParams.get("companies") ?? undefined;

    const whereClause = getWhereClause(topics, difficulty, companies, true);

    const cursor = parseInt(url.searchParams.get("cursor") ?? "0");
    const take = parseInt(url.searchParams.get("take") ?? "20");
    const skip = parseInt(url.searchParams.get("skip") ?? "0");
    const sortBy = url.searchParams.get("sortBy") ?? "id";

    const pagination = getPagination(cursor, take, skip, sortBy, true);

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

    baseQuery += pagination;

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
