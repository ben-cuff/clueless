import ErrorFallback from '@/components/error-fallback';
import { ErrorBoundary } from 'react-error-boundary';
import Markdown from 'react-markdown';

export default function FeedbackContent({ feedback }: { feedback: string }) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while displaying feedback content, try again later" />
      }
    >
      <Markdown
        components={{
          strong: ({ children }) => (
            <strong className="font-extrabold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic font-extralight">{children}</em>
          ),
        }}
      >
        {feedback}
      </Markdown>
    </ErrorBoundary>
  );
}
