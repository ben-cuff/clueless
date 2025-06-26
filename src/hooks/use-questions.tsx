import { COMPANY_LIST, CompanyInfo } from "@/constants/companies";
import { TOPIC_LIST, TopicInfo } from "@/constants/topics";
import { Question } from "@/types/question";
import { apiQuestions } from "@/utils/questions-api";
import { useCallback, useEffect, useState } from "react";
import useDebounce from "./use-debouncer";

export default function useQuestions() {
  const [questionsData, setQuestionsData] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [takeSize, setTakeSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [topics, setTopics] = useState<TopicInfo[]>();
  const [searchInput, setSearchInput] = useState("");
  const [companies, setCompanies] = useState<CompanyInfo[]>();
  const [difficulty, setDifficulty] = useState("none");

  const debouncedSearch = useDebounce(searchInput, 500) as string;

  const fetchQuestions = useCallback(
    async (
      direction: "next" | "prev" | "init" = "init",
      refQuestionNumber?: number
    ) => {
      setIsLoading(true);
      const topicsIdList = topics?.map((topic) => topic.id);
      const companiesIdList = companies?.map((company) => company.id);

      let take = takeSize;
      let after: number | undefined = undefined;

      if (direction === "next") {
        after = refQuestionNumber;
      } else if (direction === "prev") {
        after = refQuestionNumber;
        take = -takeSize;
      }

      const parsedDifficulty = difficulty === "none" ? undefined : [difficulty];

      const data = await apiQuestions.getQuestions(
        topicsIdList,
        parsedDifficulty,
        companiesIdList,
        after,
        take,
        undefined,
        debouncedSearch
      );

      setQuestionsData(data);
      setIsLoading(false);
    },
    [takeSize, topics, companies, debouncedSearch, difficulty]
  );

  useEffect(() => {
    fetchQuestions("init");
    setCurrentPage(1);
  }, [takeSize, topics, fetchQuestions]);

  function handleNextPage() {
    if (!questionsData || questionsData.length < takeSize) {
      return;
    }
    const lastQuestionNumber = questionsData[takeSize - 1]?.questionNumber;
    fetchQuestions("next", lastQuestionNumber);
    setCurrentPage((prev) => prev + 1);
  }

  const handlePreviousPage = useCallback(() => {
    if (!questionsData || questionsData.length === 0) {
      return;
    }
    const firstQuestionNumber = questionsData[0]?.questionNumber;
    fetchQuestions("prev", firstQuestionNumber);
    setCurrentPage((prev) => prev - 1);
  }, [fetchQuestions, questionsData]);

  const handleTopicsChange = useCallback((selected: string[]) => {
    const selectedTopics = TOPIC_LIST.filter((topic) =>
      selected.includes(topic.readable)
    );
    setTopics(selectedTopics);
  }, []);

  const handleCompaniesChange = useCallback((selected: string[]) => {
    const selectedCompanies = COMPANY_LIST.filter((company) =>
      selected.includes(company.readable)
    );
    setCompanies(selectedCompanies);
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
