import { Interview } from "@/types/interview";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Button } from "../ui/button";

export default function InterviewCardButton({
  interview,
  router,
}: {
  interview: Interview;
  router: AppRouterInstance;
}) {
  return (
    <Button
      variant="outline"
      onClick={() => {
        if (interview.completed) {
          router.push(
            `/interview/feedback/${interview.id}?questionNumber=${interview.questionNumber}`
          );
        } else {
          router.push(
            `/interview/${interview.id}?questionNumber=${interview.questionNumber}`
          );
        }
      }}
    >
      {interview.completed ? "View Feedback" : "Resume"}
    </Button>
  );
}
