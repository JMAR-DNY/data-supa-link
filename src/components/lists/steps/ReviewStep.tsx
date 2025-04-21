
import { useEffect, useState } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { useTheme } from "@/hooks/use-theme";
import {
  ReviewTable,
  ReviewPagination,
  ErrorState,
  LoadingState,
  NoDataState,
  PAGE_SIZE,
  getColorScheme
} from "./review";

export default function ReviewStep() {
  const { fileMetadata, contactData, setIsComplete } = useListCreation();
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection state for checkboxes:
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (contactData.length > 0) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [contactData, setIsComplete]);

  useEffect(() => {
    if (contactData.length > 0) {
      const allHeaders = new Set<string>();
      contactData.forEach(item => {
        Object.keys(item).forEach(key => allHeaders.add(key));
      });
      setHeaders(Array.from(allHeaders));
      setTotalPages(Math.ceil(contactData.length / PAGE_SIZE));
      setIsLoading(false);
      setError(null);
    } else {
      setIsLoading(true);
      setError("No data available to review");
    }
    setCheckedRows([]); // reset selection on data change/page change
  }, [contactData]);

  function getCurrentPageData() {
    const start = (currentPage - 1) * PAGE_SIZE;
    return contactData.slice(start, start + PAGE_SIZE);
  }

  // Checkbox selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      setCheckedRows([]);
    } else {
      setCheckedRows(getCurrentPageData().map((_, i) => i));
    }
  };

  const handleSelectRow = (rowIdx: number, checked: boolean) => {
    setCheckedRows(prev => {
      if (checked) return Array.from(new Set([...prev, rowIdx]));
      return prev.filter(idx => idx !== rowIdx);
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get color scheme for current theme
  const scheme = getColorScheme(theme);

  if (error && contactData.length === 0) {
    return <ErrorState message={error} />;
  }

  if (isLoading && contactData.length === 0) {
    return <LoadingState />;
  }

  if (contactData.length === 0) {
    return <NoDataState />;
  }

  const currentPageData = getCurrentPageData();

  return (
    <>
      <ReviewTable
        headers={headers}
        currentPageData={currentPageData}
        checkedRows={checkedRows}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        scheme={scheme}
      />
      <ReviewPagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsCount={currentPageData.length}
        totalItemsCount={contactData.length}
        onPageChange={handlePageChange}
      />
    </>
  );
}
