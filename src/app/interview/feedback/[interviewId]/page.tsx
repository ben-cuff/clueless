import InterviewLoading from '@/components/interview/interview-loading';
import InterviewQuestionPage from '@/components/interview/interview-question-page';
import FeedbackProvider from '@/components/providers/feedback-provider';
import { NotificationProvider } from '@/components/providers/notifications-provider';
import { apiQuestions } from '@/utils/questions-api';
import { Question } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function InterviewFeedbackPage({
  params,
  searchParams,
}: {
  params: Promise<{ interviewId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { interviewId } = await params;

  const resolvedSearchParams = await searchParams;
  const questionNumberParam = resolvedSearchParams['questionNumber'];
  const questionNumber = Array.isArray(questionNumberParam)
    ? questionNumberParam[0]
    : questionNumberParam;

  const questionId = questionNumber ? Number(questionNumber) : undefined;

  if (questionId === undefined || isNaN(questionId)) {
    redirect('/interview');
  }

  const question: Question = await apiQuestions.getQuestionById(questionId);

  if (question == null) {
    redirect('/interview');
  }

  return (
    <NotificationProvider>
      <FeedbackProvider value={true}>
        <Suspense fallback={<InterviewLoading />}>
          <InterviewQuestionPage
            question={question}
            interviewId={interviewId}
          />
        </Suspense>
      </FeedbackProvider>
    </NotificationProvider>
  );
}
