"use client";

import CodePlayground from "@/components/interview/code-playground";
import useInterview from "@/hooks/use-interview";
import { Question_Extended } from "@/types/question";
import { useContext } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ActiveTimeTracker from "../activity/active-time-tracker";
import { FeedbackContext } from "../providers/feedback-provider";
import EndInterviewButton from "./end-interview-button";
import FeedbackModal from "./feedback/feedback-modal";
import InterviewError from "./interview-error";
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
    handleEndInterview,
    userId,
  } = useInterview(interviewId, question.id);
  const isFeedback = useContext(FeedbackContext);

  return !isLoadingMessages ? (
    <ErrorBoundary fallback={<InterviewError />}>
      <ActiveTimeTracker userId={userId}>
        <CodePlayground
          question={question}
          handleCodeSave={handleCodeSave}
          messages={messages ?? []}
          handleMessageSubmit={handleMessageSubmit}
          codeRef={codeRef}
          interviewId={interviewId}
        />
        {isFeedback ? (
          <FeedbackModal interviewId={interviewId} />
        ) : (
          messages &&
          messages.length >= 5 && (
            <EndInterviewButton handleEndInterview={handleEndInterview} />
          )
        )}
      </ActiveTimeTracker>
    </ErrorBoundary>
  ) : (
    <InterviewLoading />
  );
}
