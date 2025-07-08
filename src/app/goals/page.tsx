"use client";

import GoalCalendar from "@/components/goals/goal-calendar";
import GoalsTabs from "@/components/goals/goal-tabs";
import { TWO_WEEKS_IN_MILLISECONDS } from "@/constants/time";
import { GoalsAPI } from "@/utils/goals-api";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

export default function GoalPage() {
  const DATE_TWO_WEEKS_FROM_NOW = useMemo(
    () => new Date(Date.now() + TWO_WEEKS_IN_MILLISECONDS),
    []
  );

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: DATE_TWO_WEEKS_FROM_NOW,
  });
  const [goalValue, setGoalValue] = useState(20);
  const [goalType, setGoalType] = useState<"hours" | "questions">("hours");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleSubmitGoal = useCallback(async () => {
    setIsSubmitting(true);
    GoalsAPI.createGoal(
      session?.user.id ?? -1, // -1 meaning does not exist
      goalType,
      goalValue,
      dateRange.to ?? DATE_TWO_WEEKS_FROM_NOW // default goal of 2 weeks from now
    );
    setIsSubmitting(false);
  }, [
    DATE_TWO_WEEKS_FROM_NOW,
    dateRange.to,
    goalType,
    goalValue,
    session?.user.id,
  ]);

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
