'use client';

import CodePlayground from '@/components/interview/code-playground';
import useInterview from '@/hooks/interview/use-interview';
import { InterviewType, Question } from '@prisma/client';
import { useSearchParams } from 'next/navigation';
import { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../error-fallback';
import { FeedbackContext } from '../providers/feedback-provider';
import Timer from '../timer';
import FeedbackModal from './feedback/feedback-modal';
import FixedButtons from './fixed-buttons';
import InterviewLoading from './interview-loading';

export default function InterviewQuestionPage({
  interviewId,
  question,
}: {
  interviewId: string;
  question: Question;
}) {
  const searchParams = useSearchParams();
  const type = searchParams.get('type');

  const interviewType =
    type === InterviewType.TIMED || type === InterviewType.UNTIMED
      ? type
      : undefined;

  const {
    handleCodeSave,
    messages,
    handleMessageSubmit,
    codeRef,
    isLoadingMessages,
    handleEndInterview,
    languageRef,
    timer,
    isCoding,
    setIsCoding,
  } = useInterview(interviewId, question.id, interviewType);
  const isFeedback = useContext(FeedbackContext);

  if (isLoadingMessages) {
    return <InterviewLoading />;
  }

  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error Loading this page, try again later" />
      }
    >
      {timer && <Timer timer={timer} />}
      <CodePlayground
        question={question}
        handleCodeSave={handleCodeSave}
        messages={messages ?? []}
        handleMessageSubmit={handleMessageSubmit}
        codeRef={codeRef}
        interviewId={interviewId}
        languageRef={languageRef}
        isCoding={isCoding}
      />

      {isFeedback ? (
        <FeedbackModal interviewId={interviewId} />
      ) : (
        <FixedButtons
          isCoding={isCoding}
          messages={messages}
          handleEndInterview={handleEndInterview}
          setIsCoding={setIsCoding}
        />
      )}
    </ErrorBoundary>
  );
}
