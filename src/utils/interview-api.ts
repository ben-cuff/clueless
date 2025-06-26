import { Message } from "@/types/message";

export const interviewAPI = {
  async createOrUpdateInterview(
    userId: number,
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating or updating interview:", error);
    }
  },
  async updateCodeForInterview(userId: number, id: string, code: string) {
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

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating code for interview:", error);
    }
  },
  async getInterview(userId: number, interviewId: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/${userId}/${interviewId}`
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching interview:", error);
    }
  },
  async getInterviewsByUserId(userId: number) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/${userId}`
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching interviews by user ID:", error);
    }
  },
  async deleteInterview(userId: number, interviewId: string) {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/${userId}/${interviewId}`,
        {
          method: "DELETE",
        }
      );

      return { success: true };
    } catch (error) {
      console.error("Error deleting interview:", error);
      return {
        success: false,
      };
    }
  },
};
