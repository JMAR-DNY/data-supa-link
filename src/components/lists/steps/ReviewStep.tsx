
import { useEffect, useState } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FileText, AlertCircle, ChevronRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import clsx from "clsx";
import { useTheme } from "@/hooks/use-theme";

const PAGE_SIZE = 10;
const MAX_VISIBLE_COLUMNS = 12;

export default function ReviewStep() {
  const { fileMetadata, contactData, setIsComplete } = useListCreation();
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMoreColumns, setShowMoreColumns] = useState(false);

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

  // Color schemes for light/dark themes
  const colors = {
    dark: {
      container: "bg-[#181D29] border border-[#23293D]",
      tableHead: "bg-[#23293D] text-white",
      rowEven: "bg-[#181D29]",
      rowOdd: "bg-[#23293D]",
      cell: "text-white"
    },
    light: {
      container: "bg-white border border-gray-200",
      tableHead: "bg-gray-100 text-gray-800",
      rowEven: "bg-white",
      rowOdd: "bg-gray-50",
      cell: "text-gray-900"
    }
  };
  const scheme = theme === "dark" ? colors.dark : colors.light;

  // Function to render visible headers
  const visibleHeaders = showMoreColumns ? headers : headers.slice(0, MAX_VISIBLE_COLUMNS);

  if (error && contactData.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <TooltipProvider>
      {isLoading && contactData.length === 0 ? (
        <div className="text-center py-8">Loading data...</div>
      ) : (
        <>
          {contactData.length > 0 ? (
            <>
              <div className="max-h-[70vh] w-full overflow-x-auto overflow-y-auto rounded-lg border">
                <Table className="table-fixed min-w-full">
                  <TableHeader>
                    <TableRow className={clsx(
                      scheme.tableHead,
                      "sticky top-0 z-10"
                    )}>
                      <TableHead
                        className={clsx(
                          "sticky left-0 z-20 whitespace-nowrap",
                          scheme.tableHead
                        )}
                        style={{
                          minWidth: "50px",
                          width: "50px",
                        }}
                      >
                        <Checkbox
                          checked={checkedRows.length === getCurrentPageData().length && checkedRows.length > 0}
                          onCheckedChange={val => handleSelectAll(val === true)}
                          aria-label="Select all rows"
                          className="border-white data-[state=checked]:bg-[#8B5CF6]"
                        />
                      </TableHead>
                      {visibleHeaders.map((header) => (
                        <TableHead
                          key={header}
                          className={clsx(
                            "py-4 px-6",
                            scheme.tableHead
                          )}
                          style={{
                            minWidth: "180px",
                            maxWidth: "300px",
                          }}
                        >
                          <div className="break-words">{header}</div>
                        </TableHead>
                      ))}
                      {headers.length > MAX_VISIBLE_COLUMNS && !showMoreColumns && (
                        <TableHead
                          className={clsx("text-center", scheme.tableHead)}
                          style={{
                            minWidth: "50px",
                            width: "50px",
                          }}
                          onClick={() => setShowMoreColumns(true)}
                        >
                          <span className="flex items-center justify-center cursor-pointer text-primary hover:text-primary/80 transition-colors">
                            <ChevronRight className="h-5 w-5" />
                          </span>
                        </TableHead>
                      )}
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
                      >
                        <TableCell
                          className={clsx(
                            "sticky left-0 z-10 whitespace-nowrap",
                            index % 2 === 0 ? scheme.rowEven : scheme.rowOdd
                          )}
                          style={{
                            minWidth: "50px",
                            width: "50px",
                          }}
                        >
                          <Checkbox
                            checked={checkedRows.includes(index)}
                            onCheckedChange={val => handleSelectRow(index, val === true)}
                            aria-label={`Select row ${index + 1}`}
                            className="border-white data-[state=checked]:bg-[#8B5CF6]"
                          />
                        </TableCell>
                        {visibleHeaders.map((header) => {
                          const cellContent = row[header] !== undefined ? String(row[header]) : '';
                          return (
                            <Tooltip key={`${index}-${header}`}>
                              <TooltipTrigger asChild>
                                <TableCell
                                  className={clsx(
                                    "text-ellipsis overflow-hidden py-4 px-6",
                                    scheme.cell
                                  )}
                                  style={{
                                    minWidth: "180px",
                                    maxWidth: "300px",
                                  }}
                                >
                                  <div className="truncate">{cellContent}</div>
                                </TableCell>
                              </TooltipTrigger>
                              {cellContent && (
                                <TooltipContent>
                                  <p>{cellContent}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          );
                        })}
                        {headers.length > MAX_VISIBLE_COLUMNS && !showMoreColumns && (
                          <TableCell className="text-center">...</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground px-2">
                <span>
                  Showing {getCurrentPageData().length} of {contactData.length} rows
                </span>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {currentPage > 1 ? (
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        />
                      ) : (
                        <PaginationPrevious
                          onClick={() => { }}
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
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        />
                      ) : (
                        <PaginationNext
                          onClick={() => { }}
                          className="pointer-events-none opacity-50"
                        />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              No data available. Please go back and upload a CSV file.
            </div>
          )}
        </>
      )}
    </TooltipProvider>
  );
}
