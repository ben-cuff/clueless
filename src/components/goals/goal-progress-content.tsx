import { GoalProgress } from "@/types/goal-progress";
import AnimatedProgressBar from "../ui/animated-progress-bar";
import { CardContent } from "../ui/card";

export default function GoalProgressContent({
  goalProgress,
}: {
  goalProgress: GoalProgress;
}) {
  return (
    <CardContent className="flex flex-col items-center gap-6 mt-4">
      <div className="mb-2 text-lg">
        <span>
          {goalProgress.goalType === "questions"
            ? `${goalProgress.totalProgress} / ${goalProgress.targetValue} questions`
            : `${goalProgress.totalProgress} / ${goalProgress.targetValue} seconds`}
        </span>
      </div>
      <div className="w-full rounded h-12 overflow-hidden border border-gray-400">
        <AnimatedProgressBar progress={goalProgress.progressPercentage} />
      </div>
      <div className="mt-2 text-base">
        {goalProgress.progressPercentage.toFixed(2)}% complete
      </div>
      <div className="mt-2 text-base">
        Time elapsed: {goalProgress.timeProgressPercentage.toFixed(2)}%
      </div>
    </CardContent>
  );
}
