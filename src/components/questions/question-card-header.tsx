export default function QuestionCardHeader({
  children,
  title,
  questionNumber,
}: {
  children: React.ReactNode;
  title: string;
  questionNumber: number;
}) {
  return (
    <div
      className="flex flex-row items-center w-full px-4 py-2 border rounded shadow space-x-6"
      data-testid={`question-card-${questionNumber}`}
    >
      <h2 className="text-lg font-semibold min-w-60">
        {questionNumber}. {title}
      </h2>
      {children}
    </div>
  );
}
