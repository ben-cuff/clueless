import { Message } from '@/types/message';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../error-fallback';
import { Card } from '../ui/card';
import ChatInput from './chat-input';
import ChatMessages from './chat-messages';

export default function ChatArea({
  messages,
  handleMessageSubmit,
}: {
  messages: Message[];
  handleMessageSubmit: (message: string) => Promise<void>;
}) {
  return (
    <ErrorBoundary
      fallback={
        <ErrorFallback text="Error while rendering chat area, try again later" />
      }
    >
      <Card className="flex flex-col overflow-auto w-full h-full">
        <ChatMessages messages={messages} />
        <ChatInput handleMessageSubmit={handleMessageSubmit} />
      </Card>
    </ErrorBoundary>
  );
}
