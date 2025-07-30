import { Button } from '../ui/button';

export default function EndInterviewButton({
  handleEndInterview,
  className,
}: {
  handleEndInterview: () => void;
  className?: string;
}) {
  return (
    <Button onClick={handleEndInterview} className={className}>
      End Interview Early
    </Button>
  );
}
