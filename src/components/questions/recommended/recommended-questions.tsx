import useRecommended from "@/hooks/use-recommended";
import QuestionsList from "../questions-list";
import QuestionsLoading from "../questions-loading";
import RecommendedHeader from "./recommended-header";
import ToggleRecommendedButton from "./toggle-recommended-button";

export default function RecommendedQuestions() {
  const {
    recommendedQuestions,
    isLoading,
    isHidden,
    toggleIsHidden,
    isLoggedIn,
  } = useRecommended();

  if (!isLoggedIn) {
    return <></>;
  }

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
