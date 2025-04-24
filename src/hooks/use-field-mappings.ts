
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FieldMapping {
  label: string;
  field_path: string;
  category: string;
  display_order: number;
}

export function useFieldMappings() {
  return useQuery({
    queryKey: ["fieldMappings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("field_mappings")
        .select("*")
        .eq("active", true)
        .order("display_order");

      if (error) throw error;
      return data as FieldMapping[];
    }
  });
}
