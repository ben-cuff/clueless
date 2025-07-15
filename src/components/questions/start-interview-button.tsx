import { InterviewType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "../ui/button";

export default function StartInterviewButton({
  questionNumber,
  text,
  type,
}: {
  questionNumber: number;
  text?: string;
  type?: InterviewType;
}) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    const params = new URLSearchParams({
      questionNumber: questionNumber.toString(),
    });
    if (type === InterviewType.TIMED) {
      params.set("type", InterviewType.TIMED);
    }
    router.push(`/interview/new?${params.toString()}`);
  }, [questionNumber, router, type]);

  return <Button onClick={handleClick}>{text ?? "Start Interview"}</Button>;
}
