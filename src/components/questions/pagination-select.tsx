import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

export default function PaginationSelect({
  currentPage,
  takeSize,
  handleNavigateToPage,
  numQuestions,
}: {
  currentPage: number;
  takeSize: number;
  handleNavigateToPage: (page: number) => void;
  numQuestions: number;
}) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 && (
            <PaginationPrevious
              onClick={() => handleNavigateToPage(currentPage - 1)}
            />
          )}
        </PaginationItem>
        {currentPage > 2 && (
          <>
            <PaginationItem>
              <PaginationLink onClick={() => handleNavigateToPage(1)}>
                1
              </PaginationLink>
            </PaginationItem>
            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handleNavigateToPage(currentPage - 1)}
            >
              {currentPage - 1}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        {currentPage < Math.ceil(numQuestions / takeSize) && (
          <PaginationItem>
            <PaginationLink
              onClick={() => handleNavigateToPage(currentPage + 1)}
            >
              {currentPage + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        {(() => {
          const lastPage = Math.ceil(numQuestions / takeSize);
          if (currentPage < lastPage - 1) {
            return (
              <>
                {currentPage < lastPage - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handleNavigateToPage(lastPage)}
                  >
                    {lastPage}
                  </PaginationLink>
                </PaginationItem>
              </>
            );
          }
          return null;
        })()}
        <PaginationItem>
          {currentPage < Math.ceil(numQuestions / takeSize) && (
            <PaginationNext
              onClick={() => handleNavigateToPage(currentPage + 1)}
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
