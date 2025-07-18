import { QuestionPartial } from '@/types/question';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

export default function PaginationSelect({
  currentPage,
  handlePreviousPage,
  handleNextPage,
  questionsData,
  takeSize,
}: {
  currentPage: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  questionsData: QuestionPartial[];
  takeSize: number;
}) {
  return (
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
              onClick={handleNextPage}
              isActive={!questionsData || questionsData.length < takeSize}
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
