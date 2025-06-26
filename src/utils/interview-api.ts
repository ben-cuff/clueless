import { Message } from "@/types/message";

export const interviewAPI = {
  async createOrUpdateInterview(
    userId: string,
    id: string,
    messages: Message[],
    questionNumber: number,
    code: string,
    codeLanguage: string
  ) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            messages,
            questionNumber,
            code,
            codeLanguage: codeLanguage.toUpperCase(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create or update interview");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating or updating interview:", error);
    }
  },
  async updateCodeForInterview(userId: string, id: string, code: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/${userId}/code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, code }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update code for interview");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating code for interview:", error);
    }
  },
};
