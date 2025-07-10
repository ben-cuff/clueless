import { CLUELESS_API_ROUTES } from "@/constants/api-urls";
import { SYSTEM_MESSAGE_TEXT } from "@/constants/prompt-fillers";
import { Message } from "@/types/message";
import { errorLog } from "./logger";

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
            text: SYSTEM_MESSAGE_TEXT,
          },
        ],
      };

      const newMessagesWithSystemAndUser = [
        systemMessage,
        ...messages,
        userMessage,
      ];

      const response = await fetch(CLUELESS_API_ROUTES.chat, {
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
        errorLog("Chat API error: " + errorData.error);
      }

      if (!response.body) {
        errorLog("No response body");
      }

      return response;
    } catch {
      alert("An unexpected error occurred");
    }
  },
};
