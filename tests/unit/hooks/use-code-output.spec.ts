import { LanguageOption } from "@/constants/language-options";
import useCodeOutput from "@/hooks/use-code-output";
import { Question_Extended, TestcasesKey } from "@/types/question";
import { codeExecutionAPI } from "@/utils/code-execution-api";
import { act, renderHook } from "@testing-library/react";

jest.mock("@/utils/code-execution-api", () => ({
  codeExecutionAPI: {
    runCode: jest.fn().mockResolvedValue({
      stdout: btoa("Hello World"),
      stderr: "",
      status: { id: 1, description: "Success" },
    }),
  },
}));

describe("useCodeOutput", () => {
  const mockLanguage: LanguageOption = {
    id: 63,
    name: "JavaScript (Node.js 12.14.0)",
    label: "JavaScript (Node.js 12.14.0)",
    value: "javascript",
  };

  const mockQuestion = {
    id: "1",
    title: "Test Question",
    testcases: {
      javascript: "test code",
    } as Record<TestcasesKey, string>,
  } as Partial<Question_Extended> as Question_Extended;

  const mockCode = 'console.log("Hello World")';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default output and isLoading state", () => {
    const { result } = renderHook(() =>
      useCodeOutput(mockQuestion, mockLanguage, mockCode)
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.output).toEqual({
      stdout: "",
      stderr: "",
      status: { id: 0, description: "None" },
    });
  });

  it("should call codeExecutionAPI.runCode and update output on success", async () => {
    const { result } = renderHook(() =>
      useCodeOutput(mockQuestion, mockLanguage, mockCode)
    );

    act(() => {
      result.current.handleSubmitCode();
    });a
    expect(codeExecutionAPI.runCode).toHaveBeenCalledWith(
      mockCode,
      mockQuestion.testcases[mockLanguage.value as TestcasesKey],
      mockLanguage
    );

    expect(result.current.output).toEqual({
      stdout: btoa("Hello World"),
      stderr: "",
      status: { id: 1, description: "Success" },
    });
  });
});
