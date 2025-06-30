import { Question } from "@/types/question";
import { apiQuestions } from "@/utils/questions-api";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import QuestionsList from "../questions-list";
import QuestionsLoading from "../questions-loading";
import RecommendedHeader from "./recommended-header";
import ToggleRecommendedButton from "./toggle-recommended-button";

export default function RecommendedQuestions() {
  const [recommendedQuestions, setRecommendedQuestions] =
    useState<Question[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      if (session && session.user && session.user.id) {
        setIsLoading(true);
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

  return (
    <>
      <ToggleRecommendedButton
        isHidden={isHidden}
        toggleIsHidden={toggleIsHidden}
      />
      {!isHidden && (
        <RecommendedHeader>
          {isLoading ? (
            <QuestionsLoading takeSize={5} />
          ) : (
            recommendedQuestions && (
              <QuestionsList questionsData={recommendedQuestions} />
            )
          )}
        </RecommendedHeader>
      )}
    </>
  );
}
