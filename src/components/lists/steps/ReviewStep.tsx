
import { useEffect, useState } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PAGE_SIZE = 10;

export default function ReviewStep() {
  const { fileMetadata, contactData, setIsComplete } = useListCreation();
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mark this step as complete if we have data
    if (contactData.length > 0) {
      setIsComplete(true);
    } else {
      setIsComplete(false);
    }
  }, [contactData, setIsComplete]);

  useEffect(() => {
    // If we have data, extract headers and calculate pages
    if (contactData.length > 0) {
      // Get all unique headers from all rows in case they're inconsistent
      const allHeaders = new Set<string>();
      contactData.forEach(item => {
        Object.keys(item).forEach(key => allHeaders.add(key));
      });
      
      setHeaders(Array.from(allHeaders));
      setTotalPages(Math.ceil(contactData.length / PAGE_SIZE));
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setError("No data available to review");
    }
  }, [contactData]);

  const getCurrentPageData = () => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return contactData.slice(start, start + PAGE_SIZE);
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
                <>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {headers.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getCurrentPageData().map((row, index) => (
                          <TableRow key={index}>
                            {headers.map((header) => (
                              <TableCell key={`${index}-${header}`}>
                                {row[header] !== undefined ? String(row[header]) : ''}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        {currentPage > 1 ? (
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
                </>
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
