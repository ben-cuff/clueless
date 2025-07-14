import { Activity, GoalType } from "@prisma/client";

const ACTIVITY_FIELD_MAP: Record<GoalType, keyof Activity> = {
  QUESTION: "questions",
  SECOND: "seconds",
};

const GOAL_TYPES_ARRAY: GoalType[] = ["QUESTION", "SECOND"];

export { ACTIVITY_FIELD_MAP, GOAL_TYPES_ARRAY };
