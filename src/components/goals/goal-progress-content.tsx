import { GoalProgress } from '@/types/goal-progress';
import { GoalType } from '@prisma/client';
import { secondsInHour } from 'date-fns/constants';
import AnimatedProgressBar from '../ui/animated-progress-bar';
import { CardContent } from '../ui/card';

export default function GoalProgressContent({
  goalProgress,
}: {
  goalProgress: GoalProgress;
}) {
  let progressText = '';
  if (goalProgress.goalType === GoalType.QUESTION) {
    progressText = `${goalProgress.totalProgress} / ${goalProgress.targetValue} questions`;
  } else if (goalProgress.goalType === GoalType.SECOND) {
    const totalHours = (goalProgress.totalProgress / secondsInHour).toFixed(2);
    const targetHours = (goalProgress.targetValue / secondsInHour).toFixed(2);
    progressText = `${totalHours} / ${targetHours} hours`;
  } else {
    progressText = `${goalProgress.totalProgress} / ${goalProgress.targetValue}`;
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
