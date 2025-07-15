import { Interview } from "@/types/interview";
import { InterviewType } from "@prisma/client";
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
  const isInterviewDone =
    interview.completed || interview.type === InterviewType.TIMED;

  const handleClick = useCallback(() => {
    if (isInterviewDone) {
      router.push(
        `/interview/feedback/${interview.id}?questionNumber=${interview.questionNumber}`
      );
    } else {
      router.push(
        `/interview/${interview.id}?questionNumber=${interview.questionNumber}`
      );
    }
  }, [interview.id, interview.questionNumber, isInterviewDone, router]);

  return (
    <Button variant="outline" onClick={handleClick}>
      {isInterviewDone ? "View Feedback" : "Resume"}
    </Button>
  );
}
