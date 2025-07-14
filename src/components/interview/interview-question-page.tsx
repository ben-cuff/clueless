"use client";

import CodePlayground from "@/components/interview/code-playground";
import useInterview from "@/hooks/use-interview";
import { Question_Extended } from "@/types/question";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../error-fallback";
import { FeedbackContext } from "../providers/feedback-provider";
import EndInterviewButton from "./end-interview-button";
import FeedbackModal from "./feedback/feedback-modal";
import InterviewLoading from "./interview-loading";

export default function InterviewQuestionPage({
  interviewId,
  question,
}: {
  interviewId: string;
  question: Question_Extended;
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const interviewType =
    type === "TIMED" || type === "UNTIMED" ? type : undefined;

  const {
    handleCodeSave,
    messages,
    handleMessageSubmit,
    codeRef,
    isLoadingMessages,
    handleEndInterview,
    languageRef,
    timer,
  } = useInterview(interviewId, question.id, interviewType);
  const isFeedback = useContext(FeedbackContext);

  const MIN_MESSAGES_TO_END_EARLY = 5;

  return !isLoadingMessages ? (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error Loading this page, try again later" />
      }
    >
      <CodePlayground
        question={question}
        handleCodeSave={handleCodeSave}
        messages={messages ?? []}
        handleMessageSubmit={handleMessageSubmit}
        codeRef={codeRef}
        interviewId={interviewId}
        languageRef={languageRef}
      />
      {isFeedback ? (
        <FeedbackModal interviewId={interviewId} />
      ) : (
        messages &&
        messages.length >= MIN_MESSAGES_TO_END_EARLY && (
          <EndInterviewButton handleEndInterview={handleEndInterview} />
        )
      )}
    </ErrorBoundary>
  ) : (
    <InterviewLoading />
  );
}
