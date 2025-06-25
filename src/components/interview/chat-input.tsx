import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ChatInput({
  handleMessageSubmit,
}: {
  handleMessageSubmit: (message: string) => Promise<void>;
}) {
  const [isDisabled, setIsDisabled] = useState(false);

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const textarea = form.querySelector("textarea");
    if (textarea?.value.trim() === "") {
      return;
    }

    if (textarea) {
      setIsDisabled(true);
      await handleMessageSubmit(textarea.value);
      setIsDisabled(false);
      textarea.value = "";
    }
  };

  return (
    <form className="flex flex-row items-end p-2" onSubmit={formSubmit}>
      <Textarea
        className="m-2 flex-1"
        placeholder="Your message here"
        rows={2}
        disabled={isDisabled}
      />
      <Button type="submit" className="m-2 h-10" disabled={isDisabled}>
        Submit
      </Button>
    </form>
  );
}
