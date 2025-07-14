import { UserIdContext } from "@/components/providers/user-id-provider";
import { feedbackAPI } from "@/utils/feedback-api";
import { useCallback, useContext, useEffect, useState } from "react";

export default function useFeedback(interviewId: string) {
  const [isModalOpen, setIsModalOpened] = useState(true);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const userId = useContext(UserIdContext);

  const toggleModal = useCallback(() => {
    setIsModalOpened(!isModalOpen);
  }, [isModalOpen]);

  const generateFeedback = useCallback(async () => {
    const response = await feedbackAPI.getGeminiResponse(interviewId, userId);
    if (!response || !response.body) {
      alert("An unexpected error occurred");
      return;
    }

    if (!response.ok) {
      setIsError(true);
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

  return { isModalOpen, toggleModal, feedbackContent, isLoading, isError };
}
