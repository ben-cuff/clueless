import { Button } from '../ui/button';

export default function EndInterviewButton({
  handleEndInterview,
}: {
  handleEndInterview: () => void;
}) {
  return (
    <Button onClick={handleEndInterview} className="fixed top-16 left-4 z-50">
      End Interview Early
    </Button>
  );
}
