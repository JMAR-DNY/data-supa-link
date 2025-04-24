
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";

// Available database fields for mapping
const DATABASE_FIELDS = [
  // Contact Information
  { value: "contacts.first_name", label: "First Name" },
  { value: "contacts.last_name", label: "Last Name" },
  { value: "contact_email_addresses.address", label: "Contact Email" },
  { value: "contact_addresses.city", label: "Contact City" },
  { value: "contact_addresses.state", label: "Contact State" },
  { value: "contact_addresses.postal", label: "Contact Zip" },
  { value: "contact_addresses.address_line_1", label: "Contact Address1" },
  { value: "contact_addresses.address_line_2", label: "Contact Address2" },
  { value: "contact_phone_numbers.phone_number", label: "Contact Phone" },
  
  // Business Information
  { value: "companies.name", label: "Business Name" },
  { value: "companies.industry", label: "Business Industry" },
  { value: "companies.keywords", label: "Business Keywords" },
  { value: "companies.founded", label: "Business Founded" },
  { value: "companies.employee_count", label: "Business Headcount" },
  { value: "company_addresses.city", label: "Business City" },
  { value: "company_addresses.state", label: "Business State" },
  { value: "company_addresses.postal", label: "Business Zip" },
  { value: "company_addresses.address_line_1", label: "Business Address1" },
  { value: "company_addresses.address_line_2", label: "Business Address2" },
  { value: "company_phone_numbers.phone_number", label: "Business Phone" },
  { value: "company_email_addresses.address", label: "Business Email" },
  { value: "company_urls.url", label: "Business Website" },
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
