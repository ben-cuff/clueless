import { Activity, GoalType } from "@prisma/client";

const ACTIVITY_FIELD_MAP: Record<GoalType, keyof Activity> = {
  QUESTION: "questions",
  SECOND: "seconds",
};

const GOAL_TYPES: GoalType[] = ["QUESTION", "SECOND"];

export { ACTIVITY_FIELD_MAP, GOAL_TYPES };
