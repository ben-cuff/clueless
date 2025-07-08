import useCreateUpdateGoal from "@/hooks/use-create-update-goal";
import GoalCalendar from "./goal-calendar";
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
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Select Date Range</h1>
        <GoalCalendar dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      <div className="w-full mt-4">
        <GoalsTabs
          goalValue={goalValue}
          setGoalValue={setGoalValue}
          handleSubmitGoal={handleSubmitGoal}
          setGoalType={setGoalType}
          isDisabled={isSubmitting}
        />
      </div>
    </>
  );
}
