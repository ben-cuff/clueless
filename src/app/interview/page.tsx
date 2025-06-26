"use client";

import { UserIdContext } from "@/components/providers/user-id-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { READABLE_DIFFICULTIES } from "@/constants/difficulties";
import { interviewAPI } from "@/utils/interview-api";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

export default function InterviewPage() {
  const [pastInterviewData, setPastInterviewData] = useState<Interview[]>();
  const userId = useContext(UserIdContext);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      console.log(userId);
      if (userId !== -1) {
        const data = await interviewAPI.getInterviewsByUserId(userId);
        setPastInterviewData(data);
      }
    })();
  }, [userId]);

  const handleDeleteInterview = useCallback(
    async (userId: number, interviewId: string) => {
      console.log(userId, interviewId);
    },
    []
  );

  return (
    <div className="flex flex-col w-full h-vh justify-center items-center">
      <Button onClick={() => router.push("/interview/new")}>
        Start new Interview
      </Button>
      <div className="flex flex-row w-full justify-around gap-4 flex-wrap">
        {pastInterviewData &&
          pastInterviewData.map((interview) => (
            <Card
              key={interview.id}
              className="relative flex flex-row items-center gap-4 px-4 py-6 rounded shadow transition"
            >
              <button
                className="absolute top-0 right-2 hover:text-red-500 text-lg font-bold hover:cursor-pointer rounded-full transition-colors"
                onClick={() => {
                  handleDeleteInterview(interview.userId, interview.id);
                }}
              >
                ×
              </button>
              <div
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  interview.question.difficulty === 1
                    ? "bg-green-100 text-green-700"
                    : interview.question.difficulty === 2
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {READABLE_DIFFICULTIES[interview.question.difficulty]}
              </div>
              <Tooltip key={interview.id}>
                <TooltipTrigger>
                  <div className="flex-1">
                    <div className="font-medium">
                      Question {interview.questionNumber}:{" "}
                      {interview.question.title}
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
                onClick={() => {
                  router.push(
                    `/interview/${interview.id}?questionNumber=${interview.questionNumber}`
                  );
                }}
              >
                {interview.completed ? "View" : "Resume"}
              </Button>
            </Card>
          ))}
      </div>
    </div>
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
