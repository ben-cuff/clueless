import { Question } from "@/constants/question";
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
