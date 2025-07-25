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

  const getPageNumber = useCallback(
    async (page: number) => {
      setIsLoading(true);
      const topicsIdList = topics?.map((topic) => topic.id);
      const companiesIdList = companies?.map((company) => company.id);
      const parsedDifficulty = difficulty === 'none' ? undefined : [difficulty];

      const cursor = (page - 1) * takeSize;

      try {
        const data = await QuestionsAPI.getQuestionsSearch(
          topicsIdList,
          parsedDifficulty,
          companiesIdList,
          cursor,
          takeSize,
          debouncedSearch
        );
        setQuestionsData(data);
        setCurrentPage(page);
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

  const handleNavigateToPage = useCallback(
    (page: number) => {
      if (page < 1 || !questionsData) {
        return;
      }
      getPageNumber(page);
    },
    [getPageNumber, questionsData]
  );

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

  useEffect(() => {
    getPageNumber(1);
  }, [getPageNumber]);

  return {
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
  };
}
