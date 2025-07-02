import { Clueless_API_Routes } from "@/constants/api-urls";
import { systemMessageText } from "@/constants/prompt-fillers";
import { Message } from "@/types/message";

export const chatAPI = {
  getGeminiResponse: async (
    messages: Message[],
    userMessage: Message,
    questionNumber: number
  ) => {
    try {
      const systemMessage = {
        role: "model",
        parts: [
          {
            text: systemMessageText,
          },
        ],
      };

      const newMessagesWithSystemAndUser = [
        systemMessage,
        ...messages,
        userMessage,
      ];

      const response = await fetch(Clueless_API_Routes.chat, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessagesWithSystemAndUser,
          questionNumber: questionNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.error);
      }

      if (!response.body) {
        console.error("No response body");
      }

      return response;
    } catch {
      alert("An unexpected error occurred");
    }
  },
};
