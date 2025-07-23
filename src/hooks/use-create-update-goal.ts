import { UserIdContext } from '@/components/providers/user-id-provider';
import { GoalCategoryTabs, GoalTabModes } from '@/types/goal-tab';
import { GoalsAPI, handleGoalsAPIError } from '@/utils/goals-api';
import { millisecondsInWeek } from 'date-fns/constants';
import { useCallback, useContext, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';

export default function useCreateUpdateGoal(
  type: GoalTabModes,
  fetchGoal: () => Promise<void>
) {
  const DATE_TWO_WEEKS_FROM_NOW = useMemo(
    () => new Date(Date.now() + millisecondsInWeek * 2),
    []
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: DATE_TWO_WEEKS_FROM_NOW,
  });
  const [goalValue, setGoalValue] = useState(20);
  const [goalType, setGoalType] = useState<GoalCategoryTabs>(
    GoalCategoryTabs.HOURS
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = useContext(UserIdContext);

  const handleSubmitGoal = useCallback(async () => {
    const NO_USER_ID = -1;
    setIsSubmitting(true);

    try {
      if (type === GoalTabModes.UPDATE) {
        await GoalsAPI.updateGoal(
          userId ?? NO_USER_ID,
          goalType,
          goalValue,
          dateRange.to ?? DATE_TWO_WEEKS_FROM_NOW // default goal of 2 weeks from now
        );
      } else {
        await GoalsAPI.createGoal(
          userId ?? NO_USER_ID,
          goalType,
          goalValue,
          dateRange.to ?? DATE_TWO_WEEKS_FROM_NOW // default goal of 2 weeks from now
        );
      }
    } catch (error) {
      handleGoalsAPIError(error as Error, 'While submitting goal:');
    }
    setIsSubmitting(false);
    fetchGoal();
  }, [
    type,
    fetchGoal,
    userId,
    goalType,
    goalValue,
    dateRange.to,
    DATE_TWO_WEEKS_FROM_NOW,
  ]);

  const handleDeleteGoal = useCallback(async () => {
    if (userId === undefined || userId === -1) return;

    setIsSubmitting(true);
    try {
      await GoalsAPI.deleteGoal(userId);
      fetchGoal();
    } catch (error) {
      handleGoalsAPIError(error as Error, 'While deleting goal:');
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchGoal, userId]);

  return {
    dateRange,
    setDateRange,
    goalValue,
    setGoalValue,
    handleSubmitGoal,
    setGoalType,
    isSubmitting,
    handleDeleteGoal,
  };
}
