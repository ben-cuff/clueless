import { SECONDS_IN_HOUR } from "@/constants/time";
import { GoalProgress } from "@/types/goal-progress";
import AnimatedProgressBar from "../ui/animated-progress-bar";
import { CardContent } from "../ui/card";

export default function GoalProgressContent({
  goalProgress,
}: {
  goalProgress: GoalProgress;
}) {
  let progressText = "";
  if (goalProgress.goalType === "questions") {
    progressText = `${goalProgress.totalProgress} / ${goalProgress.targetValue} questions`;
  } else {
    const totalHours = (goalProgress.totalProgress / SECONDS_IN_HOUR).toFixed(
      2
    );
    const targetHours = (goalProgress.targetValue / SECONDS_IN_HOUR).toFixed(2);
    progressText = `${totalHours} / ${targetHours} hours`;
  }

  return (
    <CardContent className="flex flex-col items-center gap-6 mt-4">
      <div className="mb-2 text-lg">
        <span>{progressText}</span>
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
