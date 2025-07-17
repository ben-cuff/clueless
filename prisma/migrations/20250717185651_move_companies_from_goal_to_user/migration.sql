/*
  Warnings:

  - You are about to drop the column `companies` on the `Goal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Goal" DROP COLUMN "companies";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companies" "Company"[];
