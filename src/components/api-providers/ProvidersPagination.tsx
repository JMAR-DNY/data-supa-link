
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProvidersPaginationProps {
  pageIndex: number;
  pageCount: number;
  setPageIndex: (pageIndex: number) => void;
}

export function ProvidersPagination({
  pageIndex,
  pageCount,
  setPageIndex
}: ProvidersPaginationProps) {
  if (pageCount <= 1) return null;
  
  const generatePaginationItems = () => {
    const items = [];
    
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          isActive={pageIndex === 0}
          onClick={() => setPageIndex(0)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (pageIndex > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    const startPage = Math.max(1, pageIndex - 1);
    const endPage = Math.min(pageCount - 2, pageIndex + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i < pageCount - 1) {
        items.push(
          <PaginationItem key={i + 1}>
            <PaginationLink
              isActive={pageIndex === i}
              onClick={() => setPageIndex(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    if (pageIndex < pageCount - 3) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    if (pageCount > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            isActive={pageIndex === pageCount - 1}
            onClick={() => setPageIndex(pageCount - 1)}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="mt-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
              className={pageIndex === 0 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {generatePaginationItems()}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setPageIndex(Math.min(pageCount - 1, pageIndex + 1))}
              className={pageIndex === pageCount - 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
