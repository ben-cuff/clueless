import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { AuthError, GoalsAPIError } from '@/errors/api-errors';
import { NotFoundError } from '@/errors/not-found';
import { GoalCategoryTabs } from '@/types/goal-tab';
import { errorLog } from '@/utils/logger';

export const GoalsAPI = {
  createGoal: async (
    userId: number,
    goalType: GoalCategoryTabs,
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
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to create goal');
      }
      const errorData = await response.json();
      throw new GoalsAPIError(errorData.error || 'Failed to create goal');
    }

    return response.json();
  },
  getGoal: async (userId: number) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId));

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get goal progress');
      }
      if (response.status === 404) {
        throw new NotFoundError(`Goal progress for user ${userId} not found.`);
      }
      const errorData = await response.json();
      throw new GoalsAPIError(errorData.error || 'Failed to get goal progress');
    }
    return response.json();
  },
  updateGoal: async (
    userId: number,
    goalType: GoalCategoryTabs,
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
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get goal progress');
      }
      if (response.status === 404) {
        throw new NotFoundError(`Goal progress for user ${userId} not found.`);
      }
      const errorData = await response.json();
      throw new GoalsAPIError(errorData.error || 'Failed to get goal progress');
    }
    return response.json();
  },
  getGoalProgress: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.goalProgressWithUserId(userId)
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get goal progress');
      }
      if (response.status === 404) {
        throw new NotFoundError(`Goal progress for user ${userId} not found.`);
      }
      const errorData = await response.json();
      throw new GoalsAPIError(errorData.error || 'Failed to get goal progress');
    }
    return response.json();
  },
  deleteGoal: async (userId: number) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId), {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get goal progress');
      }
      if (response.status === 404) {
        throw new NotFoundError(`Goal progress for user ${userId} not found.`);
      }
      const errorData = await response.json();
      throw new GoalsAPIError(errorData.error || 'Failed to get goal progress');
    }
    return response.json();
  },
};

function handleGoalsAPIError(error: Error, context: string = '') {
  if (error instanceof NotFoundError) {
    alert(`${context} Not found: ${error.message}`);
    errorLog(`${context} Not found: ${error.message}`);
  } else if (error instanceof AuthError) {
    alert(`${context} Authentication error: ${error.message}`);
    errorLog(`${context} Authentication error: ${error.message}`);
  } else if (error instanceof GoalsAPIError) {
    alert(`${context} Goals API error: ${error.message}`);
    errorLog(`${context} Goals API error: ${error.message}`);
  } else {
    alert(`${context} Unexpected error: ${error}`);
    errorLog(`${context} Unexpected error: ${error}`);
  }
}

export { handleGoalsAPIError };
