/*
  Warnings:

  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `questionNumber` on the `Question` table. All the data in the column will be lost.
  - Added the required column `id` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_questionNumber_fkey";

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "questionNumber",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_questionNumber_fkey" FOREIGN KEY ("questionNumber") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
