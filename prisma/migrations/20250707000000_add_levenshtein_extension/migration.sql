-- This migration adds the Levenshtein extension to the database

-- Create Levenshtein extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";
