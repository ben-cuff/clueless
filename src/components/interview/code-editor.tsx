'use client';

import Editor from '@monaco-editor/react';
import { useContext } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../error-fallback';
import { FeedbackContext } from '../providers/feedback-provider';

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
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while trying to display code editor, try again later" />
      }
    >
      <div className="shadow h-3/4">
        <Editor
          height="100%"
          language={languageValue}
          theme={theme}
          value={code}
          onChange={(value) => setCode(value ?? '')}
          options={{
            minimap: { enabled: false },
            readOnly: isFeedback,
          }}
        />
      </div>
    </ErrorBoundary>
  );
}
