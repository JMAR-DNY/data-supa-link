import { useEffect, useState } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";
import { useTheme } from "@/hooks/use-theme";

const PAGE_SIZE = 10;

export default function ReviewStep() {
  const { fileMetadata, contactData, setIsComplete } = useListCreation();
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const colors = {
    dark: {
      container: "bg-[#181D29] border border-[#23293D]",
      rowEven: "bg-[#181D29]",
      rowOdd: "bg-[#23293D]",
      head: "bg-[#23293D] text-white",
      cell: "text-white"
    },
    light: {
      container: "bg-white border border-gray-200",
      rowEven: "bg-white",
      rowOdd: "bg-gray-50",
      head: "bg-gray-100 text-gray-800",
      cell: "text-gray-900"
    }
  };
  const scheme = theme === "dark" ? colors.dark : colors.light;

  if (error && contactData.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading && contactData.length === 0) {
    return <div className="text-center py-8">Loading data...</div>;
  }

  if (contactData.length === 0) {
    return (
      <div className="text-center py-8">
        No data available. Please go back and upload a CSV file.
      </div>
    );
  }

  return (
    <div className="flex flex-col grow w-full h-full overflow-hidden p-0">
      <div className="w-full h-full overflow-auto">
        <Table className="min-w-max border rounded-lg text-sm">
          <TableHeader>
            <TableRow className={clsx(scheme.head, "sticky top-0 z-20 select-none")}
              style={{
                boxShadow: theme === "dark"
                  ? "0 2px 4px #16192390"
                  : "0 2px 4px #d1d5db90"
              }}>
              <TableHead className={clsx(scheme.head, "whitespace-nowrap px-4 py-2 sticky left-0 z-30")}
                style={{
                  background: theme === "dark" ? "#23293D" : "#f3f4f6",
                  minWidth: 48,
                  maxWidth: 48,
                  width: 48
                }}>
                <Checkbox
                  checked={checkedRows.length === getCurrentPageData().length && checkedRows.length > 0}
                  onCheckedChange={val => handleSelectAll(val === true)}
                  aria-label="Select all rows"
                  className="border-white data-[state=checked]:bg-[#8B5CF6]"
                />
              </TableHead>
              {headers.map((header) => (
                <TableHead
                  key={header}
                  className={clsx("whitespace-nowrap px-4 py-2 truncate")}
                  style={{
                    background: theme === "dark" ? "#23293D" : "#f3f4f6",
                    minWidth: 120,
                    color: theme === "dark" ? "#fff" : "#2d3748",
                    fontWeight: 600
                  }}>
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageData().map((row, index) => (
              <TableRow
                key={index}
                className={clsx(
                  index % 2 === 0 ? scheme.rowEven : scheme.rowOdd,
                  "hover:bg-accent transition-colors"
                )}
                style={{
                  borderBottom: theme === "dark"
                    ? "1px solid #23273A"
                    : "1px solid #e5e7eb"
                }}>
                <TableCell
                  className={clsx("whitespace-nowrap px-4 py-2 !bg-opacity-100")}
                  style={{
                    position: "sticky",
                    left: 0,
                    background: index % 2 === 0
                      ? (theme === "dark" ? "#181D29" : "#fff")
                      : (theme === "dark" ? "#23293D" : "#f9fafb"),
                    zIndex: 25,
                    minWidth: 48,
                    maxWidth: 48,
                    width: 48,
                  }}>
                  <Checkbox
                    checked={checkedRows.includes(index)}
                    onCheckedChange={val => handleSelectRow(index, val === true)}
                    aria-label={`Select row ${index + 1}`}
                    className="border-white data-[state=checked]:bg-[#8B5CF6]"
                  />
                </TableCell>
                {headers.map((header) => (
                  <TableCell
                    key={`${index}-${header}`}
                    className={clsx("whitespace-nowrap px-4 py-2 truncate")}
                    style={{
                      minWidth: 120,
                      color: scheme.cell,
                      background: "inherit",
                      borderRight: theme === "dark"
                        ? "1px solid #23273A"
                        : "1px solid #e5e7eb"
                    }}>
                    {row[header] !== undefined ? String(row[header]) : ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center p-2 border-t bg-background">
        <span className="text-xs text-muted-foreground">
          Showing {getCurrentPageData().length} of {contactData.length} rows
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>
                Page {currentPage} of {totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
