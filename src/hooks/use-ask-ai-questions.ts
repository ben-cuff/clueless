import { QuestionPartial } from '@/types/question';
import { Nullable } from '@/types/util';
import { handleQuestionsAPIError, QuestionsAPI } from '@/utils/questions-api';
import { useCallback, useState } from 'react';

export default function useAskAIQuestions() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Nullable<QuestionPartial[]>>(null);

  const submitQuestionQuery = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await QuestionsAPI.getAskAIQuestions(message);
      const questionData = response.questions;
      if (
        questionData &&
        Array.isArray(questionData) &&
        questionData.length > 0
      ) {
        setQuestions(questionData as QuestionPartial[]);
      }
    } catch (error) {
      handleQuestionsAPIError(error as Error);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  }, [message]);

  return {
    isLoading,
    questions,
    setQuestions,
    message,
    setMessage,
    submitQuestionQuery,
  };
}
