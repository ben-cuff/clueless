import PaginationDropdown from './pagination-dropdown';
import PaginationSelect from './pagination-select';

export default function QuestionsPagination({
  currentPage,
  takeSize,
  handleTakeSizeChange,
  numQuestions,
  handleNavigateToPage,
}: {
  currentPage: number;
  takeSize: number;
  handleTakeSizeChange: (size: number) => void;
  numQuestions: number;
  handleNavigateToPage: (page: number) => void;
}) {
  return (
    <div className="flex w-full">
      <PaginationSelect
        currentPage={currentPage}
        takeSize={takeSize}
        numQuestions={numQuestions}
        handleNavigateToPage={handleNavigateToPage}
      />
      <PaginationDropdown
        handleTakeSizeChange={handleTakeSizeChange}
        takeSize={takeSize}
      />
    </div>
  );
}
