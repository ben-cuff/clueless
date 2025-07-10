"use client";

import useChatInput from "@/hooks/use-chat-input";
import { useContext } from "react";
import { FeedbackContext } from "../providers/feedback-provider";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ChatInput({
  handleMessageSubmit,
}: {
  handleMessageSubmit: (message: string) => Promise<void>;
}) {
  const isFeedback = useContext(FeedbackContext);

  const { handleSubmit, isDisabled, setMessage, message } =
    useChatInput(handleMessageSubmit);

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
        rows={2}
        disabled={isDisabled || isFeedback}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        type="submit"
        className="m-2 h-10"
        disabled={isDisabled || isFeedback}
      >
        Submit
      </Button>
    </form>
  );
}
