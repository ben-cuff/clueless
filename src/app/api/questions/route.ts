import { COMPANIES } from '@/constants/companies';
import { DIFFICULTIES, Difficulty } from '@/constants/difficulties';
import { Topic, TOPICS } from '@/constants/topics';
import { prismaLib } from '@/lib/prisma';
import { Optional } from '@/types/util';
import {
  get200Response,
  get201Response,
  get400Response,
  get409Response,
  UnknownServerError,
} from '@/utils/api-responses';
import { errorLog } from '@/utils/logger';
import { getPagination, getWhereClause } from '@/utils/search-helpers';
import {
  Prisma,
  type Company as CompanyEnum,
  type Topic as TopicEnum,
} from '@prisma/client';

export async function POST(req: Request) {
  const {
    id,
    title,
    accuracy,
    testCases,
    starterCode,
    solutions,
    topics,
    prompt,
    companies,
    difficulty,
    article,
    titleSlug,
  } = await req.json().catch(() => {
    return get400Response('Invalid JSON body');
  });

  const isValid =
    typeof id === 'number' &&
    typeof title === 'string' &&
    typeof accuracy === 'number' &&
    typeof prompt === 'string' &&
    typeof difficulty === 'string' &&
    Array.isArray(topics) &&
    Array.isArray(companies) &&
    typeof testCases === 'object' &&
    typeof starterCode === 'object' &&
    typeof solutions === 'object' &&
    typeof article === 'string' &&
    typeof titleSlug === 'string';

  if (!isValid) {
    return get400Response(
      'Invalid request body. Please ensure all required fields are present and correctly formatted.'
    );
  }

  const validCompanies: Optional<string>[] = companies.map(
    (company: CompanyEnum) => COMPANIES[company as keyof typeof COMPANIES]
  );

  if (validCompanies.includes(undefined)) {
    return get400Response(
      'Invalid company name(s) provided. Please check the company names.'
    );
  }

  const validTopics: Optional<string>[] = topics.map((topic: Topic) =>
    normalizeTopic(topic)
  );

  if (validTopics.includes(undefined)) {
    return get400Response(
      'Invalid topic name(s) provided. Please check the topic names.'
    );
  }
  const validDifficulty = DIFFICULTIES[difficulty.toLowerCase() as Difficulty];

  if (validDifficulty === undefined) {
    return get400Response(
      'Invalid difficulty level provided. Please check the difficulty level.'
    );
  }

  try {
    const question = await prismaLib.question.create({
      data: {
        id,
        title,
        accuracy,
        testCases,
        starterCode,
        solutions,
        prompt,
        article,
        titleSlug,
        difficulty: validDifficulty,
        topics: validTopics as TopicEnum[],
        companies: validCompanies as CompanyEnum[],
      },
    });
    return get201Response(question);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002' // Unique constraint failed
    ) {
      return get409Response(
        `Question with id ${id} already exists. Please use a different question number.`
      );
    }
    errorLog('Error during question creation: ' + error);
    return UnknownServerError;
  }
}

function normalizeTopic(topic: Topic): Optional<string> {
  return TOPICS[
    topic
      .toLowerCase()
      .replace(/ +/g, '_')
      .replace(/-/g, '_')
      .replace(/[()]/g, '') as Topic
  ];
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const topics = url.searchParams.get('topics') ?? undefined;
    const difficulty = url.searchParams.get('difficulty') ?? undefined;
    const companies = url.searchParams.get('companies') ?? undefined;

    const NOT_RAW_SQL = false;

    const whereClause = getWhereClause(
      topics,
      difficulty,
      companies,
      NOT_RAW_SQL
    );

    const cursor = parseInt(url.searchParams.get('cursor') ?? '0');
    const take = parseInt(url.searchParams.get('take') ?? '20');
    const skip = parseInt(url.searchParams.get('skip') ?? '0');
    const sortBy = url.searchParams.get('sortBy') ?? 'id';

    const pagination =
      getPagination(cursor, take, skip, sortBy, NOT_RAW_SQL) || {};

    const questions = await prismaLib.question.findMany({
      ...pagination,
      orderBy: { id: 'asc' },
      where: whereClause,
      omit: {
        testCases: true,
        starterCode: true,
        solutions: true,
        article: true,
      },
    });

    return get200Response(questions);
  } catch (error) {
    errorLog('Error during question retrieval: ' + error);
    return UnknownServerError;
  }
}
