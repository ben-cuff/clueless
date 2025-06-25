import { LanguageOption, languageOptions } from "@/constants/language-options";
import { defineTheme } from "@/lib/define-theme";
import { Question_Extended } from "@/types/question";
import { Theme } from "@/types/theme";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export default function useCodePlayground(question: Question_Extended) {
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
    if (question?.starterCode) {
      setCode(
        question.starterCode[
          language.value as keyof typeof question.starterCode
        ] || ""
      );
    }
  }, [language.value, question]);

  return {
    theme,
    language,
    handleThemeChange,
    handleLanguageChange,
    code,
    setCode,
  };
}
