import LoadingSpinner from '@/components/loading-spinner';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useAskAIQuestions from '@/hooks/questions/use-ask-ai-questions';
import QueryForm from './query-form';
import QuestionsDisplay from './questions-display';

export default function AskAICard({ open }: { open: boolean }) {
  const {
    isLoading,
    questions,
    setQuestions,
    message,
    setMessage,
    submitQuestionQuery,
  } = useAskAIQuestions();

  return (
    <div
      className={`transition-all duration-300 ${
        open
          ? 'opacity-100 scale-100 pointer-events-auto'
          : 'opacity-0 scale-90 pointer-events-none'
      }`}
    >
      <Card className="flex flex-col w-full shadow-lg min-w-100 min-h-40">
        <CardHeader>Ask AI for Questions</CardHeader>
        {isLoading && (
          <div className="flex justify-center items-center w-full">
            <LoadingSpinner />
          </div>
        )}
        <CardContent className="flex flex-1 flex-col h-full">
          {questions ? (
            <QuestionsDisplay
              setQuestions={setQuestions}
              questions={questions}
            />
          ) : (
            <QueryForm
              message={message}
              setMessage={setMessage}
              submitQuestionQuery={submitQuestionQuery}
              isLoading={isLoading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
