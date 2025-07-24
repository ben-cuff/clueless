import { UserIdContext } from '@/components/providers/user-id-provider';
import { Nullable } from '@/types/util';
import { GoalsAPI, handleGoalsAPIError } from '@/utils/goals-api';
import { Goal } from '@prisma/client';
import { useCallback, useContext, useEffect, useState } from 'react';

export default function useGoalPage() {
  const userId = useContext(UserIdContext);
  const [goal, setGoal] = useState<Nullable<Goal>>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGoal = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await GoalsAPI.getGoal(userId);
      setGoal(data);
    } catch (error) {
      handleGoalsAPIError(error as Error, 'While fetching goal:');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchGoal();
  }, [fetchGoal]);

  return { isLoading, goal, fetchGoal };
}
