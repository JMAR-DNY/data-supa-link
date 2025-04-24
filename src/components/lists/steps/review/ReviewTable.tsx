
import { useState, useMemo } from "react";
import { Table } from "@/components/ui/table";
import { useTheme } from "@/hooks/use-theme";
import { useSidebar } from "@/components/ui/sidebar";
import { ContactDataItem } from "@/contexts/ListCreationContext";
import { ReviewTableHeader } from "./TableHeader";
import { ReviewTableBody } from "./TableBody";
import { TablePagination } from "./TablePagination";
import { ColumnMappingHeader } from "./ColumnMappingHeader";
import { toast } from "sonner";

interface ReviewTableProps {
  contactData: ContactDataItem[];
}

export function ReviewTable({ contactData }: ReviewTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const { theme } = useTheme();
  const { state } = useSidebar();

  const headers = useMemo(() => {
    if (contactData.length === 0) return [];
    
    const allKeys = new Set<string>();
    contactData.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys);
  }, [contactData]);

  const totalPages = Math.ceil(contactData.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, contactData.length);
  const currentPageData = contactData.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all rows on current page
      const currentPageIndices = Array.from(
        { length: currentPageData.length },
        (_, i) => startIndex + i
      );
      setCheckedRows(currentPageIndices);
    } else {
      setCheckedRows([]);
    }
  };

  const handleSelectRow = (rowIdx: number, checked: boolean) => {
    if (checked) {
      setCheckedRows((prev) => [...prev, rowIdx]);
    } else {
      setCheckedRows((prev) => prev.filter((idx) => idx !== rowIdx));
    }
  };

  const allCurrentPageRowsChecked =
    currentPageData.length > 0 &&
    currentPageData.every((_, idx) => checkedRows.includes(startIndex + idx));

  const tableContainerClasses = useMemo(() => {
    return `transition-all duration-200 ease-in-out ${
      state === "expanded" ? "w-[75vw]" : "w-[95vw]"
    }`;
  }, [state]);

  const handleMappingChange = (mappings: Record<string, string>) => {
    // Here you'll handle the column mappings
    console.log("Column mappings updated:", mappings);
    toast.success("Column mapping updated");
  };

  if (contactData.length === 0) {
    return null;
  }

  return (
    <div className={tableContainerClasses}>
      <div className="border rounded-md overflow-hidden flex flex-col h-full">
        <div className="overflow-x-auto">
          <Table>
            <ReviewTableHeader 
              headers={headers}
              onSelectAll={handleSelectAll}
              hasCheckedRows={allCurrentPageRowsChecked}
              hasRows={currentPageData.length > 0}
              theme={theme}
            />
            <tbody>
              <ColumnMappingHeader 
                headers={headers}
                onMappingChange={handleMappingChange}
                theme={theme}
              />
            </tbody>
            <ReviewTableBody 
              currentPageData={currentPageData}
              headers={headers}
              checkedRows={checkedRows}
              onSelectRow={(rowIdx, checked) => handleSelectRow(startIndex + rowIdx, checked)}
              theme={theme}
            />
          </Table>
        </div>
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          totalRows={contactData.length}
          currentPageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
}
