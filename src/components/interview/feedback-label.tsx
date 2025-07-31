export default function FeedbackLabel({
  feedbackNumber,
}: {
  feedbackNumber: number;
}) {
  return (
    <div className="flex justify-center w-1/6">
      <p>{feedbackLabels[feedbackNumber]}</p>
    </div>
  );
}

const feedbackLabels: Record<number, string> = {
  0: 'Strong No-Hire',
  1: 'No-Hire',
  2: 'Lean No-Hire',
  3: 'Lean Hire',
  4: 'Hire',
  5: 'Strong Hire',
};
