const MessageRoleType = {
  USER: 'user',
  MODEL: 'model',
} as const;

type MessageRoleType = (typeof MessageRoleType)[keyof typeof MessageRoleType];

type Message = {
  role: MessageRoleType;
  parts: Array<{ text: string }>;
};

export { MessageRoleType, type Message };
