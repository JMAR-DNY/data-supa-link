
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

  const handleMappingChange = (mappings: Record<string, string>) => {
    console.log("Column mappings updated:", mappings);
    toast.success("Column mapping updated");
  };

  const tableContainerClasses = useMemo(() => {
    return `transition-all duration-200 ease-in-out ${
      state === "expanded" ? "w-[75vw]" : "w-[95vw]"
    }`;
  }, [state]);

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
