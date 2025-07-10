import { UserIdContext } from "@/components/providers/user-id-provider";
import { GoalsAPI } from "@/utils/goals-api";
import { Goal } from "@prisma/client";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useGoalPage() {
  const userId = useContext(UserIdContext);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoal = useCallback(async () => {
    setIsLoading(true);
    const data = await GoalsAPI.getGoal(userId);
    setGoal(data);
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return { isLoading, goal, fetchGoal };
}
