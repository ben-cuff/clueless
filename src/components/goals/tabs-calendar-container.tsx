import useCreateUpdateGoal from '@/hooks/use-create-update-goal';
import { GoalTabModes } from '@/types/goal-tab';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../error-fallback';
import DeleteGoalButton from './delete-goal-button';
import GoalCalendar from './goal-calendar';
import GoalCalendarHeader from './goal-calendar-header';
import GoalsTabs from './goal-tabs';

export default function TabsCalendarContainer({
  type,
  fetchGoal,
}: {
  type: GoalTabModes;
  fetchGoal: () => Promise<void>;
}) {
  const {
    dateRange,
    setDateRange,
    goalValue,
    setGoalValue,
    handleSubmitGoal,
    setGoalType,
    isSubmitting,
    handleDeleteGoal,
  } = useCreateUpdateGoal(type, fetchGoal);

  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while trying to display tabs and calendar, try again later" />
      }
    >
      <div className="flex flex-col">
        <GoalCalendarHeader>
          <GoalCalendar dateRange={dateRange} setDateRange={setDateRange} />
        </GoalCalendarHeader>
        <GoalsTabs
          className="w-full mt-4"
          goalValue={goalValue}
          setGoalValue={setGoalValue}
          handleSubmitGoal={handleSubmitGoal}
          setGoalType={setGoalType}
          isDisabled={isSubmitting}
        />
        {type === GoalTabModes.UPDATE && (
          <DeleteGoalButton handleDeleteGoal={handleDeleteGoal} />
        )}
      </div>
    </ErrorBoundary>
  );
}
