"use client";

import QuestionsHeader from "@/components/questions/questions-header";
import QuestionsLoading from "@/components/questions/questions-loading";
import QuestionsPagination from "@/components/questions/questions-pagination";
import { Badge } from "@/components/ui/badge";
import { READABLE_COMPANIES } from "@/constants/companies";
import { READABLE_DIFFICULTIES } from "@/constants/difficulties";
import { READABLE_TOPICS } from "@/constants/topics";
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
      ) : questionsData && questionsData.length != 0 ? (
        <div className="flex flex-col w-full space-y-2">
          {questionsData.map((q, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center w-full px-4 py-2 border rounded shadow space-x-6"
            >
              <h2 className="text-xl font-semibold">
                {q.questionNumber}. {q.title}
              </h2>
              <div
                className={
                  q.difficulty === 1
                    ? "text-green-600"
                    : q.difficulty === 2
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {READABLE_DIFFICULTIES[q.difficulty]}
              </div>
              <div className="ml-5 font-bold">
                {q.companies
                  .map((company) => READABLE_COMPANIES[company])
                  .join(", ")}
              </div>
              <div className="flex flex-wrap gap-2 ml-auto">
                {q.topics.map((topic) => (
                  <Badge key={topic} className="px-2 py-1 rounded-full text-sm">
                    {READABLE_TOPICS[topic]}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
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
