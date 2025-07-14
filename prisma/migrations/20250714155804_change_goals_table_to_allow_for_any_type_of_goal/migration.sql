/*
  Warnings:

  - You are about to drop the column `questions` on the `Goal` table. All the data in the column will be lost.
  - You are about to drop the column `seconds` on the `Goal` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GoalType" AS ENUM ('QUESTION', 'SECOND');

-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "questions",
DROP COLUMN "seconds",
ADD COLUMN     "goalType" "GoalType" NOT NULL DEFAULT 'QUESTION',
ADD COLUMN     "value" INTEGER NOT NULL DEFAULT 20;
