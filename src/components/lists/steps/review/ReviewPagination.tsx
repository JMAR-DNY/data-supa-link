
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface ReviewPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsCount: number;
  totalItemsCount: number;
  onPageChange: (page: number) => void;
}

export function ReviewPagination({
  currentPage,
  totalPages,
  itemsCount,
  totalItemsCount,
  onPageChange
}: ReviewPaginationProps) {
  return (
    <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground px-2">
      <span>
        Showing {itemsCount} of {totalItemsCount} rows
      </span>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              />
            ) : (
              <PaginationPrevious
                onClick={() => {}}
                className="pointer-events-none opacity-50"
              />
            )}
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>
              Page {currentPage} of {totalPages}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              />
            ) : (
              <PaginationNext
                onClick={() => {}}
                className="pointer-events-none opacity-50"
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
