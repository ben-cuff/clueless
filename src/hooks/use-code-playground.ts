import { UserIdContext } from '@/components/providers/user-id-provider';
import {
  LanguageOption,
  languageOptions,
  PYTHON_INDEX,
} from '@/constants/language-options';
import { defineTheme } from '@/lib/define-theme';
import { Theme } from '@/types/theme';
import { Optional } from '@/types/util';
import { interviewAPI } from '@/utils/interview-api';
import { Question } from '@prisma/client';
import { useTheme } from 'next-themes';
import { useCallback, useContext, useEffect, useState } from 'react';

export default function useCodePlayground(
  question: Question,
  interviewId: string
) {
  const userId = useContext(UserIdContext);
  const { theme: systemTheme } = useTheme();
  const [theme, setTheme] = useState<Theme>(() =>
    getThemeFromSystem(systemTheme ?? 'light')
  );
  const [language, setLanguage] = useState<Optional<LanguageOption>>();
  const [code, setCode] = useState<string>('');

  const handleThemeChange = useCallback((newTheme: Theme) => {
    if (['light', 'vs-dark'].includes(newTheme)) {
      setTheme(newTheme);
    } else {
      defineTheme(newTheme).then(() => setTheme(newTheme));
    }
  }, []);

  const handleStarterCodeChange = useCallback(
    (language: string) => {
      setLanguage(
        languageOptions.find((lang) => lang.value === language) ??
          languageOptions[PYTHON_INDEX] // Default to Python if not found
      );
      setCode(
        question.starterCode?.[language as keyof typeof question.starterCode] ||
          ''
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
        userId || -1, // fallbacks to -1 if userId is not available
        interviewId
      );
      if (!interview.error) {
        setCode(interview.code || '');
        setLanguage(
          languageOptions.find(
            (lang) => lang.value === interview.codeLanguage?.toLowerCase()
          ) ?? languageOptions[PYTHON_INDEX]
        );
      } else {
        handleLanguageChange(languageOptions[PYTHON_INDEX]); // Default to Python if interview not found or error
      }
    })();
  }, [
    question,
    interviewId,
    userId,
    handleStarterCodeChange,
    handleLanguageChange,
  ]);

  useEffect(() => {
    setTheme(getThemeFromSystem(systemTheme ?? 'light'));
  }, [systemTheme]);

  return {
    theme,
    language,
    handleThemeChange,
    handleLanguageChange,
    code,
    setCode,
  };
}

const getThemeFromSystem = (systemTheme: string): Theme => {
  if (systemTheme === 'system') {
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    return prefersDark ? 'vs-dark' : 'light';
  } else {
    return systemTheme === 'dark' ? 'vs-dark' : 'light';
  }
};
