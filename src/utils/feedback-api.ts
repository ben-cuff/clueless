import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import PROMPT_MESSAGES from '@/constants/prompt-messages';
import {
  AuthError,
  FeedbackAPIError,
  InterviewAPIError,
} from '@/errors/api-errors';
import { GeminiError } from '@/errors/gemini';
import { NotFoundError } from '@/errors/not-found';
import { MessageRoleType } from '@/types/message';
import { Interview } from '@prisma/client';
import { Dispatch, SetStateAction } from 'react';
import getMessageObject from './ai-message';
import { InterviewAPI } from './interview-api';
import { errorLog } from './logger';

export const FeedbackAPI = {
  async getFeedback(interviewId: string) {
    const response = await fetch(
      CLUELESS_API_ROUTES.feedbackWithInterviewId(interviewId)
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get feedback');
      } else if (response.status === 404) {
        // this is expected if feedback does not exist
        return null;
      }
      const errorData = await response.json();
      throw new FeedbackAPIError(errorData.error || 'Failed to get feedback');
    }

    return response.json();
  },
  async createFeedback(userId: number, interviewId: string, feedback: string) {
    const response = await fetch(CLUELESS_API_ROUTES.feedback, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, feedback, interviewId }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to create feedback');
      }
      const errorData = await response.json();
      throw new FeedbackAPIError(
        errorData.error || 'Failed to create feedback'
      );
    }

    return response.json();
  },
  getGeminiResponse: async (interviewId: string, userId: number) => {
    const systemMessage = getMessageObject(
      MessageRoleType.MODEL,
      PROMPT_MESSAGES.FEEDBACK_MESSAGE_TEXT
    );
    let interview: Interview = {} as Interview;
    try {
      interview = await InterviewAPI.getInterview(userId, interviewId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundError(`Interview with ID ${interviewId} not found.`);
      } else if (error instanceof AuthError) {
        throw new AuthError('Unauthorized to get interview for feedback');
      } else if (error instanceof InterviewAPIError) {
        // do not rethrow, just log the error
        errorLog(`Failed to fetch interview for feedback: ${error.message}`);
      }
    }

    const messages = Array.isArray(interview?.messages)
      ? interview.messages
      : [];
    const finalCode = interview?.code || '';

    const codeMessage = getMessageObject(
      MessageRoleType.USER,
      `This is the state of the users code at the end of the interview: ${finalCode}`
    );

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
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get Gemini response');
      }
      throw new GeminiError(
        `Failed to get Gemini response: ${response.status} ${response.statusText}`
      );
    }

    return response;
  },
};

function handleFeedbackAPIError(
  error: Error,
  context: string = '',
  setError: Dispatch<SetStateAction<string>>
) {
  if (error instanceof NotFoundError) {
    errorLog(`${context} Not found: ${error.message}`);
    setError('Interview not found. Please check the interview ID.');
  } else if (error instanceof AuthError) {
    errorLog(`${context} Authentication error: ${error.message}`);
    setError('Authentication error. Please log in again.');
  } else if (error instanceof GeminiError) {
    errorLog(`${context} Gemini service error: ${error.message}`);
    setError(
      'There was a problem generating feedback. Please try again later.'
    );
  } else {
    errorLog(`${context} Unexpected error: ${error}`);
    setError('Failed to load feedback. Please try again later.');
  }
}

export { handleFeedbackAPIError };
