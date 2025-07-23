import { UserIdContext } from '@/components/providers/user-id-provider';
import { FeedbackAPI, handleFeedbackAPIError } from '@/utils/feedback-api';
import { useCallback, useContext, useEffect, useState } from 'react';

export default function useFeedback(interviewId: string) {
  const [isModalOpen, setIsModalOpened] = useState(true);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = useContext(UserIdContext);

  const toggleModal = useCallback(() => {
    setIsModalOpened(!isModalOpen);
  }, [isModalOpen]);

  const generateFeedback = useCallback(async () => {
    let response;
    try {
      response = await FeedbackAPI.getGeminiResponse(interviewId, userId);
    } catch (error) {
      handleFeedbackAPIError(
        error as Error,
        'While creating feedback:',
        setError
      );
      return;
    }
    if (!response || !response.ok || !response.body) {
      setError('Failed to generate feedback. Please try again later.');
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = '';

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
      try {
        const data = await FeedbackAPI.getFeedback(interviewId);

        const feedbackFromModel = await generateFeedback();
        if (feedbackFromModel) {
          FeedbackAPI.createFeedback(
            userId,
            interviewId,
            feedbackFromModel as string
          );
        } else {
          setFeedbackContent(data.feedback);
        }
      } catch (err) {
        handleFeedbackAPIError(
          err as Error,
          'While loading feedback:',
          setError
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [interviewId, generateFeedback, userId]);

  return { isModalOpen, toggleModal, feedbackContent, isLoading, error };
}
