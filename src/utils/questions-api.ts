import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { AuthError, QuestionsAPIError } from '@/errors/api-errors';
import { NotFoundError } from '@/errors/not-found';
import { errorLog } from './logger';

export const QuestionsAPI = {
  async getQuestionsSearch(
    topics?: string[],
    difficulty?: string[],
    companies?: string[],
    cursor?: number,
    take?: number,
    query?: string
  ) {
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

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get questions');
      }

      const errorData = await response.json();
      throw new QuestionsAPIError(errorData.error || 'Failed to get questions');
    }

    return response.json();
  },
  async getQuestionById(id: number) {
    const response = await fetch(CLUELESS_API_ROUTES.questionsById(id), {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AuthError('Unauthorized to get question');
      } else if (response.status === 404) {
        throw new NotFoundError(`Question with ID ${id} not found.`);
      }
      const errorData = await response.json();
      throw new QuestionsAPIError(errorData.error || 'Failed to get question');
    }

    return response.json();
  },
  async getRecommendedQuestions(userId: number) {
    try {
      const response = await fetch(
        CLUELESS_API_ROUTES.recommendedQuestions(userId),
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new AuthError('Unauthorized to get recommended questions');
        }
        throw new QuestionsAPIError(
          `Failed to get recommended questions for user ${userId}`
        );
      }

      return response.json();
    } catch (error) {
      errorLog('Error fetching recommended questions: ' + error);
    }
  },
};

function handleQuestionsAPIError(error: Error, context: string = '') {
  if (error instanceof NotFoundError) {
    alert(`${context} Not found: ${error.message}`);
    errorLog(`${context} Not found: ${error.message}`);
  } else if (error instanceof AuthError) {
    alert(`${context} Authentication error: ${error.message}`);
    errorLog(`${context} Authentication error: ${error.message}`);
  } else if (error instanceof QuestionsAPIError) {
    errorLog(`${context} Questions API error: ${error.message}`);
  } else {
    errorLog(`${context} Unexpected error: ${error}`);
  }
}

export { handleQuestionsAPIError };
