import useCreateUpdateGoal from "@/hooks/use-create-update-goal";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../error-fallback";
import GoalCalendar from "./goal-calendar";
import GoalCalendarHeader from "./goal-calendar-header";
import GoalsTabs from "./goal-tabs";

export default function TabsCalendarContainer({
  type,
  fetchGoal,
}: {
  type: "create" | "update";
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
  } = useCreateUpdateGoal(type, fetchGoal);

  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while trying to display tabs and calendar, try again later" />
      }
    >
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
    </ErrorBoundary>
  );
}
