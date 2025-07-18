import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { FEEDBACK_MESSAGE_TEXT } from '@/constants/prompt-fillers';
import { NotFoundError } from '@/errors/not-found';
import { interviewAPI } from './interview-api';
import { errorLog } from './logger';

export const feedbackAPI = {
  async getFeedback(interviewId: string) {
    try {
      const response = await fetch(
        CLUELESS_API_ROUTES.feedbackWithInterviewId(interviewId)
      );

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog('Error fetching feedback: ' + error);
      return null;
    }
  },
  async createFeedback(userId: number, interviewId: string, feedback: string) {
    try {
      const response = await fetch(CLUELESS_API_ROUTES.feedback, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, feedback, interviewId }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog('Error creating feedback: ' + error);
      return null;
    }
  },
  getGeminiResponse: async (interviewId: string, userId: number) => {
    const systemMessage = {
      role: 'model',
      parts: [
        {
          text: FEEDBACK_MESSAGE_TEXT,
        },
      ],
    };

    const interview = await interviewAPI.getInterview(userId, interviewId);

    if (interview.error) {
      throw new NotFoundError(`Interview with ID ${interviewId} not found.`);
    }

    const messages = interview?.messages || [];
    const finalCode = interview?.code || '';

    const codeMessage = {
      role: 'user',
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

    const response = await fetch(CLUELESS_API_ROUTES.chat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: newMessagesWithSystemAndUser,
        interviewId,
      }),
    });

    if (!response.ok) {
      throw new GeminiError(
        `Failed to get Gemini response: ${response.status} ${response.statusText}`
      );
    }

    return response;
  },
};
