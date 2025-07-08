import { GoalsAPI } from "@/utils/goals-api";
import { Goal } from "@prisma/client";
import { useEffect, useState } from "react";
import InterviewLoading from "../interview/interview-loading";
import { Card, CardHeader } from "../ui/card";
import GoalProgressContent from "./goal-progress-content";
import GoalProgressHeader from "./goal-progress-header";

export default function GoalProgress({ userId }: { userId: number }) {
  const [goalProgress, setGoalProgress] = useState<GoalProgress | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await GoalsAPI.getGoalProgress(userId);
      setIsLoading(false);
      setGoalProgress(data.progress);
      setGoal(data.goal);
    })();
  }, [userId]);

  if (isLoading) {
    return <InterviewLoading />;
  } else if (!goalProgress) {
    return (
      <div className="w-full">
        <Card className="min-h-[200px] text-center justify-center">
          <CardHeader>No Progress found</CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Card className="min-h-[500px] flex flex-col justify-center">
        <GoalProgressHeader
          endDate={goal?.endDate ?? new Date()}
          beginAt={goal?.beginAt ?? new Date()}
        />
        <GoalProgressContent goalProgress={goalProgress} />
      </Card>
    </div>
  );
}
