import useCreateUpdateGoal from "@/hooks/use-create-update-goal";
import GoalCalendar from "./goal-calendar";
import GoalCalendarHeader from "./goal-calendar-header";
import GoalsTabs from "./goal-tabs";

export default function TabsCalendarContainer({
  type,
}: {
  type: "create" | "update";
}) {
  const {
    dateRange,
    setDateRange,
    goalValue,
    setGoalValue,
    handleSubmitGoal,
    setGoalType,
    isSubmitting,
  } = useCreateUpdateGoal(type);

  return (
    <>
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
    </>
  );
}
