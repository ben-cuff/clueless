import { DEFAULT_TAKE_SIZE } from '@/constants/take-sizes';
import { TOPIC_LIST, TopicInfo } from '@/constants/topics';
import { QuestionWithRowNumber } from '@/types/question';
import { handleQuestionsAPIError, QuestionsAPI } from '@/utils/questions-api';
import { useCallback, useEffect, useState } from 'react';
import useCompanies from './use-companies';
import useDebounce from './use-debouncer';

export default function useQuestions() {
  const [questionsData, setQuestionsData] = useState<QuestionWithRowNumber[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [takeSize, setTakeSize] = useState(DEFAULT_TAKE_SIZE);
  const [currentPage, setCurrentPage] = useState(1);
  const [topics, setTopics] = useState<TopicInfo[]>();
  const [searchInput, setSearchInput] = useState('');
  const [difficulty, setDifficulty] = useState('none');
  const { companies, handleCompaniesChange } = useCompanies();

  const debouncedSearch = useDebounce(searchInput, 500) as string;

  const fetchQuestions = useCallback(
    async (
      direction: 'next' | 'prev' | 'init' = 'init',
      refRowNum?: number
    ) => {
      setIsLoading(true);
      const topicsIdList = topics?.map((topic) => topic.id);
      const companiesIdList = companies?.map((company) => company.id);

      let take = takeSize;

      if (direction === 'prev') {
        take = -takeSize;
        refRowNum = refRowNum! - 1;
      }

      const parsedDifficulty = difficulty === 'none' ? undefined : [difficulty];
      try {
        const data = await QuestionsAPI.getQuestionsSearch(
          topicsIdList,
          parsedDifficulty,
          companiesIdList,
          refRowNum,
          take,
          debouncedSearch
        );

        setQuestionsData(data);
      } catch (error) {
        handleQuestionsAPIError(
          error as Error,
          'While fetching searched questions'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [takeSize, topics, companies, debouncedSearch, difficulty]
  );

  useEffect(() => {
    fetchQuestions('init');
    setCurrentPage(1);
  }, [takeSize, topics, fetchQuestions]);

  function handleNextPage() {
    if (!questionsData || questionsData.length < takeSize) {
      return;
    }
    const lastQuestionNumber = questionsData[takeSize - 1]?.row_num;
    fetchQuestions('next', Number(lastQuestionNumber));
    setCurrentPage((prev) => prev + 1);
  }

  const handlePreviousPage = useCallback(() => {
    if (!questionsData || questionsData.length === 0) {
      return;
    }
    const firstQuestionNumber = questionsData[0]?.row_num;
    fetchQuestions('prev', Number(firstQuestionNumber));
    setCurrentPage((prev) => prev - 1);
  }, [fetchQuestions, questionsData]);

  const handleTopicsChange = useCallback((selected: string[]) => {
    const selectedTopics = TOPIC_LIST.filter((topic) =>
      selected.includes(topic.readable)
    );
    setTopics(selectedTopics);
  }, []);

  const handleTakeSizeChange = useCallback((size: number) => {
    setTakeSize(size);
  }, []);

  const handleSearchInputChange = useCallback((searchInput: string) => {
    setSearchInput(searchInput);
  }, []);

  const handleDifficultySelectChange = useCallback((difficulty: string) => {
    setDifficulty(difficulty);
  }, []);

  return {
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
  };
}
