import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { LanguageOption } from '@/constants/language-options';
import { errorLog } from '../logger';

export const codeExecutionAPI = {
  async runCode(code: string, testcases: string, language: LanguageOption) {
    try {
      const response = await fetch(CLUELESS_API_ROUTES.codeExecution, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          testcases,
          language,
        }),
      });

      const result = await response.json();
      return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        status: result.status || 'Success',
      };
    } catch (error) {
      errorLog('Error running code: ' + error);
      return {
        stdout: '',
        stderr: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        status: 'Error',
      };
    }
  },
};
