import { useEffect, useState } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Papa from "papaparse";

const PAGE_SIZE = 10;

export default function ReviewStep() {
  const { fileMetadata, contactData, setContactData } = useListCreation();
  const [headers, setHeaders] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have parsed data, use it
    if (contactData.length > 0) {
      setHeaders(Object.keys(contactData[0]));
      setTotalPages(Math.ceil(contactData.length / PAGE_SIZE));
      setIsLoading(false);
      return;
    }

    // Otherwise, parse the CSV file if we have metadata (which means file was uploaded)
    if (fileMetadata) {
      setIsLoading(true);
      setError(null);

      // Get the file from local storage (in a real app, this would come from your backend)
      const storedFile = localStorage.getItem('uploadedCsv');
      if (!storedFile) {
        setError("Could not find the uploaded file data");
        setIsLoading(false);
        return;
      }

      Papa.parse(storedFile, {
        header: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError("Error parsing CSV file: " + results.errors[0].message);
            setIsLoading(false);
            return;
          }

          const parsedData = results.data as any[];
          setContactData(parsedData);
          setHeaders(results.meta.fields || []);
          setTotalPages(Math.ceil(parsedData.length / PAGE_SIZE));
          setIsLoading(false);
        },
        error: (error) => {
          setError("Failed to parse CSV file: " + error.message);
          setIsLoading(false);
        }
      });
    }
  }, [fileMetadata, contactData, setContactData]);

  const getCurrentPageData = () => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return contactData.slice(start, start + PAGE_SIZE);
  };

  if (error) {
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
          {isLoading ? (
            <div className="text-center py-8">Loading data...</div>
          ) : (
            <>
              <div className="rounded-md border">
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
                            {row[header]}
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
                    {/* Fixed: Removed the disabled prop and conditionally render based on current page */}
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
                  
                  {/* Show current page and total */}
                  <PaginationItem>
                    <PaginationLink>
                      Page {currentPage} of {totalPages}
                    </PaginationLink>
                  </PaginationItem>

                  <PaginationItem>
                    {/* Fixed: Removed the disabled prop and conditionally render based on current page */}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
