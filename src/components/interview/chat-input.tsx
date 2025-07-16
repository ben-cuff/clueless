'use client';

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
      className="flex flex-row items-end p-2"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Textarea
        className="m-2 flex-1"
        name="message"
        placeholder="Your message here"
        interactionName="chat_input_change"
        rows={2}
        disabled={isReadOnly}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        type="submit"
        interactionName="submit_message_button_press"
        className="m-2 h-10"
        disabled={isReadOnly}
      >
        Submit
      </Button>
    </form>
  );
}
