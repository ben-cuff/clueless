import { COMPANIES, Company } from "@/constants/companies";
import { DIFFICULTIES, Difficulty } from "@/constants/difficulties";
import { Topic, TOPICS } from "@/constants/topics";
import { Optional } from "@/types/util";

function getWhereClause(
  topics = "",
  difficulty = "",
  companies = "",
  useRawSQL = true
) {
  if (useRawSQL) {
    return getRawSQLWhereClause(topics, difficulty, companies);
  } else {
    return getPrismaWhereClause(companies, topics, difficulty);
  }
}

function getPrismaWhereClause(companies = "", topics = "", difficulty = "") {
  let whereClause = {};

  // Process topics
  if (topics) {
    const topicArray: Optional<string>[] = topics
      .split(" ")
      .map((t) => TOPICS[t as Topic])
      .filter((t) => t !== undefined);

    if (topicArray.length !== 0) {
      whereClause = {
        topics: {
          hasSome: topicArray,
        },
      };
    }
  }

  // Process difficulty
  if (difficulty) {
    const difficultyArray: Optional<number>[] = difficulty
      .split(" ")
      .map((d) => DIFFICULTIES[d as Difficulty])
      .filter((d) => d !== undefined);

    if (difficultyArray.length !== 0) {
      whereClause = {
        ...whereClause,
        difficulty: { in: difficultyArray },
      };
    }
  }

  // Process companies
  if (companies) {
    const companyArray: Optional<string>[] = companies
      .split(" ")
      .map((c) => COMPANIES[c as Company])
      .filter((c) => c !== undefined);

    if (companyArray.length !== 0) {
      whereClause = {
        ...whereClause,
        companies: { hasSome: companyArray },
      };
    }
  }

  return whereClause;
}

function getRawSQLWhereClause(topics = "", difficulty = "", companies = "") {
  let whereClause = "";

  // topics should be formatted as a space-separated string of topic keys
  if (topics) {
    let topicArray: Optional<string>[] = topics
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
    let difficultyArray: Optional<number>[] = difficulty
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
    let companyArray: Optional<string>[] = companies
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

function getPagination(
  cursor = 0,
  take = 20,
  skip = 0,
  sortBy = "id",
  useRawSQL = true
) {
  if (useRawSQL) {
    return getRawSQLPagination(cursor, take, skip, sortBy);
  } else {
    return getPrismaPagination(cursor, take, skip);
  }
}

function getRawSQLPagination(cursor = 0, take = 20, skip = 0, sortBy = "id") {
  const sqlConfig: {
    where?: string;
    orderBy?: string;
    offset?: number;
    limit?: number;
  } = {};

  if (cursor !== 0) {
    if (take < 0) {
      sqlConfig.where = `"id" < ${cursor}`;
    } else {
      sqlConfig.where = `"id" > ${cursor}`;
    }
  }

  if (sortBy === "rank") {
    sqlConfig.orderBy = `"rank" DESC`;
  } else {
    sqlConfig.orderBy = take < 0 ? `"id" DESC` : `"id" ASC`;
  }

  if (skip > 0) {
    sqlConfig.offset = skip;
  }

  sqlConfig.limit = Math.abs(take);

  const sql = `
    ${sqlConfig.where ? `AND ${sqlConfig.where}` : ""}
    ${sqlConfig.orderBy ? `ORDER BY ${sqlConfig.orderBy}` : ""}
    ${sqlConfig.offset !== undefined ? `OFFSET ${sqlConfig.offset}` : ""}
    ${sqlConfig.limit !== undefined ? `LIMIT ${sqlConfig.limit}` : ""}
  `.trim();

  return sql;
}

function getPrismaPagination(cursor = 0, take = 20, skip = 0) {
  if (cursor !== 0) {
    return {
      take,
      skip: 1 + skip, // skip the cursor question
      cursor: {
        id: cursor,
      },
    };
  }

  return {
    take,
    skip,
    cursor: { id: 1 },
  };
}

export { getPagination, getWhereClause };
