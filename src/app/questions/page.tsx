"use client";

import { MultiSelect } from "@/components/questions/multi-select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  COMPANY_LIST,
  CompanyInfo,
  READABLE_COMPANIES,
} from "@/constants/companies";
import { READABLE_DIFFICULTIES } from "@/constants/difficulties";
import { READABLE_TOPICS, TOPIC_LIST, TopicInfo } from "@/constants/topics";
import { apiQuestions } from "@/utils/questionsAPI";
import { useCallback, useEffect, useState } from "react";

type Question = {
  accuracy: number;
  companies: string[];
  createdAt: string;
  difficulty: number;
  prompt: string;
  questionNumber: number;
  title: string;
  topics: string[];
  updatedAt: string;
};

export default function QuestionsPage() {
  const [questionsData, setQuestionsData] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [takeSize, setTakeSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [topics, setTopics] = useState<TopicInfo[]>();
  const [companies, setCompanies] = useState<CompanyInfo[]>();

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

      const data = await apiQuestions.getQuestions(
        topicsIdList,
        undefined,
        companiesIdList,
        after,
        take
      );
      setQuestionsData(data);
      setIsLoading(false);
    },
    [takeSize, topics, companies]
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

  function handlePreviousPage() {
    if (!questionsData || questionsData.length === 0) {
      return;
    }
    const firstQuestionNumber = questionsData[0]?.questionNumber;
    fetchQuestions("prev", firstQuestionNumber);
    setCurrentPage((prev) => prev - 1);
  }

  function handleTopicsChange(selected: string[]) {
    const selectedTopics = TOPIC_LIST.filter((topic) =>
      selected.includes(topic.readable)
    );
    setTopics(selectedTopics);
  }

  function handleCompaniesChange(selected: string[]) {
    const selectedCompanies = COMPANY_LIST.filter((company) =>
      selected.includes(company.readable)
    );
    setCompanies(selectedCompanies);
  }

  return (
    <div className="w-full mx-auto p-8">
      <h1 className="w-full text-2xl font-bold mb-6">Questions</h1>
      <div className="flex flex-row space-x-2">
        <MultiSelect
          options={COMPANY_LIST.map((company) => company.readable)}
          selected={(companies ?? []).map((company) => company.readable)}
          onChange={handleCompaniesChange}
          placeholder="Select companies"
        />
        <MultiSelect
          options={TOPIC_LIST.map((topic) => topic.readable)}
          selected={(topics ?? []).map((topic) => topic.readable)}
          onChange={handleTopicsChange}
          placeholder="Select topics..."
        />
      </div>
      {isLoading ? (
        <div className="flex flex-col w-full space-y-2">
          {Array.from({ length: 20 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-row items-center w-full px-4 py-2 border rounded shadow space-x-6"
            >
              <Skeleton className="h-7 w-10 rounded" />
              <Skeleton className="h-7 w-48 rounded" />
              <Skeleton className="h-7 w-20 rounded ml-5" />
              <div className="flex flex-wrap gap-2 ml-auto">
                <Skeleton className="h-7 w-16 rounded-full" />
                <Skeleton className="h-7 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
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
          <div className="flex w-full ">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {currentPage !== 1 && (
                    <PaginationPrevious onClick={handlePreviousPage} />
                  )}
                </PaginationItem>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationLink onClick={handlePreviousPage}>
                      {currentPage - 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink isActive>
                    {currentPage}
                  </PaginationLink>
                </PaginationItem>
                {questionsData && questionsData.length === takeSize && (
                  <PaginationItem>
                    <PaginationLink onClick={handleNextPage}>
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  {questionsData && questionsData.length === takeSize && (
                    <PaginationNext
                      href="#"
                      onClick={handleNextPage}
                      isActive={
                        !questionsData || questionsData.length < takeSize
                      }
                    />
                  )}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <DropdownMenu>
              <DropdownMenuTrigger>{takeSize} per page</DropdownMenuTrigger>
              <DropdownMenuContent>
                {[20, 50, 100].map((size) => (
                  <DropdownMenuItem
                    key={size}
                    onSelect={() => setTakeSize(size)}
                    className={takeSize === size ? "font-bold" : ""}
                  >
                    {size}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <div className="flex justify-center text-3xl mt-12">No questions found.</div>
      )}
    </div>
  );
}
