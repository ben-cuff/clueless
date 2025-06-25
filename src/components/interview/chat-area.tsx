import { Message } from "@/types/message";
import { Card } from "../ui/card";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";

export default function ChatArea({
  messages,
  handleMessageSubmit,
}: {
  messages: Message[];
  handleMessageSubmit: (message: string) => Promise<void>;
}) {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <ChatMessages messages={messages} />
      <ChatInput handleMessageSubmit={handleMessageSubmit} />
    </Card>
  );
}
