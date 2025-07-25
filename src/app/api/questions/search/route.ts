import { prismaLib } from '@/lib/prisma';
import { QuestionWithRowNumber } from '@/types/question';
import { get200Response } from '@/utils/api-responses';
import { getWhereClause } from '@/utils/search-helpers';
import { Prisma } from '@prisma/client';

export async function GET(req: Request) {
  const url = new URL(req.url);

  const topics = url.searchParams.get('topics') ?? undefined;
  const difficulty = url.searchParams.get('difficulty') ?? undefined;
  const companies = url.searchParams.get('companies') ?? undefined;
  const IS_RAW_SQL = true;

  const whereFilters = getWhereClause(
    topics,
    difficulty,
    companies,
    IS_RAW_SQL
  );

  const cursor = parseInt(url.searchParams.get('cursor') ?? '0');
  const take = parseInt(url.searchParams.get('take') ?? '20');

  const [min_number, max_number] = getPaginationRange(cursor, take);

  const search = url.searchParams.get('query');

  const query = `
    WITH ranked_questions AS (
      SELECT
        "id",
        "title",
        "accuracy",
        "difficulty",
        "topics",
        "companies",
        "titleSlug",
        ts_rank(
          to_tsvector('english', "title"),
          plainto_tsquery('english', $1)
        ) AS rank,
        ROW_NUMBER() OVER (ORDER BY "id" ASC) AS row_num
      FROM
        "Question"
      WHERE
        1=1
        ${whereFilters ? ` AND ${whereFilters}` : ''}
        ${
          search
            ? `AND (
                to_tsvector('english', "title") @@ plainto_tsquery('english', $1)
                OR levenshtein(lower("title"), lower($1)) <= 3
              )`
            : ''
        }
    ),
    total_count AS (
      SELECT COUNT(*) AS count FROM ranked_questions
    )
    SELECT rq.*, tc.count as total_count
    FROM ranked_questions rq, total_count tc
    WHERE
      rq.row_num > ${min_number}
      AND rq.row_num <= ${max_number}
    ORDER BY rq.row_num
  `;

  // should be safe based on prisma docs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sqlQuery: any = Prisma.sql([query]);

  sqlQuery.values = [search ?? ''];

  const questions: Array<QuestionWithRowNumber> = await prismaLib.$queryRaw(
    sqlQuery
  );

  // converts bigint to string for JSON serialization
  const questionsSerialized = questions.map((q) => ({
    ...q,
    row_num: typeof q.row_num === 'bigint' ? q.row_num.toString() : q.row_num,
    total_count:
      typeof q.total_count === 'bigint'
        ? q.total_count.toString()
        : q.total_count,
  }));

  return get200Response(questionsSerialized);
}

// Utility function to get the pagination range based on cursor and take size
function getPaginationRange(cursor: number, take: number): [number, number] {
  return take < 0
    ? [cursor - Math.abs(take), cursor]
    : [cursor, cursor + Math.abs(take)];
}
