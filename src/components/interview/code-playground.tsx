'use client';

import INTERACTION_NAMES from '@/constants/interaction-names';
import useCodePlayground from '@/hooks/use-code-playground';
import useDebounce from '@/hooks/use-debouncer';
import { Message } from '@/types/message';
import { interactionAPI } from '@/utils/interaction-api';
import { Question } from '@prisma/client';
import { RefObject, useEffect } from 'react';
import ChatArea from './chat-area';
import CodeEditor from './code-editor';
import InterviewLoading from './interview-loading';
import LanguagesSelect from './language-select';
import OutputArea from './output-area';
import QuestionHeader from './question-header';
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
}: {
  question: Question;
  handleCodeSave(code: string): Promise<void>;
  messages: Message[];
  handleMessageSubmit: (message: string) => Promise<void>;
  codeRef: RefObject<string>;
  interviewId: string;
  languageRef: RefObject<string>;
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
    interactionAPI.addEvent(
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
    <div className="flex flex-col">
      <QuestionHeader
        title={question.title ?? 'Error'}
        questionNumber={question.id}
        difficulty={question.difficulty}
      />
      <div className="flex flex-row min-w-128 mb-1 justify-end mr-40 gap-20">
        <LanguagesSelect
          handleLanguageChange={handleLanguageChange}
          initialLanguage={language}
        />
        <ThemeSelect handleThemeChange={handleThemeChange} />
      </div>
      <div className="flex flex-row">
        <QuestionPrompt
          title={question.title}
          prompt={question.prompt}
          difficulty={question.difficulty}
          questionNumber={question.id}
        />
        <div className="min-w-1/3">
          <ChatArea
            messages={messages}
            handleMessageSubmit={handleMessageSubmit}
          />
        </div>
        <div className="flex flex-col w-full">
          <CodeEditor
            languageValue={language.value}
            theme={theme}
            code={code}
            setCode={setCode}
          />
          <OutputArea
            question={question}
            language={language}
            code={code}
            handleOutputChange={handleMessageSubmit}
          />
        </div>
      </div>
    </div>
  );
}
