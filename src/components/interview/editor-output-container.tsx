import { LanguageOption } from '@/constants/language-options';
import { Question } from '@prisma/client';
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import CodeEditor from './code-editor';
import OutputArea from './output-area';

export default function EditorOutputContainer({
  language,
  theme,
  code,
  question,
  handleMessageSubmit,
  setCode,
}: {
  language: LanguageOption;
  theme: string;
  code: string;
  question: Question;
  setCode: Dispatch<SetStateAction<string>>;
  handleMessageSubmit: (message: string) => Promise<void>;
}) {
  const [outputHeight, setOutputHeight] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (startY: number) => {
      const MAX_HEIGHT_OUTPUT = 0.8;
      const startHeight = outputHeight;
      const containerHeight = containerRef.current?.offsetHeight ?? 0;
      const maxHeight = Math.floor(containerHeight * MAX_HEIGHT_OUTPUT);

      function onMouseMove(moveEvent: MouseEvent) {
        const delta = moveEvent.clientY - startY;
        let newHeight = Math.max(100, startHeight - delta);
        if (containerHeight) {
          newHeight = Math.min(newHeight, maxHeight);
        }
        setOutputHeight(newHeight);
      }

      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [outputHeight]
  );

  return (
    <div className="relative w-full h-full" ref={containerRef}>
      <CodeEditor
        languageValue={language.value}
        theme={theme}
        code={code}
        setCode={setCode}
      />
      <div
        className="absolute left-0 right-0 bottom-0 z-10 flex flex-col"
        style={{ height: `${outputHeight}px` }}
      >
        <div
          className="h-2 cursor-row-resize bg-gray-200 flex items-center justify-center mx-2"
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown(e.clientY);
          }}
        >
          <div className="w-12 h-1 bg-gray-400 rounded" />
        </div>
        <OutputArea
          question={question}
          language={language}
          code={code}
          handleOutputChange={handleMessageSubmit}
          height={outputHeight}
        />
      </div>
    </div>
  );
}
