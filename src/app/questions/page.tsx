"use client";

import { MultiSelect } from "@/components/questions/multi-select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { COMPANY_LIST, READABLE_COMPANIES } from "@/constants/companies";
import {
  DIFFICULTY_LIST,
  READABLE_DIFFICULTIES,
} from "@/constants/difficulties";
import { READABLE_TOPICS, TOPIC_LIST } from "@/constants/topics";
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
      <h1 className="w-full text-2xl font-bold mb-6">Questions</h1>
      <div className="flex flex-row text-2xl mb-2">
        <Label className="mr-4">Search:</Label>
        <Input
          placeholder="Search for questions..."
          onChange={(e) => handleSearchInputChange(e.target.value)}
        />
        <Select defaultValue="" onValueChange={handleDifficultySelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"none"}>All</SelectItem>
            {DIFFICULTY_LIST.map((difficulty) => (
              <SelectItem key={difficulty.id} value={difficulty.id}>
                {difficulty.readable}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
                  <PaginationLink isActive>{currentPage}</PaginationLink>
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
                    onSelect={() => handleTakeSizeChange(size)}
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
        <div className="flex justify-center text-3xl mt-12">
          No questions found.
        </div>
      )}
    </div>
  );
}
