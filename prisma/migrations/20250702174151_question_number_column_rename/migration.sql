/*
  Warnings:

  - You are about to drop the column `questionId` on the `Interview` table. All the data in the column will be lost.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Question` table. All the data in the column will be lost.
  - Added the required column `questionNumber` to the `Interview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionNumber` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_questionId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "questionId",
ADD COLUMN     "questionNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "id",
ADD COLUMN     "questionNumber" INTEGER NOT NULL,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("questionNumber");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_questionNumber_fkey" FOREIGN KEY ("questionNumber") REFERENCES "Question"("questionNumber") ON DELETE CASCADE ON UPDATE CASCADE;
