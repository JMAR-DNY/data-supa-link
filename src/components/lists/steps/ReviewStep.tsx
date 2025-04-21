
import { useEffect, useState } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";

const PAGE_SIZE = 10;
const TABLE_MAX_WIDTH = 780; // px
const TABLE_MAX_HEIGHT = 350; // px (matching CSVUpload window)

export default function ReviewStep() {
  const { fileMetadata, contactData, setIsComplete } = useListCreation();
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selection state for checkboxes:
  const [checkedRows, setCheckedRows] = useState<number[]>([]);
  const allRowIndexes = getCurrentPageData().map((_, idx) => idx);

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
                  className="rounded-md border bg-[#181D29] px-1 py-0"
                  style={{
                    maxWidth: TABLE_MAX_WIDTH,
                    margin: "0 auto",
                  }}
                >
                  <ScrollArea
                    className="w-full"
                    style={{
                      maxHeight: TABLE_MAX_HEIGHT,
                      background: "#181D29",
                      borderRadius: "0.5rem"
                    }}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow
                          className="bg-[#23293D] sticky top-0 z-20 text-white select-none"
                          style={{ boxShadow: "0 2px 4px #16192390" }}
                        >
                          <TableHead
                            style={{
                              background: "#23293D",
                              left: 0,
                              zIndex: 30,
                              position: "sticky",
                              minWidth: 48,
                              maxWidth: 48,
                              width: 48,
                            }}
                            className="!bg-[#23293D]"
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
                                background: "#23293D",
                                color: "#fff",
                                fontWeight: 600,
                                minWidth: 120,
                                textAlign: "left",
                                position: "sticky",
                                zIndex: 10,
                                left: undefined, // Non-sticky except checkbox
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
                              "text-white",
                              index % 2 === 0 ? "bg-[#181D29]" : "bg-[#23293D]",
                              "hover:bg-[#262C44] transition-colors"
                            )}
                            style={{
                              borderBottom: "1px solid #23273A"
                            }}
                          >
                            <TableCell
                              style={{
                                position: "sticky",
                                left: 0,
                                background: index % 2 === 0 ? "#181D29" : "#23293D",
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
                                  color: "#fff",
                                  background: "inherit",
                                  borderRight: "1px solid #23273A"
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
                  </ScrollArea>
                  <div className="flex justify-between items-center pt-2 text-xs text-white/80 px-2">
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
