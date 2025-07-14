import { GoalType } from "@prisma/client";

export type GoalProgress = {
  timeProgressPercentage: number;
  progressPercentage: number;
  totalProgress: number;
  targetValue: number;
  goalType: GoalType;
};
