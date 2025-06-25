export const apiQuestions = {
  async getQuestions(
    topics?: string[],
    difficulty?: string[],
    companies?: string[],
    cursor?: number,
    take?: number,
    skip?: number,
    query?: string
  ) {
    try {
      const params = new URLSearchParams();

      if (topics && topics.length > 0) {
        params.append("topics", topics.join(" "));
      }
      if (difficulty && difficulty.length > 0) {
        params.append("difficulty", difficulty.join(" "));
      }
      if (companies && companies.length > 0) {
        params.append("companies", companies.join(" "));
      }
      if (cursor && typeof cursor === "number") {
        params.append("cursor", cursor.toString());
      }
      if (take && typeof take === "number") {
        params.append("take", take.toString());
      }
      if (skip && typeof skip === "number") {
        params.append("skip", skip.toString());
      }
      if (query && query.trim() !== "") {
        params.append("query", query);
        params.append("sortBy", "rank");
      }

      const response = await fetch(
        `/api/questions/search?${params.toString()}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  },
  async getQuestionById(id: number) {
    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error fetching question with ID ${id}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching question by ID:", error);
    }
  },
};
