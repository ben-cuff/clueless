import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { CompanyInfo } from '@/constants/companies';
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
      const data = await response.json();
      alert(`${data.error || 'Unable to update goal'}`);
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
      const data = await response.json();
      alert(`${data.error || 'Unable to update goal'}`);
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
  UpdateGoalCompanies: async (userId: number, companies: CompanyInfo[]) => {
    const companyEnums = companies.map((company) => company.db);

    const response = await fetch(
      CLUELESS_API_ROUTES.goalWithUserIdWithCompany(userId),
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companies: companyEnums }),
      }
    );

    if (!response.ok) {
      errorLog('Failed to update goal companies: ' + response.statusText);
      return null;
    }

    const data = await response.json();

    return data;
  },
};
