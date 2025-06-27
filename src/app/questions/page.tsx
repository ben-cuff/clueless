"use client";

import QuestionsHeader from "@/components/questions/questions-header";
import QuestionsList from "@/components/questions/questions-list";
import QuestionsLoading from "@/components/questions/questions-loading";
import QuestionsPagination from "@/components/questions/questions-pagination";
import useQuestions from "@/hooks/use-questions";

export default function QuestionsPage() {
  const {
    companies,
    handleCompaniesChange,
    topics,
    handleTopicsChange,
    isLoading,
    questionsData,
    currentPage,
    handlePreviousPage,
    handleNextPage,
    takeSize,
    handleTakeSizeChange,
    handleSearchInputChange,
    handleDifficultySelectChange,
  } = useQuestions();

  return (
    <div className="w-full mx-auto p-8">
      <QuestionsHeader
        handleCompaniesChange={handleCompaniesChange}
        handleDifficultySelectChange={handleDifficultySelectChange}
        handleSearchInputChange={handleSearchInputChange}
        handleTopicsChange={handleTopicsChange}
        topics={topics}
        companies={companies}
      />
      {isLoading ? (
        <QuestionsLoading takeSize={takeSize} />
      ) : Array.isArray(questionsData) && questionsData.length > 0 ? (
        <div className="flex flex-col w-full space-y-2">
          <QuestionsList questionsData={questionsData} />
          <QuestionsPagination
            currentPage={currentPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            questionsData={questionsData}
            takeSize={takeSize}
            handleTakeSizeChange={handleTakeSizeChange}
          />
        </div>
      ) : (
        <div className="flex justify-center text-3xl mt-12">
          No questions found.
        </div>
      )}
    </div>
  );
}
