'use client';

import INTERACTION_NAMES from '@/constants/interaction-names';
import useChatInput from '@/hooks/use-chat-input';
import { useContext } from 'react';
import { FeedbackContext } from '../providers/feedback-provider';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

export default function ChatInput({
  handleMessageSubmit,
}: {
  handleMessageSubmit: (message: string) => Promise<void>;
}) {
  const isFeedback = useContext(FeedbackContext);

  const { handleSubmit, isDisabled, setMessage, message } =
    useChatInput(handleMessageSubmit);

  const isReadOnly = isDisabled || isFeedback; // messages are either pending or feedback is being shown

  return (
    <form
      className="flex flex-row items-end max-h-1/3 gap-2 m-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Textarea
        className="flex-1 overflow-auto h-full"
        name="message"
        placeholder="Your message here"
        interactionName={INTERACTION_NAMES.textarea.chatInput}
        rows={2}
        disabled={isReadOnly}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        type="submit"
        interactionName={INTERACTION_NAMES.button.submitChatMessage}
        className="h-10"
        disabled={isReadOnly}
      >
        Submit
      </Button>
    </form>
  );
}
