import QuestionCard from "./question-card";

export default function QuestionsList({
  questionsData,
}: {
  questionsData: Question[];
}) {
  return (
    <>
      {questionsData.map((question, idx) => (
        <QuestionCard key={idx} question={question} />
      ))}
    </>
  );
}

type Question = {
  accuracy: number;
  companies: string[];
  createdAt: string;
  difficulty: number;
  prompt: string;
  questionNumber: number;
  title: string;
  topics: string[];
  updatedAt: string;
};
