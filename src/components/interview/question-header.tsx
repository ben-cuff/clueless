import { READABLE_DIFFICULTIES } from "@/constants/difficulties";

export default function QuestionHeader({
  title,
  questionNumber,
  difficulty,
}: {
  title: string;
  questionNumber: number;
  difficulty: number;
}) {
  return (
    <>
      <h1 className="text-center text-3xl">{title}</h1>
      <div className="flex flex-col items-center justify-center">
        <h3>Question: {questionNumber}</h3>
        <div className="flex flex-row">
          <h3>Difficulty: </h3>
          <span>
            &nbsp;
            {READABLE_DIFFICULTIES[difficulty]}
          </span>
        </div>
      </div>
    </>
  );
}
