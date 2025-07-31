import { Interview } from '@/types/interview';
import { InterviewType } from '@prisma/client';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import DifficultyBadge from '../difficulty-badge';
import { Card } from '../ui/card';
import FeedbackLabel from './feedback-label';
import InterviewCardButton from './interview-card-button';
import InterviewCardDeleteButton from './interview-card-delete-button';
import InterviewCardWithTooltip from './interview-card-tooltip';

export default function InterviewCard({
  interview,
  handleDeleteInterview,
  router,
}: {
  interview: Interview;
  handleDeleteInterview: (userId: number, interviewId: string) => Promise<void>;
  router: AppRouterInstance;
}) {
  const feedbackNumber =
    interview.feedback?.feedbackNumber != null &&
    interview.feedback.feedbackNumber !== -1
      ? interview.feedback?.feedbackNumber
      : undefined;

  return (
    <Card className="relative flex flex-row items-center justify-between gap-4 mx-16 p-4 h-20 rounded shadow transition">
      <InterviewCardDeleteButton
        handleDeleteInterview={handleDeleteInterview}
        interview={interview}
      />
      <div className="flex justify-center w-1/6">
        <DifficultyBadge difficulty={interview.question.difficulty} />
      </div>
      {feedbackNumber ? (
        <FeedbackLabel feedbackNumber={feedbackNumber} />
      ) : (
        <div className="w-1/6" />
      )}
      <div className="flex justify-center w-2/6">
        <InterviewCardWithTooltip interview={interview} />
      </div>
      <div className="flex justify-center text-red-500 w-1/6">
        {interview.type === InterviewType.TIMED && 'Timed'}
      </div>
      <div className="flex justify-center w-1/6">
        <InterviewCardButton interview={interview} router={router} />
      </div>
    </Card>
  );
}
