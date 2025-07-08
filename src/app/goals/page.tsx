"use client";

import CreateGoalPage from "@/components/goals/create-goal-page";
import GoalViewPage from "@/components/goals/goal-view-page";
import InterviewLoading from "@/components/interview/interview-loading";
import { UserIdContext } from "@/components/providers/user-id-provider";
import { GoalsAPI } from "@/utils/goals-api";
import { Goal } from "@prisma/client";
import { useContext, useEffect, useState } from "react";

export default function GoalPage() {
  const userId = useContext(UserIdContext);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await GoalsAPI.getGoal(userId);
      setIsLoading(false);
      console.log(data);
      setGoal(data);
    })();
  }, [userId]);

  if (isLoading) {
    return <InterviewLoading />;
  }

  if (goal) {
    return <GoalViewPage goal={goal} userId={userId} />;
  }

  return <CreateGoalPage />;
}
