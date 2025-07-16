import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { errorLog } from './logger';

export const apiQuestions = {
  async getQuestions(
    topics?: string[],
    difficulty?: string[],
    companies?: string[],
    cursor?: number,
    take?: number,
    query?: string
  ) {
    try {
      const params = new URLSearchParams();

      if (topics && topics.length > 0) {
        params.append('topics', topics.join(' '));
      }
      if (difficulty && difficulty.length > 0) {
        params.append('difficulty', difficulty.join(' '));
      }
      if (companies && companies.length > 0) {
        params.append('companies', companies.join(' '));
      }
      if (cursor) {
        params.append('cursor', cursor.toString());
      }
      if (take && typeof take === 'number') {
        params.append('take', take.toString());
      }
      if (query && query.trim() !== '') {
        params.append('query', query);
        params.append('sortBy', 'rank');
      }

      const response = await fetch(CLUELESS_API_ROUTES.questionsSearch(params));

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog('Error fetching questions: ' + error);
    }
  },
  async getQuestionById(id: number) {
    try {
      const response = await fetch(CLUELESS_API_ROUTES.questionsById(id), {
        method: 'GET',
      });

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog('Error fetching question by ID: ' + error);
    }
  },
  async getRecommendedQuestions(userId: number) {
    try {
      const response = await fetch(
        CLUELESS_API_ROUTES.recommendedQuestions(userId),
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      errorLog('Error fetching recommended questions: ' + error);
    }
  },
};
