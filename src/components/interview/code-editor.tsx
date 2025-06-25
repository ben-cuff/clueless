"use client";

import Editor from "@monaco-editor/react";

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
  return (
    <Editor
      height={"800px"}
      language={languageValue}
      theme={theme}
      value={code}
      onChange={(value) => setCode(value || "")}
      options={{ minimap: { enabled: false } }}
    />
  );
}
