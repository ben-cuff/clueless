import { LanguageOption } from "@/constants/language-options";

export const codeExecutionAPI = {
  async runCode(code: string, testcases: string, language: LanguageOption) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/run-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            testcases,
            language,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        stdout: result.stdout || "",
        stderr: result.stderr || "",
        status: result.status || "Success",
      };
    } catch (error) {
      console.error("Error running code:", error);
      return {
        stdout: "",
        stderr: `Error: ${
          error instanceof Error ? error.message : String(error)
        }`,
        status: "Error",
      };
    }
  },
};
