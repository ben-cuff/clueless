import PaginationDropdown from "./pagination-dropdown";
import PaginationSelect from "./pagination-select";

export default function QuestionsPagination({
  currentPage,
  handlePreviousPage,
  handleNextPage,
  questionsData,
  takeSize,
  handleTakeSizeChange,
}: {
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  questionsData: Question[];
  takeSize: number;
  handleTakeSizeChange: (size: number) => void;
}) {
  return (
    <div className="flex w-full ">
      <PaginationSelect
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePreviousPage={handlePreviousPage}
        takeSize={takeSize}
        questionsData={questionsData}
      />
      <PaginationDropdown
        handleTakeSizeChange={handleTakeSizeChange}
        takeSize={takeSize}
      />
    </div>
  );
}

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
