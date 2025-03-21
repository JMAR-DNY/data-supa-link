
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type ProfileData = {
  id: number; // Changed from string to number to match database type
  created_at: string | null;
  user_uuid: string;
};

export default function Index() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_uuid', user.id)
          .maybeSingle();
          
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProfile();
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Welcome to Your App</h1>
        
        {loading ? (
          <p className="mt-4 text-muted-foreground">Loading profile data...</p>
        ) : (
          user && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Logged in as: {user.email}</p>
              {profile && (
                <p className="text-sm text-muted-foreground mt-2">
                  User ID: {profile.user_uuid}
                </p>
              )}
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
