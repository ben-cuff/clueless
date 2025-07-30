import { Message } from '@/types/message';
import { Optional } from '@/types/util';
import { Dispatch, SetStateAction } from 'react';
import EndInterviewButton from './end-interview-button';
import OverrideCodeEditorButton from './override-code-editor-button';

const MIN_MESSAGES_TO_END_EARLY = 5;

export default function FixedButtons({
  isCoding,
  messages,
  handleEndInterview,
  setIsCoding,
}: {
  isCoding: boolean;
  messages: Optional<Message[]>;
  handleEndInterview: () => void;
  setIsCoding: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="fixed top-16 left-4 flex gap-2">
      {!isCoding && <OverrideCodeEditorButton setIsCoding={setIsCoding} />}
      {messages && messages.length >= MIN_MESSAGES_TO_END_EARLY && (
        <EndInterviewButton handleEndInterview={handleEndInterview} />
      )}
    </div>
  );
}
