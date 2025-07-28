import InterviewLoading from '@/components/interview/interview-loading';
import QuestionPage from '@/components/questions/question-page/question-page';
import { Suspense } from 'react';

export default async function QuestionIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<InterviewLoading />}>
      <QuestionPage id={Number(id)} />
    </Suspense>
  );
}
