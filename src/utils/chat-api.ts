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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: newMessagesWithSystemAndUser,
            questionNumber: questionNumber,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch response");
        console.error("Error fetching response:", errorData);
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
