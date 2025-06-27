"use client";

import CodePlayground from "@/components/interview/code-playground";
import useInterview from "@/hooks/use-interview";
import { Question_Extended } from "@/types/question";
import InterviewLoading from "./interview-loading";

export default function InterviewQuestionPage({
  interviewId,
  question,
}: {
  interviewId: string;
  question: Question_Extended;
}) {
  const { handleCodeSave, messages, handleMessageSubmit, codeRef, isLoadingMessages } =
    useInterview(interviewId, question.questionNumber);

  return (
    !isLoadingMessages ? (
      <CodePlayground
        question={question}
        handleCodeSave={handleCodeSave}
        messages={messages ?? []}
        handleMessageSubmit={handleMessageSubmit}
        codeRef={codeRef}
        interviewId={interviewId}
      />
    ) : (
      <InterviewLoading />
    )
  );
  
}
