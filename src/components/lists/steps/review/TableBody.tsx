
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import clsx from "clsx";
import { ContactDataItem } from "@/contexts/ListCreationContext";

interface TableBodyProps {
  currentPageData: ContactDataItem[];
  headers: string[];
  theme: "dark" | "light";
}

export function ReviewTableBody({
  currentPageData,
  headers,
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
