"use client";

import { LanguageOption } from "@/constants/language-options";
import useCodeOutput from "@/hooks/use-code-output";
import { Question_Extended } from "@/types/question";
import { Button } from "../ui/button";

export default function OutputArea({
  question,
  language,
  code,
}: {
  question: Question_Extended;
  language: LanguageOption;
  code: string;
}) {
  const { handleSubmitCode, isLoading, output } = useCodeOutput(
    question,
    language,
    code
  );

  return (
    <div className="bg-card flex flex-col items-center p-4 rounded-lg max-w-screen overflow-scroll">
      <div>
        <Button
          className="hover:cursor-pointer"
          onClick={handleSubmitCode}
          disabled={isLoading}
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
