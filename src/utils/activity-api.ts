import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { ActivityAPIError, AuthError } from '@/errors/api-errors';
import { Activity, GoalType } from '@prisma/client';
import { errorLog } from './logger';

export const ActivityAPI = {
  updateActivity: async (userId: number, type: GoalType) => {
    const body: { questions?: boolean } = {};

    if (type === GoalType.QUESTION) {
      body.questions = true;
    }

    const response = await fetch(
      CLUELESS_API_ROUTES.activityWithUserId(userId),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to update activity');
      }
      throw new ActivityAPIError(
        errorData.error || 'Failed to update activity'
      );
    }

    return response.json();
  },
  getActivity: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.activityWithUserId(userId),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to update activity');
      }
      throw new ActivityAPIError(
        errorData.error || 'Failed to update activity'
      );
    }

    const data = await response.json();

    return data as Activity[];
  },
};

function handleActivityAPIError(error: unknown) {
  const isServerSide = typeof window === 'undefined';

  if (error instanceof ActivityAPIError || error instanceof AuthError) {
    if (isServerSide) {
      errorLog(error.message);
    } else {
      alert(error.message);
    }
  } else {
    if (isServerSide) {
      errorLog('Unexpected Activity API error: ' + error);
    } else {
      alert('An unexpected error occurred, please retry later');
    }
  }
}

export { handleActivityAPIError };
