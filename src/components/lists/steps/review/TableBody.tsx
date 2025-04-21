
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  return (
    <TableBody>
      {currentPageData.map((row, index) => (
        <TableRow
          key={index}
          className={clsx(
            index % 2 === 0 
              ? (theme === "dark" ? "bg-[#181D29]" : "bg-white")
              : (theme === "dark" ? "bg-[#23293D]" : "bg-gray-50"),
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
              onCheckedChange={val => onSelectRow(index, val === true)}
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
      ))}
    </TableBody>
  );
}
