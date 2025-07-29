import { QuestionPartial } from '@/types/question';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../error-fallback';
import QuestionCard from './question-card';

export default function QuestionsList({
  questionsData,
  showButtons = true,
}: {
  questionsData: QuestionPartial[];
  showButtons?: boolean;
}) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while rendering question list, try again later" />
      }
    >
      {questionsData.map((question, idx) => (
        <QuestionCard key={idx} question={question} showButtons={showButtons} />
      ))}
    </ErrorBoundary>
  );
}
