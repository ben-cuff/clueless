import React from "react";
import DifficultyBadge from "../difficulty-badge";

export default function QuestionPrompt({
  title,
  difficulty,
  questionNumber,
  prompt,
}: {
  title: string;
  difficulty: number;
  questionNumber: number;
  prompt: string;
}) {
  // adds new lines after certain parts to make more readable
  const formattedPrompt = prompt
    .replace(/(Example \d+:|Explanation:|Constraints:)/g, "\n$1")
    .split(/\n+/)
    .map((line, idx, arr) => (
      <React.Fragment key={idx}>
        {line}
        {idx < arr.length - 1 && <br />}
      </React.Fragment>
    ));

  return (
    <div className="rounded-lg shadow p-6 max-w-128 bg-card mx-2 overflow-auto max-h-200 min-w-82">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Question {questionNumber}</span>
        <DifficultyBadge difficulty={difficulty as 1 | 2 | 3} />
      </div>
      <h2 className="text-xl font-bold  mb-2">{title}</h2>
      <div className="text-sm">
        <p>{formattedPrompt}</p>
      </div>
    </div>
  );
}
