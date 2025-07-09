-- Rename minutes columns to seconds without changing the values
ALTER TABLE "Activity" RENAME COLUMN "minutes" TO "seconds";
ALTER TABLE "Goal" RENAME COLUMN "minutes" TO "seconds";
