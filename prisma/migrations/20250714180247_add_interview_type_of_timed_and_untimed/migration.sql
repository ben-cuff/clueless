-- CreateEnum
CREATE TYPE "InterviewType" AS ENUM ('TIMED', 'UNTIMED');

-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "type" "InterviewType" NOT NULL DEFAULT 'UNTIMED';
