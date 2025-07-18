import {
  USER_SUBMITTED_CODE_MESSAGE,
  USER_SUBMITTED_CODE_MESSAGE_WITHOUT_OUTPUT,
} from '@/constants/prompt-fillers';
import { Message } from '@/types/message';
import Markdown from 'react-markdown';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

export default function ChatMessages({ messages }: { messages: Message[] }) {
  const messagesWithoutOutput = messages.map((message) =>
    message.parts[0].text.startsWith(USER_SUBMITTED_CODE_MESSAGE)
      ? {
          ...message,
          parts: [
            {
              text: USER_SUBMITTED_CODE_MESSAGE_WITHOUT_OUTPUT,
            },
          ],
        }
      : message
  );

  return (
    <ScrollArea className="overflow-y-auto h-full">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          {messagesWithoutOutput.map((message, idx) => (
            <div
              key={idx}
              data-testid={`chat-message-${message.role}-${idx}`}
              className={`flex gap-3 ${
                message.role === 'model' ? '' : 'flex-row-reverse'
              }`}
            >
              <Avatar>
                <AvatarFallback>
                  {message.role === 'model' ? 'AI' : 'ME'}
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-4 max-w-120 bg-muted">
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
