import { LanguageOption, languageOptions } from "@/constants/language-options";
import { defineTheme } from "@/lib/define-theme";
import { Question_Extended } from "@/types/question";
import { Theme } from "@/types/theme";
import { interviewAPI } from "@/utils/interview-api";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export default function useCodePlayground(
  question: Question_Extended,
  interviewId: string,
  userId: number
) {
  const { theme: systemTheme } = useTheme();
  const [theme, setTheme] = useState(
    systemTheme === "dark" ? "vs-dark" : "light"
  );
  const [language, setLanguage] = useState<LanguageOption>(languageOptions[4]); // 4 is Python by default
  const [code, setCode] = useState(
    question.starterCode[language.value as keyof typeof question.starterCode] ??
      ""
  );

  const handleLanguageChange = useCallback((newLanguage: LanguageOption) => {
    setLanguage(newLanguage);
  }, []);

  const handleThemeChange = useCallback((newTheme: Theme) => {
    if (["light", "vs-dark"].includes(newTheme)) {
      setTheme(newTheme);
    } else {
      defineTheme(newTheme).then(() => setTheme(newTheme));
    }
  }, []);

  useEffect(() => {
    (async () => {
      const interview = await interviewAPI.getInterview(
        userId || -1,
        interviewId
      );
      if (!interview.error) {
        setCode(interview.code || "");
      } else if (question?.starterCode) {
        setCode(
          question.starterCode[
            language.value as keyof typeof question.starterCode
          ] || ""
        );
      }
    })();
  }, [language.value, question, interviewId, userId]);

  return {
    theme,
    language,
    handleThemeChange,
    handleLanguageChange,
    code,
    setCode,
  };
}
