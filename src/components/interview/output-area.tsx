"use client";

import { LanguageOption } from "@/constants/language-options";
import useCodeOutput from "@/hooks/use-code-output";
import { Question_Extended } from "@/types/question";
import { useContext, useEffect } from "react";
import { FeedbackContext } from "../providers/feedback-provider";
import { Button } from "../ui/button";

export default function OutputArea({
  question,
  language,
  code,
  handleOutputChange,
}: {
  question: Question_Extended;
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
    const outputMessage = `Here is the latest code output:\n\n${
      output.stdout ? `Output:\n${output.stdout}\n` : ""
    }${output.stderr ? `Errors:\n${output.stderr}\n` : ""}`;

    if (output.status.id !== 0) {
      handleOutputChange(outputMessage);
    }
    // This is a workaround for now to stop and infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [output]);

  return (
    <div className="bg-card flex flex-col items-center rounded-lg max-w-screen overflow-scroll max-h-[400px] min-h-[100px]">
      <div>
        <Button
          className="hover:cursor-pointer mt-2"
          onClick={handleSubmitCode}
          disabled={isLoading || isFeedback}
        >
          {isLoading ? "Submitting..." : "Run Testcases"}
        </Button>
      </div>
      <pre className="p-4 w-full">
        {output.stdout || output.stderr || output.status ? (
          <div>
            {output.status && <div>Status: {output.status.description}</div>}
            {output.stdout && <div>Output: {output.stdout}</div>}
            {output.stderr && <div>Errors: {output.stderr}</div>}
          </div>
        ) : (
          "Your testcase output will appear here"
        )}
      </pre>
    </div>
  );
}
