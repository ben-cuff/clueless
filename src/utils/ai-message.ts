import { Message, MessageRoleType } from '@/types/message';

function getMessageObject(role: MessageRoleType, text: string): Message {
  return {
    role,
    parts: [
      {
        text,
      },
    ],
  };
}

export default getMessageObject;
