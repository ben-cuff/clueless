import React from 'react';
import DifficultyBadge from '../difficulty-badge';
import { Card, CardContent } from '../ui/card';

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
  const formattedPrompt = formatPromptWithBreaks(prompt);

  return (
    <Card className="overflow-auto max-h-200 w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Question {questionNumber}</span>
          <DifficultyBadge difficulty={difficulty as 1 | 2 | 3} />
        </div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <div className="text-sm">
          <p>{formattedPrompt}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// this function adds line breaks after certain keywords like Example, Explanation or Constraints
// Needs to use react fragments as new lines will not persist otherwise
//
// Example:
// Input: "Given an array nums, find all unique triplets. Example 1: Input: nums = [-1,0,1,2,-1,-4] Explanation: The triplets are [-1,0,1] and [-1,-1,2]. Constraints: 3 <= nums.length <= 3000"
// Output: "Given an array nums, find all unique triplets.
// Example 1: Input: nums = [-1,0,1,2,-1,-4]
// Explanation: The triplets are [-1,0,1] and [-1,-1,2].
// Constraints: 3 <= nums.length <= 3000"
const formatPromptWithBreaks = (prompt: string) => {
  return (prompt || 'No prompt found')
    .replace(/(Example \d+:|Explanation:|Constraints:)/g, '\n$1')
    .split(/\n+/)
    .map((line, idx, arr) => (
      <React.Fragment key={idx}>
        {line}
        {idx < arr.length - 1 && <br />}
      </React.Fragment>
    ));
};
