import { useEffect, useState } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";
import { useTheme } from "@/hooks/use-theme";

const PAGE_SIZE = 10;
const TABLE_MAX_WIDTH = 800; // px, similar width to CSV upload
const TABLE_MAX_HEIGHT = 350; // px (CSVUpload window constraint)
const CONTAINER_PADDING = 16; // px

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

  // Color schemes for light/dark themes
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Review Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading && contactData.length === 0 ? (
            <div className="text-center py-8">Loading data...</div>
          ) : (
            <>
              {contactData.length > 0 ? (
                <div
                  className={clsx(
                    "rounded-md w-full", // remove mx-auto, add w-full for wide layout
                    scheme.container
                  )}
                  style={{
                    // No maxWidth, let it fill parent
                    // margin: "0 auto", // Remove this line to cancel centered layout
                    paddingLeft: 8, // much smaller padding, adjust as needed for appearance
                    paddingRight: 8,
                  }}
                >
                  {/* Table container with both horizontal and vertical scrolling */}
                  <div
                    style={{
                      maxHeight: TABLE_MAX_HEIGHT,
                      overflowY: "auto",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        overflowX: "auto",
                        width: "100%",
                      }}
                    >
                      <Table>
                        <TableHeader>
                          <TableRow
                            className={clsx(
                              scheme.head,
                              "sticky top-0 z-20 select-none"
                            )}
                            style={{
                              boxShadow: theme === "dark"
                                ? "0 2px 4px #16192390"
                                : "0 2px 4px #d1d5db90",
                            }}
                          >
                            <TableHead
                              style={{
                                background: theme === "dark" ? "#23293D" : "#f3f4f6",
                                left: 0,
                                zIndex: 30,
                                position: "sticky",
                                minWidth: 48,
                                maxWidth: 48,
                                width: 48,
                              }}
                              className={clsx(scheme.head)}
                            >
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
                                style={{
                                  background: theme === "dark" ? "#23293D" : "#f3f4f6",
                                  minWidth: 120,
                                  textAlign: "left",
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 10,
                                  color: theme === "dark" ? "#fff" : "#2d3748",
                                  fontWeight: 600
                                }}
                                className="truncate"
                              >
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
                              }}
                            >
                              <TableCell
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
                                }}
                                className="!bg-opacity-100"
                              >
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
                                  style={{
                                    minWidth: 120,
                                    color: scheme.cell,
                                    background: "inherit",
                                    borderRight: theme === "dark"
                                      ? "1px solid #23273A"
                                      : "1px solid #e5e7eb"
                                  }}
                                  className="truncate"
                                >
                                  {row[header] !== undefined ? String(row[header]) : ''}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground px-2">
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
                </div>
              ) : (
                <div className="text-center py-8">
                  No data available. Please go back and upload a CSV file.
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// This file is getting long. You should consider refactoring it into smaller focused components!
