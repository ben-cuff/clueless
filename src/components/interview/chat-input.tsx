import { useContext, useState } from "react";
import { FeedbackContext } from "../providers/feedback-provider";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ChatInput({
  handleMessageSubmit,
}: {
  handleMessageSubmit: (message: string) => Promise<void>;
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const isFeedback = useContext(FeedbackContext);

  const submitMessage = async (formData: FormData) => {
    const message = formData.get("message");
    if (!message || (typeof message === "string" && message.trim() === "")) {
      return;
    }

    setIsDisabled(true);
    await handleMessageSubmit(message.toString());
    setIsDisabled(false);
    formData.set("message", "");
  };

  return (
    <form className="flex flex-row items-end p-2" action={submitMessage}>
      <Textarea
        className="m-2 flex-1"
        name="message"
        placeholder="Your message here"
        rows={2}
        disabled={isDisabled || isFeedback}
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
