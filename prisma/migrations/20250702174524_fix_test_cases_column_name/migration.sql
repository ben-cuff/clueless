/*
  Warnings:

  - You are about to drop the column `testcases` on the `Question` table. All the data in the column will be lost.
  - Added the required column `testCases` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "testcases",
ADD COLUMN     "testCases" JSONB NOT NULL;
