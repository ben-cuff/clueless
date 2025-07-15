import { CLUELESS_API_ROUTES } from "@/constants/api-urls";
import { Message } from "@/types/message";
import { InterviewType } from "@prisma/client";
import { errorLog } from "./logger";

export const interviewAPI = {
  async createOrUpdateInterview(
    userId: number,
    id: string,
    messages: Message[],
    questionNumber: number,
    code: string,
    codeLanguage: string,
    type: InterviewType = InterviewType.UNTIMED
  ) {
    try {
      const response = await fetch(
        CLUELESS_API_ROUTES.interviewWithUserId(userId),
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
            type,
          }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog("Error creating or updating interview: " + error);
    }
  },
  async updateCodeForInterview(
    userId: number,
    id: string,
    code: string,
    language: string
  ) {
    try {
      const response = await fetch(
        CLUELESS_API_ROUTES.interviewWithUserIdForCode(userId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, code, language }),
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog("Error updating code for interview: " + error);
    }
  },
  async getInterview(userId: number, interviewId: string) {
    try {
      const response = await fetch(
        CLUELESS_API_ROUTES.interviewWithUserIdAndInterviewId(
          userId,
          interviewId
        )
      );

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog("Error fetching interview: " + error);
    }
  },
  async getInterviewsByUserId(userId: number) {
    try {
      const response = await fetch(
        CLUELESS_API_ROUTES.interviewWithUserId(userId)
      );

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog("Error fetching interviews by user ID: " + error);
    }
  },
  async deleteInterview(userId: number, interviewId: string) {
    try {
      await fetch(
        CLUELESS_API_ROUTES.interviewWithUserIdAndInterviewId(
          userId,
          interviewId
        ),
        {
          method: "DELETE",
        }
      );

      return { success: true };
    } catch (error) {
      errorLog("Error deleting interview: " + error);
      return {
        success: false,
      };
    }
  },
};
