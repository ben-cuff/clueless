'use client';

import INTERACTION_NAMES from '@/constants/interaction-names';
import { LanguageOption } from '@/constants/language-options';
import PROMPT_MESSAGES from '@/constants/prompt-messages';
import useCodeOutput from '@/hooks/use-code-output';
import { Nullable } from '@/types/util';
import { Question } from '@prisma/client';
import { useContext, useEffect, useRef } from 'react';
import { FeedbackContext } from '../providers/feedback-provider';
import { Button } from '../ui/button';

export default function OutputArea({
  question,
  language,
  code,
  handleOutputChange,
}: {
  question: Question;
  language: LanguageOption;
  code: string;
  handleOutputChange: (outputMessage: string) => Promise<void>;
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
    <div className="bg-card flex flex-col items-center rounded-lg max-h-100 min-h-50">
      <div>
        <Button
          className="mt-2"
          interactionName={INTERACTION_NAMES.button.runTestCases}
          onClick={handleSubmitCode}
          disabled={isLoading || isFeedback}
        >
          {isLoading ? 'Submitting...' : 'Run Testcases'}
        </Button>
      </div>
      <pre className="p-4 w-full max-w-200 overflow-scroll">
        {output.status.id != 0 ? (
          <div>
            <div>Status: {output.status.description}</div>
            {output.stdout ? (
              <div>Output: {output.stdout}</div>
            ) : output.stderr ? null : (
              <div>No output was produced by your code.</div>
            )}
            {output.stderr && <div>Errors: {output.stderr}</div>}
          </div>
        ) : (
          'Your testcase output will appear here'
        )}
      </pre>
    </div>
  );
}
