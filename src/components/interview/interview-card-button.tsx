import { Interview } from "@/types/interview";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useCallback } from "react";
import { Button } from "../ui/button";

export default function InterviewCardButton({
  interview,
  router,
}: {
  interview: Interview;
  router: AppRouterInstance;
}) {
  const handleClick = useCallback(() => {
    if (interview.completed) {
      router.push(
        `/interview/feedback/${interview.id}?questionNumber=${interview.questionNumber}`
      );
    } else {
      router.push(
        `/interview/${interview.id}?questionNumber=${interview.questionNumber}`
      );
    }
  }, [interview.completed, interview.id, interview.questionNumber, router]);

  return (
    <Button variant="outline" onClick={handleClick}>
      {interview.completed ? "View Feedback" : "Resume"}
    </Button>
  );
}
