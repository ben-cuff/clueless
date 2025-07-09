import { UserIdContext } from "@/components/providers/user-id-provider";
import { GoalProgress } from "@/types/goal-progress";
import { GoalsAPI } from "@/utils/goals-api";
import { Goal } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

export default function useGoalProgress() {
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useContext(UserIdContext);

  useEffect(() => {
    (async () => {
      const data = await GoalsAPI.getGoalProgress(userId);
      setIsLoading(false);
      setGoalProgress(data.progress);
      setGoal(data.goal);
    })();
  }, [userId]);

  return {
    goalProgress,
    goal,
    isLoading,
  };
}
