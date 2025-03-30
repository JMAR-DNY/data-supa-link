
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface List {
  id: number;
  name: string;
  description: string | null;
  created_at: string | null;
  team_id: number;
  created_by_profile_id: number | null;
  updated_at: string | null;
}

export const useLists = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["lists"],
    queryFn: async (): Promise<List[]> => {
      if (!user) {
        return [];
      }

      try {
        // Fetch the teams the user is part of
        const { data: membershipData, error: membershipError } = await supabase
          .from("memberships")
          .select("team_id")
          .eq("profile_id", user.id);

        if (membershipError) {
          console.error("Error fetching team memberships:", membershipError);
          throw new Error("Failed to fetch teams");
        }

        if (!membershipData || membershipData.length === 0) {
          return [];
        }

        // Get the team IDs the user belongs to
        const teamIds = membershipData.map(membership => membership.team_id);

        // Fetch lists for the user's teams
        const { data: listsData, error: listsError } = await supabase
          .from("lists")
          .select("*")
          .in("team_id", teamIds);

        if (listsError) {
          console.error("Error fetching lists:", listsError);
          throw new Error("Failed to fetch lists");
        }

        return listsData || [];
      } catch (error) {
        console.error("Error in useLists hook:", error);
        toast.error("Failed to load lists. Please try again.");
        return [];
      }
    },
    enabled: !!user,
  });
};
