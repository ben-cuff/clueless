import { Interview } from "@/types/interview";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function InterviewCardTooltip({
  interview,
}: {
  interview: Interview;
}) {
  return (
    <Tooltip key={interview.id}>
      <TooltipTrigger>
        <div className="flex flex-row items-center text-center p-2">
          <div className="font-medium">
            Question {interview.questionNumber}: {interview.question.title}
          </div>
          <div className="text-xs ml-4">
            {new Date(interview.createdAt).toLocaleDateString()}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {new Date(interview.createdAt).toLocaleTimeString()}
      </TooltipContent>
    </Tooltip>
  );
}
