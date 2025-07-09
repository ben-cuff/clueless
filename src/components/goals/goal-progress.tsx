import useGoalProgress from "@/hooks/use-goal-progress";
import InterviewLoading from "../interview/interview-loading";
import { Card, CardHeader } from "../ui/card";
import GoalProgressContent from "./goal-progress-content";
import GoalProgressHeader from "./goal-progress-header";

export default function GoalProgress() {
  const { isLoading, goalProgress, goal } = useGoalProgress();

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
