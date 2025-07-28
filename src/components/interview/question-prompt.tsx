import DifficultyBadge from '../difficulty-badge';
import formatPromptWithBreaks, {
  getTwoSumFormattedPrompt,
} from '../formatted-prompt';
import { Card, CardContent } from '../ui/card';

export default function QuestionPrompt({
  title,
  difficulty,
  questionNumber,
  prompt,
  width = 'max-w-1/4',
}: {
  title: string;
  difficulty: number;
  questionNumber: number;
  prompt: string;
  width?: string;
}) {
  console.log(prompt);
  const formattedPrompt =
    questionNumber === 1
      ? getTwoSumFormattedPrompt()
      : formatPromptWithBreaks(prompt);

  return (
    <Card className={`overflow-auto h-full min-w-100 w-full ${width}`}>
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
