function getMessageObject(role: "user" | "model", text: string): Message {
  return {
    role,
    parts: [
      {
        text,
      },
    ],
  };
}

export { getMessageObject };
