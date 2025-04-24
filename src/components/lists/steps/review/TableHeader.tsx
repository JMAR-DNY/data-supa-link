
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import clsx from "clsx";

interface TableHeaderProps {
  headers: string[];
  theme: "dark" | "light";
}

export function ReviewTableHeader({ 
  headers, 
  theme 
}: TableHeaderProps) {
  return (
    <TableHeader>
      <TableRow 
        className={clsx(
          theme === "dark" ? "bg-[#23293D]" : "bg-gray-100",
          "text-white sticky top-0 z-20 select-none"
        )}
        style={{
          boxShadow: theme === "dark"
            ? "0 2px 4px #16192390"
            : "0 2px 4px #d1d5db90"
        }}>
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
  );
}
