import { prismaLib } from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        // TODO: add filtering by difficulty, topics, companies
        // TODO: add pagination

    const url = new URL(req.url);
    const search = url.searchParams.get("query");

    if (!search) {
      return new Response(
        JSON.stringify({ error: "Search query is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const questions = await prismaLib.$queryRaw`
      SELECT 
        "questionNumber", 
        "title", 
        "accuracy", 
        "difficulty",
        "topics",
        "companies",
        "prompt", 
        "createdAt", 
        "updatedAt",
        ts_rank(to_tsvector('english', "title"), plainto_tsquery('english', ${search})) AS rank
      FROM "Question"
      WHERE
        to_tsvector('english', "title") @@ plainto_tsquery('english', ${search})
        OR levenshtein(lower("title"), lower(${search})) <= 3
      ORDER BY rank DESC
      LIMIT 20
    `;

    return new Response(JSON.stringify({ questions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error during question search:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
