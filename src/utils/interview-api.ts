import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { AuthError, InterviewAPIError } from '@/errors/api-errors';
import { NotFoundError } from '@/errors/not-found';
import { Message } from '@/types/message';
import { InterviewType } from '@prisma/client';

export const InterviewAPI = {
  async createOrUpdateInterview(
    userId: number,
    id: string,
    messages: Message[],
    questionNumber: number,
    code: string,
    codeLanguage: string,
    type: InterviewType = InterviewType.UNTIMED
  ) {
    const response = await fetch(
      CLUELESS_API_ROUTES.interviewWithUserId(userId),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to create or update interview');
      }
      const errorData = await response.json();
      throw new InterviewAPIError(
        errorData.error || 'Failed to create or update interview'
      );
    }

    return response.json();
  },
  async updateCodeForInterview(
    userId: number,
    id: string,
    code: string,
    language: string
  ) {
    const response = await fetch(
      CLUELESS_API_ROUTES.interviewWithUserIdForCode(userId),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, code, language }),
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to update interview code');
      } else if (response.status === 404) {
        throw new NotFoundError(`Interview with ID ${id} not found.`);
      }
      const errorData = await response.json();
      throw new InterviewAPIError(
        errorData.error || 'Failed to update interview code'
      );
    }

    return response.json();
  },
  async getInterview(userId: number, interviewId: string) {
    const response = await fetch(
      CLUELESS_API_ROUTES.interviewWithUserIdAndInterviewId(userId, interviewId)
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get interview');
      } else if (response.status === 404) {
        throw new NotFoundError(`Interview with ID ${interviewId} not found.`);
      }
      const errorData = await response.json();
      throw new InterviewAPIError(errorData.error || 'Failed to get interview');
    }

    return response.json();
  },
  async getInterviewsByUserId(userId: number) {
    const response = await fetch(
      CLUELESS_API_ROUTES.interviewWithUserId(userId)
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get interviews');
      }

      const errorData = await response.json();
      throw new InterviewAPIError(
        errorData.error || 'Failed to get interviews'
      );
    }

    return response.json();
  },
  async deleteInterview(userId: number, interviewId: string) {
    const response = await fetch(
      CLUELESS_API_ROUTES.interviewWithUserIdAndInterviewId(
        userId,
        interviewId
      ),
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to delete interview');
      } else if (response.status === 404) {
        throw new NotFoundError(`Interview with ID ${interviewId} not found.`);
      }
      const errorData = await response.json();
      throw new InterviewAPIError(
        errorData.error || 'Failed to delete interview'
      );
    }

    return { success: true };
  },
};
