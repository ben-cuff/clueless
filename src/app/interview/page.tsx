"use client";

import InterviewCard from "@/components/interview/interview-card";
import { UserIdContext } from "@/components/providers/user-id-provider";
import { Button } from "@/components/ui/button";
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
      await interviewAPI.deleteInterview(userId, interviewId);
      setPastInterviewData((prev) => {
        return prev?.filter((interview) => interview.id !== interviewId);
      });
    },
    []
  );

  return (
    <div className="flex flex-col w-full h-vh justify-center items-center">
      <Button
        onClick={() => router.push("/interview/new")}
        className="hover:cursor-pointer"
      >
        Start Random Interview
      </Button>
      <div className="flex flex-row w-full justify-around gap-4 flex-wrap">
        {pastInterviewData &&
          pastInterviewData.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              handleDeleteInterview={handleDeleteInterview}
              router={router}
            />
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
