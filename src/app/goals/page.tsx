"use client";

import GoalCalendar from "@/components/goals/goal-calendar";
import GoalsTabs from "@/components/goals/goal-tabs";
import useCreateUpdateGoal from "@/hooks/use-create-update-goal";

export default function GoalPage() {
  const {
    dateRange,
    setDateRange,
    goalValue,
    setGoalValue,
    handleSubmitGoal,
    setGoalType,
    isSubmitting,
  } = useCreateUpdateGoal("create");

  return (
    <div className="flex flex-row gap-8 p-4 w-full justify-center">
      <div className="w-full">
        <h1 className="text-xl font-bold mb-4">Select Date Range</h1>
        <GoalCalendar dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      <div className="w-full">
        <GoalsTabs
          goalValue={goalValue}
          setGoalValue={setGoalValue}
          handleSubmitGoal={handleSubmitGoal}
          setGoalType={setGoalType}
          isDisabled={isSubmitting}
        />
      </div>
    </div>
  );
}
