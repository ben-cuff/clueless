'use client';

import INTERACTION_NAMES from '@/constants/interaction-names';
import useCodePlayground from '@/hooks/use-code-playground';
import useDebounce from '@/hooks/use-debouncer';
import { Message } from '@/types/message';
import { InteractionAPI } from '@/utils/interaction-api';
import { Question } from '@prisma/client';
import { RefObject, useEffect } from 'react';
import ChatArea from './chat-area';
import EditorOutputContainer from './editor-output-container';
import InterviewLoading from './interview-loading';
import LanguagesSelect from './language-select';
import QuestionPrompt from './question-prompt';
import ThemeSelect from './theme-select';

export default function CodePlayground({
  question,
  handleCodeSave,
  messages,
  handleMessageSubmit,
  codeRef,
  interviewId,
  languageRef,
  isCoding,
}: {
  question: Question;
  handleCodeSave(code: string): Promise<void>;
  messages: Message[];
  handleMessageSubmit: (message: string) => Promise<void>;
  codeRef: RefObject<string>;
  interviewId: string;
  languageRef: RefObject<string>;
  isCoding: boolean;
}) {
  const {
    theme,
    language,
    handleThemeChange,
    handleLanguageChange,
    code,
    setCode,
  } = useCodePlayground(question, interviewId);

  const debouncedCode = useDebounce(code, 1000);

  useEffect(() => {
    handleCodeSave(debouncedCode as string);
    const pathname = window.location.pathname;
    InteractionAPI.addEvent(
      INTERACTION_NAMES.codeEditor,
      pathname,
      debouncedCode as string
    );
  }, [debouncedCode, handleCodeSave]);

  codeRef.current = code;

  useEffect(() => {
    if (language?.value) {
      languageRef.current = language.value;
    }

    // this is done so that a ref is not in the dependency array
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language?.value]);

  if (!language) {
    return <InterviewLoading />;
  }

  return (
    <div className="w-full h-[88vh]">
      <div className="flex flex-row min-w-128 mb-1 justify-end mr-40 gap-20 mt-3">
        <LanguagesSelect
          handleLanguageChange={handleLanguageChange}
          initialLanguage={language}
        />
        <ThemeSelect handleThemeChange={handleThemeChange} theme={theme} />
      </div>
      <div className="flex flex-row gap-1 m-1 w-full h-full">
        <QuestionPrompt
          title={question.title}
          prompt={question.prompt}
          difficulty={question.difficulty}
          questionNumber={question.id}
        />
        <div className="flex min-w-1/3 flex-1">
          <ChatArea
            messages={messages}
            handleMessageSubmit={handleMessageSubmit}
          />
        </div>
        <div className="flex min-w-1/3 w-full">
          <EditorOutputContainer
            language={language}
            theme={theme}
            question={question}
            code={code}
            setCode={setCode}
            handleMessageSubmit={handleMessageSubmit}
            isCoding={isCoding}
          />
        </div>
      </div>
    </div>
  );
}
