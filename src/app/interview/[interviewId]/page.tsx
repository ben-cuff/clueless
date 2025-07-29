import InterviewLoading from '@/components/interview/interview-loading';
import InterviewQuestionPage from '@/components/interview/interview-question-page';
import { handleQuestionsAPIError, QuestionsAPI } from '@/utils/api/questions-api';
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

  let question: Question;
  try {
    question = await QuestionsAPI.getQuestionById(Number(questionId));
  } catch (error) {
    handleQuestionsAPIError(error as Error, 'While getting specific question');
    redirect('/interview');
  }

  return (
    <Suspense fallback={<InterviewLoading />}>
      <InterviewQuestionPage question={question} interviewId={interviewId} />
    </Suspense>
  );
}
