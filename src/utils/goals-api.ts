import { CLUELESS_API_ROUTES } from "@/constants/api-urls";

export const GoalsAPI = {
  createGoal: async (
    userId: number,
    goalType: "hours" | "questions",
    goalValue: number,
    endDate: Date
  ) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [goalType]: goalValue,
        endDate,
      }),
    });

    if (!response.ok) {
      alert(`Unable to create goal`);
    }

    const data = await response.json();

    console.log("Goal created:", data);

    return data;
  },
  getGoal: async (userId: number) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId));
    if (!response.ok) {
      console.error("Failed to fetch goal:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  },
  updateGoal: async (
    userId: number,
    goalType: "hours" | "questions",
    goalValue: number,
    endDate: Date
  ) => {
    const response = await fetch(CLUELESS_API_ROUTES.goalWithUserId(userId), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [goalType]: goalValue,
        endDate,
      }),
    });

    if (!response.ok) {
      alert(`Unable to update goal`);
    }

    const data = await response.json();

    console.log("Goal updated:", data);

    return data;
  },
  getGoalProgress: async (userId: number) => {
    const response = await fetch(
      CLUELESS_API_ROUTES.goalProgressWithUserId(userId)
    );
    if (!response.ok) {
      console.error("Failed to fetch goal progress:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  },
};
