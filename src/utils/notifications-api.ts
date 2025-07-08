import { CLUELESS_API_ROUTES } from "@/constants/api-urls";

export const notificationsAPI = {
  getNotification: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.notificationsWithUserId(userId),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return { notify: false };
    }

    return await response.json();
  },
};
