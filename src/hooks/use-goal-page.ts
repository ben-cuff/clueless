import { UserIdContext } from "@/components/providers/user-id-provider";
import { GoalsAPI } from "@/utils/goals-api";
import { Goal } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

export default function useGoalPage() {
  const userId = useContext(UserIdContext);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await GoalsAPI.getGoal(userId);
      setIsLoading(false);
      setGoal(data);
    })();
  }, [userId]);

  return { isLoading, goal };
}
