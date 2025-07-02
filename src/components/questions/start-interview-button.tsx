import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function StartInterviewButton({
  questionNumber,
}: {
  questionNumber: number;
}) {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.push(`/interview/new?questionNumber=${questionNumber}`);
      }}
    >
      Start Interview
    </Button>
  );
}
