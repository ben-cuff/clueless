"use client";

import CodePlayground from "@/components/interview/code-playground";
import useInterview from "@/hooks/use-interview";
import { Question_Extended } from "@/types/question";
import { useContext } from "react";
import { FeedbackContext } from "../providers/feedback-provider";
import FeedbackModal from "./feedback-modal";
import InterviewLoading from "./interview-loading";

export default function InterviewQuestionPage({
  interviewId,
  question,
}: {
  interviewId: string;
  question: Question_Extended;
}) {
  const {
    handleCodeSave,
    messages,
    handleMessageSubmit,
    codeRef,
    isLoadingMessages,
  } = useInterview(interviewId, question.questionNumber);
  const isFeedback = useContext(FeedbackContext);

  return !isLoadingMessages ? (
    <>
      <CodePlayground
        question={question}
        handleCodeSave={handleCodeSave}
        messages={messages ?? []}
        handleMessageSubmit={handleMessageSubmit}
        codeRef={codeRef}
        interviewId={interviewId}
      />
      {isFeedback && <FeedbackModal interviewId={interviewId} />}
    </>
  ) : (
    <InterviewLoading />
  );
}
