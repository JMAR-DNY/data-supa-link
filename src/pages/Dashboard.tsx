
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useLists } from "@/hooks/use-lists";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: lists, isLoading } = useLists();
  
  return (
    <div className="container p-4 md:p-6">
      <PageHeader title="Dashboard" />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-xl font-semibold">Welcome</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Hello, <span className="font-medium">{user?.email}</span>
            </p>
            <p className="text-muted-foreground">
              Access different sections using the sidebar navigation.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h2 className="text-xl font-semibold">Lists Summary</h2>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading lists...</p>
            ) : (
              <p>
                You have <span className="font-medium">{lists?.length || 0}</span> lists available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
