import { Message } from "@/types/message";
import Markdown from "react-markdown";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export default function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <ScrollArea className="flex-1">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                message.role === "model" ? "" : "flex-row-reverse"
              }`}
            >
              <Avatar>
                <AvatarFallback>
                  {message.role === "model" ? "AI" : "ME"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg px-4 max-w-[80%] ${
                  message.role === "model"
                    ? "bg-muted prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none"
                    : "bg-primary text-primary-foreground py-4"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  <Markdown>{message.parts[0].text}</Markdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </ScrollArea>
  );
}
