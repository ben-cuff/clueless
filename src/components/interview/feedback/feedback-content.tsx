import ErrorFallback from "@/components/error-fallback";
import { ErrorBoundary } from "react-error-boundary";
import Markdown from "react-markdown";

export default function FeedbackContent({ feedback }: { feedback: string }) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while displaying feedback content, try again later" />
      }
    >
      <Markdown>{feedback}</Markdown>
    </ErrorBoundary>
  );
}
