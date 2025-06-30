"use client";

import Editor from "@monaco-editor/react";
import { useContext } from "react";
import { FeedbackContext } from "../providers/feedback-provider";

export default function CodeEditor({
  languageValue,
  theme,
  code,
  setCode,
}: {
  languageValue: string;
  theme: string;
  code: string;
  setCode: (value: string) => void;
}) {
  const isFeedback = useContext(FeedbackContext);
  return (
    <Editor
      height={"700px"}
      language={languageValue}
      theme={theme}
      value={code}
      onChange={(value) => setCode(value || "")}
      options={{
        minimap: { enabled: false },
        readOnly: isFeedback,
      }}
    />
  );
}
