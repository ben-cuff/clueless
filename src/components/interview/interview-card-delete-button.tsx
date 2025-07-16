import { Interview } from '@/types/interview';
import { Button } from '../ui/button';

export default function InterviewCardDeleteButton({
  interview,
  handleDeleteInterview,
}: {
  interview: Interview;
  handleDeleteInterview: (userId: number, interviewId: string) => Promise<void>;
}) {
  return (
    <Button
      variant="ghost"
      className="absolute top-0 right-2 hover:text-red-500 text-lg font-bold cursor-pointer rounded-full transition-colors bg-transparent"
      onClick={() => {
        handleDeleteInterview(interview.userId, interview.id);
      }}
    >
      ×
    </Button>
  );
}
