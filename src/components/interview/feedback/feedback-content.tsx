import Markdown from "react-markdown";

export default function FeedbackContent({ feedback }: { feedback: string }) {
  if (feedback?.startsWith("{")) {
    const data = JSON.parse(feedback);
    if (data.error) {
      return (
        <p className="text-red-500">
          Error fetching feedback for interview, are you sure the id is valid?
        </p>
      );
    }
  }
  return <Markdown>{feedback}</Markdown>;
}
