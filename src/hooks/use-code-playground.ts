import { UserIdContext } from "@/components/providers/user-id-provider";
import { LanguageOption, languageOptions } from "@/constants/language-options";
import { defineTheme } from "@/lib/define-theme";
import { Question_Extended } from "@/types/question";
import { Theme } from "@/types/theme";
import { interviewAPI } from "@/utils/interview-api";
import { useTheme } from "next-themes";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useCodePlayground(
  question: Question_Extended,
  interviewId: string
) {
  const userId = useContext(UserIdContext);
  const { theme: systemTheme } = useTheme();
  const [theme, setTheme] = useState(
    systemTheme === "dark" ? "vs-dark" : "light"
  );
  const [language, setLanguage] = useState<LanguageOption | undefined>();
  const [code, setCode] = useState<string>("");

  const handleThemeChange = useCallback((newTheme: Theme) => {
    if (["light", "vs-dark"].includes(newTheme)) {
      setTheme(newTheme);
    } else {
      defineTheme(newTheme).then(() => setTheme(newTheme));
    }
  }, []);

  const handleStarterCodeChange = useCallback(
    (language: string) => {
      setLanguage(
        languageOptions.find((lang) => lang.value === language) ??
          languageOptions[4] // Default to Python if not found
      );
      setCode(
        question.starterCode[language as keyof typeof question.starterCode] ||
          ""
      );
    },
    [question]
  );

  const handleLanguageChange = useCallback(
    (newLanguage: LanguageOption) => {
      setLanguage(newLanguage);
      handleStarterCodeChange(newLanguage.value);
    },
    [handleStarterCodeChange]
  );

  // Fetch the initial code and language for the interview if it exists
  useEffect(() => {
    (async () => {
      const interview = await interviewAPI.getInterview(
        userId || -1,
        interviewId
      );
      if (!interview.error) {
        setCode(interview.code || "");
        setLanguage(
          languageOptions.find(
            (lang) => lang.value === interview.codeLanguage?.toLowerCase()
          ) ?? languageOptions[4]
        );
      }
    })();
  }, [question, interviewId, userId, handleStarterCodeChange]);

  return {
    theme,
    language,
    handleThemeChange,
    handleLanguageChange,
    code,
    setCode,
  };
}
