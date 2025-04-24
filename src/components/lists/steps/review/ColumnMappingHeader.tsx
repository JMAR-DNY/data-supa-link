
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useFieldMappings } from "@/hooks/use-field-mappings";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useListCreation } from "@/contexts/ListCreationContext";
import { ingestCsvData } from "@/utils/dataIngestion";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface ColumnMappingHeaderProps {
  headers: string[];
  onMappingChange: (mappings: Record<string, string>) => void;
  theme: "dark" | "light";
}

export function ColumnMappingHeader({ headers, onMappingChange, theme }: ColumnMappingHeaderProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isIngesting, setIsIngesting] = useState(false);
  const { data: fieldMappings, isLoading } = useFieldMappings();
  const { toast } = useToast();
  const { user } = useAuth();
  const { contactData, fileMetadata, listData } = useListCreation();

  const handleMappingChange = (header: string, value: string) => {
    const newMappings = { ...mappings };
    
    if (value === "unmap") {
      delete newMappings[header];
    } else {
      newMappings[header] = value;
    }
    
    setMappings(newMappings);
    onMappingChange(newMappings);
  };

  const handleSaveMapping = async () => {
    if (!fileMetadata?.name) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive"
      });
      return;
    }

    // Ensure we have at least one mapping
    if (Object.keys(mappings).length === 0) {
      toast({
        title: "Warning",
        description: "No fields are mapped. Please map at least one field.",
        variant: "destructive"
      });
      return;
    }

    setIsIngesting(true);

    try {
      const result = await ingestCsvData(
        fileMetadata.name,
        contactData,
        mappings,
        listData.team_id || 1, // Default to team 1 if not set
        undefined, // TODO: Get the profile ID from the user context
        undefined  // TODO: Set the list ID if available
      );

      if (result.success) {
        toast({
          title: "Success",
          description: `Imported ${result.rowsProcessed} records from CSV`,
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to import data: ${result.errors?.join(", ")}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("CSV ingestion error:", error);
      toast({
        title: "Error",
        description: "An error occurred during data ingestion",
        variant: "destructive"
      });
    } finally {
      setIsIngesting(false);
    }
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
              <SelectItem value="unmap" className="text-gray-500">
                Clear mapping
              </SelectItem>
              {fieldMappings?.map((field) => (
                <SelectItem key={field.field_path} value={field.field_path}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
      ))}
      <TableCell>
        <Button 
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={handleSaveMapping}
          disabled={isIngesting || Object.keys(mappings).length === 0}
        >
          <Save className="h-4 w-4" />
          <span>{isIngesting ? "Saving..." : "Save"}</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
