import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { errorLog } from './logger';

export const GoalsAPI = {
  createGoal: async (
    userId: number,
    goalType: 'hours' | 'questions',
    goalValue: number,
    endDate: Date
  ) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [goalType]: goalValue,
        endDate,
      }),
    });

    if (!response.ok) {
      errorLog('Failed to create goal: ' + response.statusText);
      return null;
    }

    const data = await response.json();

    return data;
  },
  getGoal: async (userId: number) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId));
    if (!response.ok) {
      errorLog('Failed to fetch goal: ' + response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  },
  updateGoal: async (
    userId: number,
    goalType: 'hours' | 'questions',
    goalValue: number,
    endDate: Date
  ) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        [goalType]: goalValue,
        endDate,
      }),
    });

    if (!response.ok) {
      errorLog('Failed to update goal: ' + response.statusText);
      return null;
    }

    const data = await response.json();

    return data;
  },
  getGoalProgress: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.goalProgressWithUserId(userId)
    );
    if (!response.ok) {
      errorLog('Failed to fetch goal progress: ' + response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  },
  deleteGoal: async (userId: number) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId), {
      method: 'DELETE',
    });

    if (!response.ok) {
      errorLog('Failed to delete goal: ' + response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  },
};
