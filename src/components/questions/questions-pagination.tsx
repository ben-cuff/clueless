import { QuestionPartial } from '@/types/question';
import PaginationDropdown from './pagination-dropdown';
import PaginationSelect from './pagination-select';

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
  questionsData: QuestionPartial[];
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
