-- CreateEnum
CREATE TYPE "Company" AS ENUM ('GOOGLE', 'AMAZON', 'META', 'MICROSOFT', 'BLOOMBERG', 'APPLE', 'UBER', 'ADOBE', 'TIKTOK', 'ORACLE', 'LINKEDIN', 'NVIDIA', 'ROBLOX', 'INTUIT');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('CSHARP', 'CPP', 'JAVA', 'PYTHON', 'JAVASCRIPT');

-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('ARRAY', 'STRING', 'HASH_TABLE', 'DYNAMIC_PROGRAMMING', 'MATH', 'SORTING', 'GREEDY', 'DEPTH_FIRST_SEARCH', 'BINARY_SEARCH', 'DATABASE', 'MATRIX', 'TREE', 'BREADTH_FIRST_SEARCH', 'BIT_MANIPULATION', 'TWO_POINTERS', 'PREFIX_SUM', 'HEAP_PRIORITY_QUEUE', 'SIMULATION', 'BINARY_TREE', 'STACK', 'GRAPH', 'COUNTING', 'SLIDING_WINDOW', 'DESIGN', 'ENUMERATION', 'BACKTRACKING', 'UNION_FIND', 'LINKED_LIST', 'NUMBER_THEORY', 'ORDERED_SET', 'MONOTONIC_STACK', 'SEGMENT_TREE', 'TRIE', 'COMBINATORICS', 'BITMASK', 'RECURSION', 'QUEUE', 'DIVIDE_AND_CONQUER', 'BINARY_INDEXED_TREE', 'MEMOIZATION', 'BINARY_SEARCH_TREE', 'GEOMETRY', 'HASH_FUNCTION', 'STRING_MATCHING', 'TOPOLOGICAL_SORT', 'SHORTEST_PATH', 'ROLLING_HASH', 'GAME_THEORY', 'INTERACTIVE', 'DATA_STREAM', 'MONOTONIC_QUEUE', 'BRAINTEASER', 'DOUBLY_LINKED_LIST', 'MERGE_SORT', 'RANDOMIZED', 'COUNTING_SORT', 'ITERATOR', 'CONCURRENCY', 'QUICKSELECT', 'LINE_SWEEP', 'PROBABILITY_AND_STATISTICS', 'SUFFIX_ARRAY', 'BUCKET_SORT', 'MINIMUM_SPANNING_TREE', 'SHELL', 'RESERVOIR_SAMPLING', 'RADIX_SORT', 'EULERIAN_CIRCUIT', 'STRONGLY_CONNECTED_COMPONENT', 'REJECTION_SAMPLING', 'BICONNECTED_COMPONENT');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "hashed_password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "totalTime" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "questionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "testcases" JSONB NOT NULL,
    "starterCode" JSONB NOT NULL,
    "solutions" JSONB NOT NULL,
    "article" TEXT NOT NULL,
    "topics" "Topic"[],
    "prompt" TEXT NOT NULL,
    "companies" "Company"[],
    "difficulty" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("questionNumber")
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "messages" JSONB NOT NULL,
    "questionNumber" INTEGER NOT NULL,
    "code" TEXT,
    "codeLanguage" "Language" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "feedback" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE INDEX "Account_username_idx" ON "Account"("username");

-- CreateIndex
CREATE INDEX "Activity_userId_idx" ON "Activity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Activity_userId_date_key" ON "Activity"("userId", "date");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_questionNumber_fkey" FOREIGN KEY ("questionNumber") REFERENCES "Question"("questionNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "questions_title_fts_idx" ON "Question" USING gin(to_tsvector('english', title));

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;