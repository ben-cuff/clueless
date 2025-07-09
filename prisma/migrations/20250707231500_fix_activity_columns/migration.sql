-- This migration fixes the schema drift detected in the Activity table
-- Removing count and totalTime columns and adding minutes and questions columns

-- AlterTable
ALTER TABLE "Activity" DROP COLUMN IF EXISTS "count",
DROP COLUMN IF EXISTS "totalTime",
ADD COLUMN IF NOT EXISTS "minutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "questions" INTEGER NOT NULL DEFAULT 0;
