
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight } from "lucide-react";
import { ContactDataItem } from "@/contexts/ListCreationContext";
import clsx from "clsx";
import { MAX_VISIBLE_COLUMNS } from "./constants";

interface ReviewTableProps {
  headers: string[];
  currentPageData: ContactDataItem[];
  checkedRows: number[];
  onSelectRow: (rowIdx: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  scheme: {
    tableHead: string;
    rowEven: string;
    rowOdd: string;
    cell: string;
  };
}

export function ReviewTable({
  headers,
  currentPageData,
  checkedRows,
  onSelectRow,
  onSelectAll,
  scheme
}: ReviewTableProps) {
  const [showMoreColumns, setShowMoreColumns] = useState(false);
  
  // Function to render visible headers
  const visibleHeaders = showMoreColumns ? headers : headers.slice(0, MAX_VISIBLE_COLUMNS);

  return (
    <TooltipProvider>
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
                  checked={checkedRows.length === currentPageData.length && checkedRows.length > 0}
                  onCheckedChange={val => onSelectAll(val === true)}
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
            {currentPageData.map((row, index) => (
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
                    onCheckedChange={val => onSelectRow(index, val === true)}
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
    </TooltipProvider>
  );
}
