
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UseCurrentProfileResult {
  profileId: number | null;
  isLoading: boolean;
  error: Error | null;
}

export function useCurrentProfile(): UseCurrentProfileResult {
  const { user } = useAuth();
  const [profileId, setProfileId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfileId = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_uuid", user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfileId(data?.id || null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileId();
  }, [user?.id]);

  return { profileId, isLoading, error };
}
