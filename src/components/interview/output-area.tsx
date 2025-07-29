'use client';

import INTERACTION_NAMES from '@/constants/interaction-names';
import { LanguageOption } from '@/constants/language-options';
import PROMPT_MESSAGES from '@/constants/prompt-messages';
import useCodeOutput from '@/hooks/interview/use-code-output';
import { Nullable } from '@/types/util';
import { Question } from '@prisma/client';
import { useContext, useEffect, useRef } from 'react';
import { FeedbackContext } from '../providers/feedback-provider';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

export default function OutputArea({
  question,
  language,
  code,
  handleOutputChange,
  height,
}: {
  question: Question;
  language: LanguageOption;
  code: string;
  handleOutputChange: (outputMessage: string) => Promise<void>;
  height: number;
}) {
  const { handleSubmitCode, isLoading, output } = useCodeOutput(
    question,
    language,
    code
  );
  const isFeedback = useContext(FeedbackContext);
  const lastOutputMessage = useRef<Nullable<string>>(null);

  useEffect(() => {
    const outputMessage = `${PROMPT_MESSAGES.USER_SUBMITTED_CODE_MESSAGE}\n\n${
      output.stdout ? `Output:\n${output.stdout}\n` : ''
    }${output.stderr ? `Errors:\n${output.stderr}\n` : ''}`;

    if (output.status.id !== 0 && lastOutputMessage.current !== outputMessage) {
      lastOutputMessage.current = outputMessage;
      handleOutputChange(outputMessage);
    }
  }, [handleOutputChange, output]);

  return (
    <Card className="flex flex-col items-center rounded-lg w-full h-full">
      <CardContent className="w-full">
        <div className="w-full flex mb-4">
          <Button
            interactionName={INTERACTION_NAMES.button.runTestCases}
            onClick={handleSubmitCode}
            disabled={isLoading || isFeedback}
          >
            {isLoading ? 'Submitting...' : 'Run Testcases'}
          </Button>
        </div>
        <div
          className="w-full overflow-auto"
          style={{ height: `calc(${height}px - 95px)` }} // 95px is to account for above button's height
        >
          {output.status.id != 0 ? (
            <pre className="whitespace-pre-wrap break-words">
              <div>Status: {output.status.description}</div>
              {output.stdout ? (
                <div>Output: {output.stdout}</div>
              ) : output.stderr ? null : (
                <div>No output was produced by your code.</div>
              )}
              {output.stderr && <div>Errors: {output.stderr}</div>}
            </pre>
          ) : (
            <pre className="whitespace-pre-wrap break-words">
              Your testcase output will appear here
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
