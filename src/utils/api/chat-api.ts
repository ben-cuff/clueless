import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import PROMPT_MESSAGES from '@/constants/prompt-messages';
import { AuthError } from '@/errors/api-errors';
import { GeminiError } from '@/errors/gemini';
import { Message } from '@/types/message';

export const ChatAPI = {
  getGeminiResponse: async (
    messages: Message[],
    userMessage: Message,
    questionNumber: number
  ) => {
    const newMessagesWithUserMessage = [...messages, userMessage];

    const response = await fetch(CLUELESS_API_ROUTES.chat, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: newMessagesWithUserMessage,
        questionNumber: questionNumber,
        systemInstruction: PROMPT_MESSAGES.SYSTEM_MESSAGE_TEXT,
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
