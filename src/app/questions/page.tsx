'use client';

import { NotificationProvider } from '@/components/providers/notifications-provider';
import AskAI from '@/components/questions/ask-ai/ask-ai';
import QuestionsHeader from '@/components/questions/questions-header';
import QuestionsList from '@/components/questions/questions-list';
import QuestionsLoading from '@/components/questions/questions-loading';
import QuestionsPagination from '@/components/questions/questions-pagination';
import RecommendedQuestions from '@/components/questions/recommended/recommended-questions';
import useQuestions from '@/hooks/questions/use-questions';

export default function QuestionsPage() {
  const {
    companies,
    handleCompaniesChange,
    topics,
    handleTopicsChange,
    isLoading,
    questionsData,
    currentPage,
    takeSize,
    handleTakeSizeChange,
    handleSearchInputChange,
    handleDifficultySelectChange,
    handleNavigateToPage,
  } = useQuestions();

  return (
    <NotificationProvider>
      <div className="w-full mx-auto p-8">
        <RecommendedQuestions />
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
              takeSize={takeSize}
              handleTakeSizeChange={handleTakeSizeChange}
              numQuestions={Number(questionsData[0].total_count) ?? 0}
              handleNavigateToPage={handleNavigateToPage}
            />
          </div>
        ) : (
          <div className="flex justify-center text-3xl mt-12">
            No questions found.
          </div>
        )}
      </div>
      <AskAI />
    </NotificationProvider>
  );
}
