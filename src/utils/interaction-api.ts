import { CLUELESS_API_ROUTES } from '@/constants/api-urls';
import { errorLog } from './logger';

export const InteractionAPI = {
  async addEvent(eventName: string, pathname: string, value?: string) {
    const body: { eventName: string; pathname: string; value?: string } = {
      eventName,
      pathname,
    };

    if (value !== undefined) {
      body.value = value;
    }

    const response = await fetch(CLUELESS_API_ROUTES.interactions, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      errorLog(
        `Failed to add interaction event: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  },
};
