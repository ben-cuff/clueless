import { UserIdContext } from "@/components/providers/user-id-provider";
import { feedbackAPI } from "@/utils/feedback-api";
import { errorLog } from "@/utils/logger";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useFeedback(interviewId: string) {
  const [isModalOpen, setIsModalOpened] = useState(true);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = useContext(UserIdContext);

  const toggleModal = useCallback(() => {
    setIsModalOpened(!isModalOpen);
  }, [isModalOpen]);

  const generateFeedback = useCallback(async () => {
    let response;
    try {
      response = await feedbackAPI.getGeminiResponse(interviewId, userId);
    } catch (error) {
      if (error instanceof Error) {
        errorLog("Error generating feedback: " + error);
        setError(error.message || "Failed to generate feedback");
      } else {
        errorLog("Unexpected error: " + error);
        setError("Failed to generate feedback");
      }
      return;
    }
    if (!response || !response.ok || !response.body) {
      setError("Failed to generate feedback. Please try again later.");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = "";

    let done = false;
    while (!done) {
      const result = await reader.read();
      done = result.done;
      if (!done) {
        const chunk = decoder.decode(result.value);
        content += chunk;
        setFeedbackContent(content);
      }
    }
    return content;
  }, [interviewId, userId]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data = await feedbackAPI.getFeedback(interviewId);

      if (!data || data.error) {
        const feedbackFromModel = await generateFeedback();
        feedbackAPI.createFeedback(
          userId,
          interviewId,
          feedbackFromModel as string
        );
      } else {
        setFeedbackContent(data.feedback);
      }
      setIsLoading(false);
    })();
  }, [interviewId, generateFeedback, userId]);

  return { isModalOpen, toggleModal, feedbackContent, isLoading, error };
}
