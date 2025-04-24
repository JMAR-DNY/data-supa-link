
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useFieldMappings } from "@/hooks/use-field-mappings";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ColumnMappingHeaderProps {
  headers: string[];
  onMappingChange: (mappings: Record<string, string>) => void;
  theme: "dark" | "light";
}

export function ColumnMappingHeader({ headers, onMappingChange, theme }: ColumnMappingHeaderProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isIngesting, setIsIngesting] = useState(false);
  const { data: fieldMappings, isLoading } = useFieldMappings();
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const { contactData, fileMetadata, listData, setIsComplete } = useListCreation();

  const handleMappingChange = (header: string, value: string) => {
    const newMappings = { ...mappings };
    
    if (value === "unmap") {
      delete newMappings[header];
    } else {
      newMappings[header] = value;
    }
    
    setMappings(newMappings);
    onMappingChange(newMappings);
    
    // Enable completion when at least one field is mapped
    setIsComplete(Object.keys(newMappings).length > 0);
  };

  const handleSaveMapping = async () => {
    if (!fileMetadata?.name) {
      uiToast({
        title: "Error",
        description: "No file selected",
        variant: "destructive"
      });
      return;
    }

    if (Object.keys(mappings).length === 0) {
      uiToast({
        title: "Warning",
        description: "No fields are mapped. Please map at least one field.",
        variant: "destructive"
      });
      return;
    }

    setIsIngesting(true);

    try {
      const { data: { user: { id: userId } } } = await supabase.auth.getUser();
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_uuid', userId)
        .single();

      if (profileError) throw profileError;

      const { data, error } = await supabase.functions.invoke('process-csv', {
        body: {
          fileName: fileMetadata.name,
          data: contactData,
          mappings,
          teamId: listData.team_id || 1,
          profileId: profileData?.id,
          listId: undefined // TODO: Get list ID if available
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Successfully processed ${data.rowsProcessed} records from CSV`);
        setIsComplete(true);
      } else {
        throw new Error(data.error || 'Failed to process CSV data');
      }
    } catch (error) {
      console.error('CSV ingestion error:', error);
      uiToast({
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
          <span>{isIngesting ? "Processing..." : "Process Data"}</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}
