"use client";

import useCodePlayground from "@/hooks/use-code-playground";
import useDebounce from "@/hooks/use-debouncer";
import { Message } from "@/types/message";
import { Question_Extended } from "@/types/question";
import { RefObject, useEffect } from "react";
import ChatArea from "./chat-area";
import CodeEditor from "./code-editor";
import LanguagesSelect from "./language-select";
import OutputArea from "./output-area";
import QuestionHeader from "./question-header";
import QuestionPrompt from "./question-prompt";
import ThemeSelect from "./theme-select";

export default function CodePlayground({
  question,
  handleCodeSave,
  messages,
  handleMessageSubmit,
  codeRef,
}: {
  question: Question_Extended;
  handleCodeSave(code: string): Promise<void>;
  messages: Message[];
  handleMessageSubmit: (message: string) => Promise<void>;
  codeRef: RefObject<string>;
}) {
  const {
    theme,
    language,
    handleThemeChange,
    handleLanguageChange,
    code,
    setCode,
  } = useCodePlayground(question);

  const debouncedCode = useDebounce(code, 1000);

  useEffect(() => {
    handleCodeSave(debouncedCode as string);
  }, [debouncedCode, handleCodeSave]);

  codeRef.current = code;

  return (
    <div className="flex flex-col">
      <QuestionHeader
        title={question.title ?? "Error"}
        questionNumber={question.questionNumber}
        difficulty={question.difficulty}
      />
      <div className="flex flex-row min-w-128 justify-around mb-1">
        <LanguagesSelect handleLanguageChange={handleLanguageChange} />
        <ThemeSelect handleThemeChange={handleThemeChange} />
      </div>
      <div className="flex flex-row">
        <QuestionPrompt
          title={question.title}
          prompt={question.prompt}
          difficulty={question.difficulty}
          questionNumber={question.questionNumber}
        />
        <div className="min-w-1/3">
          <ChatArea
            messages={messages}
            handleMessageSubmit={handleMessageSubmit}
          />
        </div>
        <CodeEditor
          languageValue={language.value}
          theme={theme}
          code={code}
          setCode={setCode}
        />
      </div>
      <OutputArea />
    </div>
  );
}
