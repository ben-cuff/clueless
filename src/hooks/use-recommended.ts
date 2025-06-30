import { Question } from "@/types/question";
import { apiQuestions } from "@/utils/questions-api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

export default function useRecommended() {
  const [recommendedQuestions, setRecommendedQuestions] =
    useState<Question[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (session && session.user && session.user.id) {
        setIsLoading(true);
        setIsLoggedIn(true);
        const data = await apiQuestions.getRecommendedQuestions(
          session.user.id
        );

        if (data) {
          setRecommendedQuestions(data);
        }
        setIsLoading(false);
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
