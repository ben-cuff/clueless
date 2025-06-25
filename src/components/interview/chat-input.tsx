import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ChatInput({
  handleMessageSubmit,
}: {
  handleMessageSubmit: (message: string) => Promise<void>;
}) {
  const formSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const textarea = form.querySelector("textarea");
    if (textarea?.value.trim() === "") {
      return;
    }

    if (textarea) {
      await handleMessageSubmit(textarea.value);
      textarea.value = "";
    }
  };

  return (
    <form className="flex flex-row items-end p-2" onSubmit={formSubmit}>
      <Textarea
        className="m-2 flex-1"
        placeholder="Your message here"
        rows={2}
      />
      <Button type="submit" className="m-2 h-10">
        Submit
      </Button>
    </form>
  );
}
