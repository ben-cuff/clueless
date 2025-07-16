import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { Activity } from '@prisma/client';
import { errorLog } from './logger';

export const ActivityAPI = {
  updateActivity: async (userId: number, type: 'seconds' | 'questions') => {
    const body: { questions?: boolean } = {};

    if (type === 'questions') {
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
      errorLog('Failed to update activity: ' + response.statusText);
      return;
    }

    const data = await response.json();

    return data;
  },
  getActivity: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.activityWithUserId(userId),
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      errorLog('Failed to fetch activity: ' + response.statusText);
      return;
    }

    const data = await response.json();

    return data as Activity[];
  },
};
