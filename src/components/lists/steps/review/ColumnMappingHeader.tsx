
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useFieldMappings } from "@/hooks/use-field-mappings";

interface ColumnMappingHeaderProps {
  headers: string[];
  onMappingChange: (mappings: Record<string, string>) => void;
  theme: "dark" | "light";
}

export function ColumnMappingHeader({ headers, onMappingChange, theme }: ColumnMappingHeaderProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const { data: fieldMappings, isLoading } = useFieldMappings();

  const handleMappingChange = (header: string, value: string) => {
    const newMappings = { ...mappings, [header]: value };
    setMappings(newMappings);
    onMappingChange(newMappings);
  };

  if (isLoading) {
    return (
      <TableRow 
        className={theme === "dark" ? "bg-[#1F2937]" : "bg-gray-50"}
        style={{
          borderBottom: theme === "dark" ? "1px solid #374151" : "1px solid #E5E7EB"
        }}
      >
        {headers.map((header) => (
          <TableCell key={header} className="p-2">
            <div className="h-10 animate-pulse bg-gray-200 rounded"></div>
          </TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <TableRow 
      className={theme === "dark" ? "bg-[#1F2937]" : "bg-gray-50"}
      style={{
        borderBottom: theme === "dark" ? "1px solid #374151" : "1px solid #E5E7EB"
      }}
    >
      {headers.map((header) => (
        <TableCell key={header} className="p-2">
          <Select
            value={mappings[header] || ""}
            onValueChange={(value) => handleMappingChange(header, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Map to field..." />
            </SelectTrigger>
            <SelectContent>
              {fieldMappings?.map((field) => (
                <SelectItem key={field.field_path} value={field.field_path}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
      ))}
    </TableRow>
  );
}
