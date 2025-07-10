import { CLUELESS_API_ROUTES } from "@/constants/api-urls";

export const interactionAPI = {
  async addEvent(eventName: string, pathname: string) {
    const response = await fetch(CLUELESS_API_ROUTES.interactions, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ eventName, pathname }),
    });
    return response.json();
  },
};
