import Link from 'next/link';

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
      <Link
        className="flex w-1/5"
        href={`/questions/${questionNumber}`}
      >
        <h2 className="text-lg font-semibold hover:underline">
          {questionNumber}. {title}
        </h2>
      </Link>
      {children}
    </div>
  );
}
