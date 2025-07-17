import { QuestionPartial } from '@/types/question';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../error-fallback';
import QuestionCard from './question-card';

export default function QuestionsList({
  questionsData,
}: {
  questionsData: QuestionPartial[];
}) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while rendering question list, try again later" />
      }
    >
      {questionsData.map((question, idx) => (
        <QuestionCard key={idx} question={question} />
      ))}
    </ErrorBoundary>
  );
}
