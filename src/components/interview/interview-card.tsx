import { Interview } from "@/types/interview";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DifficultyBadge from "../difficulty-badge";
import { Card } from "../ui/card";
import InterviewCardButton from "./interview-card-button";
import InterviewCardDeleteButton from "./interview-card-delete-button";
import InterviewCardTooltip from "./interview-card-tooltip";

export default function InterviewCard({
  interview,
  handleDeleteInterview,
  router,
}: {
  interview: Interview;
  handleDeleteInterview: (userId: number, interviewId: string) => Promise<void>;
  router: AppRouterInstance;
}) {
  return (
    <Card className="relative flex flex-row items-center justify-around gap-4 mx-16 p-4 rounded shadow transition">
      <InterviewCardDeleteButton
        handleDeleteInterview={handleDeleteInterview}
        interview={interview}
      />
      <DifficultyBadge difficulty={interview.question.difficulty} />
      <InterviewCardTooltip interview={interview} />
      <InterviewCardButton interview={interview} router={router} />
    </Card>
  );
}
