import InterviewLoading from '@/components/interview/interview-loading';
import InterviewQuestionPage from '@/components/interview/interview-question-page';
import { QuestionsAPI } from '@/utils/questions-api';
import { Question } from '@prisma/client';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function ResumeInterviewPage({
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

  const questionId = questionNumber ?? undefined;

  if (questionId === undefined || isNaN(Number(questionId))) {
    redirect('/interview');
  }

  const question: Question = await QuestionsAPI.getQuestionById(
    Number(questionId)
  );

  if (question == null) {
    redirect('/interview');
  }

  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewQuestionPage question={question} interviewId={interviewId} />
    </Suspense>
  );
}
