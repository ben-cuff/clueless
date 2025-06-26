import { Message } from "@/types/message";

export const chatAPI = {
  getGeminiResponse: async (messages: Message[], userMessage: Message) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...(messages ?? []), userMessage].map(
            ({ role, parts }) => ({
              role,
              parts,
            })
          ),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to fetch response");
        console.error("Error fetching response:", errorData);
      }

      if (!response.body) {
        console.error("No response body");
      }

      return response;
    } catch {
      alert("An unexpected error occurred");
    }
  },
};
