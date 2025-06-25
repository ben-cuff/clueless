"use client";

import { LanguageOption } from "@/constants/language-options";
import { Question_Extended } from "@/types/question";
import { codeExecutionAPI } from "@/utils/codeExecutionAPI";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";

type CodeOutput = {
  stdout: string;
  stderr: string;
  status: { id: number; description: string };
};

export default function OutputArea({
  question,
  language,
  code,
}: {
  question: Question_Extended;
  language: LanguageOption;
  code: string;
}) {
  const [output, setOutput] = useState<CodeOutput>({
    stdout: "",
    stderr: "",
    status: { id: 0, description: "None" },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await codeExecutionAPI.runCode(
        code,
        question.testcases[language.value],
        language
      );

      result.stderr = atob(result.stderr);

      result.stdout = atob(result.stdout);

      setOutput(result);
    } catch (error) {
      setOutput({
        stdout: "",
        stderr: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        status: { id: -1, description: "Error" },
      });
    } finally {
      setIsLoading(false);
    }
  }, [code, language, question.testcases]);

  return (
    <div className="bg-card flex flex-col items-center p-4 rounded-lg max-w-screen overflow-scroll">
      <div>
        <Button
          className="hover:cursor-pointer"
          onClick={handleSubmit}
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
