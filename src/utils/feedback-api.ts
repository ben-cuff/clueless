import { feedbackMessageText } from "@/constants/prompt-fillers";
import { interviewAPI } from "./interview-api";

export const feedbackAPI = {
  async getFeedback(interviewId: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback/${interviewId}`
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return null;
    }
  },
  async createFeedback(userId: number, interviewId: string, feedback: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, feedback, interviewId }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating feedback:", error);
      return null;
    }
  },
  getGeminiResponse: async (interviewId: string, userId: number) => {
    try {
      const systemMessage = {
        role: "model",
        parts: [
          {
            text: feedbackMessageText,
          },
        ],
      };

      const interview = await interviewAPI.getInterview(userId, interviewId);
      const messages = interview?.messages || [];
      const finalCode = interview?.code || "";

      const codeMessage = {
        role: "user",
        parts: [
          {
            text: `This is the state of the users code at the end of the interview: ${finalCode}`,
          },
        ],
      };

      const newMessagesWithSystemAndUser = [
        systemMessage,
        ...messages,
        codeMessage,
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
            interviewId,
          }),
        }
      );

      return response;
    } catch {
      alert("An unexpected error occurred");
    }
  },
};
