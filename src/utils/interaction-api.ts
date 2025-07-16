import { CLUELESS_API_ROUTES } from '@/constants/api-urls';

export const interactionAPI = {
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
    return response.json();
  },
};
