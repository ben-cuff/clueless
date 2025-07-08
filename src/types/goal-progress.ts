export type GoalProgress = {
  timeProgressPercentage: number;
  progressPercentage: number;
  totalProgress: number;
  targetValue: number;
  goalType: "questions" | "seconds";
};
