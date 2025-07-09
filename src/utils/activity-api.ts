import { CLUELESS_API_ROUTES } from "@/constants/api-urls";

export const ActivityAPI = {
  updateActivity: async (
    userId: number,
    type: "seconds" | "questions",
    seconds?: number,
    questions?: boolean
  ) => {
    const body: { seconds?: number; questions?: boolean } = {};
    if (type === "seconds" && seconds !== undefined) {
      body.seconds = seconds;
    } else if (type === "questions" && questions !== undefined) {
      body.questions = questions;
    }

    const response = await fetch(
      CLUELESS_API_ROUTES.activityWithUserId(userId),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to update activity:", response.statusText);
      return;
    }

    const data = await response.json();

    return data;
  },
};
