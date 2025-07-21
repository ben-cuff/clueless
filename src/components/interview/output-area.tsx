'use client';

import INTERACTION_NAMES from '@/constants/interaction-names';
import { LanguageOption } from '@/constants/language-options';
import { USER_SUBMITTED_CODE_MESSAGE } from '@/constants/prompt-fillers';
import useCodeOutput from '@/hooks/use-code-output';
import { Question } from '@prisma/client';
import { useContext, useEffect } from 'react';
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

  useEffect(() => {
    const outputMessage = `${USER_SUBMITTED_CODE_MESSAGE}\n\n${
      output.stdout ? `Output:\n${output.stdout}\n` : ''
    }${output.stderr ? `Errors:\n${output.stderr}\n` : ''}`;

    if (output.status.id !== 0) {
      handleOutputChange(outputMessage);
    }
    // This is a workaround to stop infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output]);

  return (
    <div className="bg-card flex flex-col items-center rounded-lg max-h-[400px] min-h-[200px]">
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
        {output.stdout || output.stderr || output.status ? (
          <div>
            {output.status && <div>Status: {output.status.description}</div>}
            {output.stdout && <div>Output: {output.stdout}</div>}
            {output.stderr && <div>Errors: {output.stderr}</div>}
          </div>
        ) : (
          'Your testcase output will appear here'
        )}
      </pre>
    </div>
  );
}
