
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";

// Available database fields for mapping
const DATABASE_FIELDS = [
  { value: "first_name", label: "First Name" },
  { value: "last_name", label: "Last Name" },
  { value: "email", label: "Email Address" },
  { value: "phone", label: "Phone Number" },
  { value: "company", label: "Company" },
  { value: "title", label: "Job Title" },
  { value: "address", label: "Address" },
  { value: "city", label: "City" },
  { value: "state", label: "State" },
  { value: "postal", label: "Postal Code" },
] as const;

interface ColumnMappingHeaderProps {
  headers: string[];
  onMappingChange: (mappings: Record<string, string>) => void;
  theme: "dark" | "light";
}

export function ColumnMappingHeader({ headers, onMappingChange, theme }: ColumnMappingHeaderProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});

  const handleMappingChange = (header: string, value: string) => {
    const newMappings = { ...mappings, [header]: value };
    setMappings(newMappings);
    onMappingChange(newMappings);
  };

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
              {DATABASE_FIELDS.map((field) => (
                <SelectItem key={field.value} value={field.value}>
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
