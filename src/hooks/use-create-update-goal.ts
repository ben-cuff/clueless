import { UserIdContext } from "@/components/providers/user-id-provider";
import { TWO_WEEKS_IN_MILLISECONDS } from "@/constants/time";
import { GoalsAPI } from "@/utils/goals-api";
import { useCallback, useContext, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

export default function useCreateUpdateGoal(type: "update" | "create") {
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
  const userId = useContext(UserIdContext);
  const NO_USER_ID = -1;

  const handleSubmitGoal = useCallback(async () => {
    setIsSubmitting(true);
    if (type === "update") {
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
    window.location.reload(); // reload to reflect changes
    setIsSubmitting(false);
  }, [
    DATE_TWO_WEEKS_FROM_NOW,
    dateRange.to,
    goalType,
    goalValue,
    userId,
    type,
  ]);

  return {
    dateRange,
    setDateRange,
    goalValue,
    setGoalValue,
    handleSubmitGoal,
    setGoalType,
    isSubmitting,
  };
}
