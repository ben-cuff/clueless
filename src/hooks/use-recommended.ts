import { QuestionPartial } from '@/types/question';
import { handleQuestionsAPIError, QuestionsAPI } from '@/utils/questions-api';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

export default function useRecommended() {
  const [recommendedQuestions, setRecommendedQuestions] =
    useState<QuestionPartial[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (session?.user?.id) {
        setIsLoading(true);
        setIsLoggedIn(true);
        try {
          const data = await QuestionsAPI.getRecommendedQuestions(
            session.user.id
          );

          if (data) {
            setRecommendedQuestions(data);
          }
        } catch (error) {
          handleQuestionsAPIError(
            error as Error,
            'While fetching recommended questions'
          );
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [session]);

  const toggleIsHidden = useCallback(() => {
    setIsHidden(!isHidden);
  }, [isHidden]);

  return {
    recommendedQuestions,
    isLoading,
    isHidden,
    toggleIsHidden,
    isLoggedIn,
  };
}
