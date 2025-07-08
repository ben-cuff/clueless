import { GoalsAPI } from "@/utils/goals-api";
import { Goal } from "@prisma/client";
import { useEffect, useState } from "react";

export default function GoalProgress({ userId }: { userId: number }) {
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await GoalsAPI.getGoalProgress(userId);
      setIsLoading(false);
      console.log(data);
      setGoalProgress(data.progress);
      setGoal(data.goal);
    })();
  }, [userId]);

  if (isLoading) return <p>Loading...</p>;
  if (!goalProgress) return <p>No goal progress found.</p>;

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-2">Goal Progress</h3>
      <div className="mb-2 text-sm">
        <span>
          {goalProgress.goalType === "questions"
            ? `${goalProgress.totalProgress} / ${goalProgress.targetValue} questions`
            : `${goalProgress.totalProgress} / ${goalProgress.targetValue} seconds`}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded h-6 overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all duration-300"
          style={{ width: `${goalProgress.progressPercentage}%` }}
        />
      </div>
    <div className="mt-1 text-xs">
      {goalProgress.progressPercentage.toFixed(2)}% complete
    </div>
    <div className="mt-2 text-xs text-gray-500">
      Time elapsed: {goalProgress.timeProgressPercentage.toFixed(2)}%
    </div>
    </div>
  );
}

type GoalProgress = {
  timeProgressPercentage: number;
  progressPercentage: number;
  totalProgress: number;
  targetValue: number;
  goalType: "questions" | "seconds";
};
