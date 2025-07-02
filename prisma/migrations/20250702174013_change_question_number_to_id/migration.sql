-- This is an empty migration.
ALTER TABLE "Question" RENAME COLUMN "questionNumber" TO "id";
ALTER TABLE "Interview" RENAME COLUMN "questionNumber" TO "questionId";
ALTER TABLE "Interview" DROP CONSTRAINT IF EXISTS "Interview_questionNumber_fkey";
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE;