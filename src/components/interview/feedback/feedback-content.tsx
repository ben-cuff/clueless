import ErrorFallback from "@/components/error-fallback";
import { ErrorBoundary } from "react-error-boundary";
import Markdown from "react-markdown";

export default function FeedbackContent({ feedback }: { feedback: string }) {
  try {
    const data: { error: string } = JSON.parse(feedback);
    if (typeof data === "object" && data !== null && data.error) {
      return (
        <p className="text-red-500">
          Error fetching feedback for interview, are you sure the id is valid?
        </p>
      );
    }
  } catch {
    // Not JSON, proceed as markdown
  }

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
