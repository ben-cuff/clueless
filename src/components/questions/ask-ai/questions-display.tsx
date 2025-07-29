import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { QuestionPartial } from '@/types/question';
import { Nullable } from '@/types/util';
import React, { SetStateAction } from 'react';
import QuestionsList from '../questions-list';

export default function QuestionsDisplay({
  setQuestions,
  questions,
}: {
  questions: QuestionPartial[];
  setQuestions: React.Dispatch<SetStateAction<Nullable<QuestionPartial[]>>>;
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <Label>Questions</Label>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setQuestions(null)}
        >
          Reset
        </Button>
      </div>
      <div className="max-h-[60vh] overflow-auto">
        <QuestionsList questionsData={questions} showButtons={false} />
      </div>
    </>
  );
}
