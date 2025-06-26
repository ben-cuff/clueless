"use client";

import { UserIdContext } from "@/components/providers/user-id-provider";
import { Button } from "@/components/ui/button";
import { interviewAPI } from "@/utils/interview-api";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function InterviewPage() {
  const router = useRouter();
  const [pastInterviewData, setPastInterviewData] = useState<Interview[]>();
  const userId = useContext(UserIdContext);

  useEffect(() => {
    (async () => {
      console.log(userId);
      if (userId !== -1) {
        const data = await interviewAPI.getInterviewsByUserId(userId);
        setPastInterviewData(data);
      }
    })();
  }, [userId]);

  return (
    <div className="flex w-full h-vh justify-center items-center">
      <Button onClick={() => router.push("/interview/new")}>
        Start new Interview
      </Button>
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
}
