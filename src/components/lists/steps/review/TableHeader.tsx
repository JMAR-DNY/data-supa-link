
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import clsx from "clsx";

interface TableHeaderProps {
  headers: string[];
  onSelectAll: (checked: boolean) => void;
  hasCheckedRows: boolean;
  hasRows: boolean;
  theme: "dark" | "light";
}

export function ReviewTableHeader({ 
  headers, 
  onSelectAll, 
  hasCheckedRows, 
  hasRows,
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
        <TableHead 
          className={clsx(
            theme === "dark" ? "bg-[#23293D] text-white" : "bg-gray-100 text-gray-800",
            "whitespace-nowrap px-4 py-2 sticky left-0 z-30"
          )}
          style={{
            minWidth: 48,
            maxWidth: 48,
            width: 48
          }}>
          <Checkbox
            checked={hasRows && hasCheckedRows}
            onCheckedChange={val => onSelectAll(val === true)}
            aria-label="Select all rows"
            className="border-white data-[state=checked]:bg-[#8B5CF6]"
          />
        </TableHead>
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
