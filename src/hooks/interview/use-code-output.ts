import { LanguageOption } from '@/constants/language-options';
import { CodeOutput } from '@/types/code-output';
import { TestcasesKey } from '@/types/question';
import { codeExecutionAPI } from '@/utils/api/code-execution-api';
import { Question } from '@prisma/client';
import { useCallback, useState } from 'react';

export default function useCodeOutput(
  question: Question,
  language: LanguageOption,
  code: string
) {
  const [output, setOutput] = useState<CodeOutput>({
    stdout: '',
    stderr: '',
    status: { id: 0, description: 'None' },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmitCode = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await codeExecutionAPI.runCode(
        code,
        question.testCases?.[language.value as TestcasesKey] ?? '',
        language
      );

      result.stderr = atob(result.stderr);

      result.stdout = atob(result.stdout);

      setOutput(result);
    } catch (error) {
      setOutput({
        stdout: '',
        stderr: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        status: { id: -1, description: 'Error' },
      });
    } finally {
      setIsLoading(false);
    }
  }, [code, language, question.testCases]);

  return {
    handleSubmitCode,
    isLoading,
    output,
  };
}
