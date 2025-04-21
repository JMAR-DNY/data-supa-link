
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import clsx from "clsx";
import { ContactDataItem } from "@/contexts/ListCreationContext";

interface TableBodyProps {
  currentPageData: ContactDataItem[];
  headers: string[];
  checkedRows: number[];
  onSelectRow: (rowIdx: number, checked: boolean) => void;
  theme: "dark" | "light";
}

export function ReviewTableBody({
  currentPageData,
  headers,
  checkedRows,
  onSelectRow,
  theme
}: TableBodyProps) {
  const parentRef = useRef<HTMLTableSectionElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: currentPageData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // estimated row height
    overscan: 5 // number of items to render outside of the viewport
  });

  return (
    <TableBody ref={parentRef} className="max-h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = currentPageData[virtualRow.index];
          return (
            <TableRow
              key={virtualRow.index}
              className={clsx(
                virtualRow.index % 2 === 0 
                  ? (theme === "dark" ? "bg-[#181D29]" : "bg-white")
                  : (theme === "dark" ? "bg-[#23293D]" : "bg-gray-50"),
                "hover:bg-accent transition-colors absolute w-full"
              )}
              style={{
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                borderBottom: theme === "dark"
                  ? "1px solid #23273A"
                  : "1px solid #e5e7eb"
              }}>
              <TableCell
                className={clsx("whitespace-nowrap px-4 py-2 !bg-opacity-100")}
                style={{
                  position: "sticky",
                  left: 0,
                  background: virtualRow.index % 2 === 0
                    ? (theme === "dark" ? "#181D29" : "#fff")
                    : (theme === "dark" ? "#23293D" : "#f9fafb"),
                  zIndex: 25,
                  minWidth: 48,
                  maxWidth: 48,
                  width: 48,
                }}>
                <Checkbox
                  checked={checkedRows.includes(virtualRow.index)}
                  onCheckedChange={val => onSelectRow(virtualRow.index, val === true)}
                  aria-label={`Select row ${virtualRow.index + 1}`}
                  className="border-white data-[state=checked]:bg-[#8B5CF6]"
                />
              </TableCell>
              {headers.map((header) => (
                <TableCell
                  key={`${virtualRow.index}-${header}`}
                  className={clsx("whitespace-nowrap px-4 py-2 truncate")}
                  style={{
                    minWidth: 120,
                    color: theme === "dark" ? "white" : "rgb(17, 24, 39)",
                    background: "inherit",
                    borderRight: theme === "dark"
                      ? "1px solid #23273A"
                      : "1px solid #e5e7eb"
                  }}>
                  {row[header] !== undefined ? String(row[header]) : ''}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </div>
    </TableBody>
  );
}
