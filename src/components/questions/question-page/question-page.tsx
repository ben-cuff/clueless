import { Nullable } from '@/types/util';
import { handleQuestionsAPIError, QuestionsAPI } from '@/utils/questions-api';
import { Question } from '@prisma/client';
import { notFound } from 'next/navigation';
import QuestionPrompt from '../../interview/question-prompt';
import PythonSolutionCard from './python-solution-card';
import QuestionAdditionalInfoCard from './question-additional-info-card';

export default async function QuestionPage({ id }: { id: number }) {
  let question: Nullable<Question> = null;
  try {
    question = await QuestionsAPI.getQuestionById(Number(id));
  } catch (error) {
    handleQuestionsAPIError(
      error as Error,
      'While getting question for question page',
      false
    );
    notFound();
  }

  if (!question) {
    notFound();
  }

  const hasPythonSolution =
    question.solutions &&
    typeof question.solutions === 'object' &&
    question.solutions !== null &&
    'python' in question.solutions &&
    typeof (question.solutions as Record<string, unknown>)['python'] ===
      'string';

  return (
    <div className="flex flex-row mt-10 gap-1 h-90vh max-w-screen">
      <QuestionPrompt
        title={question.title}
        difficulty={question.difficulty}
        questionNumber={question.id}
        prompt={question.prompt}
        width="max-w-full"
      />
      {hasPythonSolution && (
        <PythonSolutionCard
          pythonSolution={
            (question.solutions as Record<string, unknown>)['python'] as string
          }
        />
      )}
      <QuestionAdditionalInfoCard
        id={question.id}
        companies={question.companies}
        accuracy={question.accuracy}
      />
    </div>
  );
}
