import { UserIdContext } from '@/components/providers/user-id-provider';
import { GoalProgress } from '@/types/goal-progress';
import { Nullable } from '@/types/util';
import { GoalsAPI, handleGoalsAPIError } from '@/utils/api/goals-api';
import { Goal } from '@prisma/client';
import { useContext, useEffect, useState } from 'react';

export default function useGoalProgress() {
  const [goalProgress, setGoalProgress] =
    useState<Nullable<GoalProgress>>(null);
  const [goal, setGoal] = useState<Nullable<Goal>>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = useContext(UserIdContext);

  useEffect(() => {
    (async () => {
      try {
        const data = await GoalsAPI.getGoalProgress(userId);
        setGoal(data.goal);
        setGoalProgress(data.progress);
      } catch (error) {
        handleGoalsAPIError(error as Error, 'While fetching goal:');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  return {
    goalProgress,
    goal,
    isLoading,
  };
}
