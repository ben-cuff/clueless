import { Message } from "@/types/message";

export const chatAPI = {
  getGeminiResponse: async (messages: Message[], userMessage: Message) => {
    try {
      const systemMessage = {
        role: "model",
        parts: [
          {
            text:
              "You are an AI interviewer who is conducting a technical interview. " +
              "You will ask the user a question and wait for their response. " +
              "You will not provide any explanations or additional information. " +
              "You will can ask leading questions or for clarification but do not give them the answer " +
              "You will only respond with the next question or follow-up question based on the user's response. " +
              "You will not provide any code or solutions. " +
              "You should ask the user to walk through their thought process and explain their reasoning before coding." +
              "Whenever the user submits code, you will receive the output of the code execution " +
              "and you will help lead the user in the correct direction if there is a bug" +
              "Once you are satisfied with the user's response, you will end the interview by saying 'Thank you for your time.'",
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
