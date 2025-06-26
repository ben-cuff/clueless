import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DifficultyBadge from "../diffculty-badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

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
    <Card className="relative flex flex-row items-center gap-4 px-4 py-6 rounded shadow transition">
      <button
        className="absolute top-0 right-2 hover:text-red-500 text-lg font-bold hover:cursor-pointer rounded-full transition-colors"
        onClick={() => {
          handleDeleteInterview(interview.userId, interview.id);
        }}
      >
        ×
      </button>
      <DifficultyBadge difficulty={interview.question.difficulty} />
      <Tooltip key={interview.id}>
        <TooltipTrigger>
          <div className="flex-1">
            <div className="font-medium">
              Question {interview.questionNumber}: {interview.question.title}
            </div>
            <div className="text-xs ">
              {new Date(interview.createdAt).toLocaleDateString()}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {new Date(interview.createdAt).toLocaleTimeString()}
        </TooltipContent>
      </Tooltip>
      <Button
        variant="outline"
        className="hover:cursor-pointer"
        onClick={() => {
          router.push(
            `/interview/${interview.id}?questionNumber=${interview.questionNumber}`
          );
        }}
      >
        {interview.completed ? "View" : "Resume"}
      </Button>
    </Card>
  );
}

interface Interview {
  code: string;
  codeLanguage: string;
  completed: boolean;
  createdAt: string;
  feedback: string | null;
  id: string;
  messages: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  questionNumber: number;
  updatedAt: string;
  userId: number;
  question: { difficulty: 1 | 2 | 3; title: string };
}
