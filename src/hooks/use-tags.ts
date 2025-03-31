
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Tag = {
  id: number;
  name: string;
  color?: string;
  team_id: number;
  created_at: string;
  created_by_profile_id?: number;
  active: boolean;
};

export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .eq("active", true)
        .order("name", { ascending: true });

      if (error) {
        throw new Error(`Error fetching tags: ${error.message}`);
      }

      return data as Tag[];
    },
  });
};
