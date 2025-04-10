
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutGrid, LayoutList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLists, List } from "@/hooks/use-lists";
import { useContactCount } from "@/hooks/use-contact-count";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/PageHeader";

export default function Lists() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const { data: lists = [], isLoading, error } = useLists();
  const hasLists = lists.length > 0;
  const navigate = useNavigate();

  const handleCreateList = () => {
    navigate("/dashboard/lists/new");
  };

  if (error) {
    toast.error("Failed to load lists. Please try again.");
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const ListItem = ({ list }: { list: List }) => {
    const { data: contactCount = 0 } = useContactCount(list.id);

    return (
      <Card key={list.id} className="cursor-pointer hover:border-primary transition-colors">
        <CardContent className={viewMode === "card" ? "p-6" : "p-4 flex justify-between items-center"}>
          {viewMode === "card" ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{list.name}</h3>
              {list.description && <p className="text-muted-foreground text-sm">{list.description}</p>}
              <p className="text-sm">{contactCount} contacts</p>
              <p className="text-xs text-muted-foreground">
                Created {formatDate(list.created_at)}
              </p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="font-semibold">{list.name}</h3>
                <p className="text-sm text-muted-foreground">{contactCount} contacts</p>
              </div>
              <Button variant="ghost" size="sm">
                View
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const ListSkeleton = () => (
    <Card>
      <CardContent className={viewMode === "card" ? "p-6" : "p-4"}>
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container p-6">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <PageHeader title="Lists" />
          </div>
          <div className="flex items-center gap-2">
            <LayoutList className={`h-5 w-5 ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`} />
            <Switch
              checked={viewMode === "card"}
              onCheckedChange={(checked) => setViewMode(checked ? "card" : "list")}
            />
            <LayoutGrid className={`h-5 w-5 ${viewMode === "card" ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        </div>

        {!isLoading && !hasLists && (
          <Alert>
            <AlertTitle>Welcome to Lists!</AlertTitle>
            <AlertDescription>
              Looks like you don't have any lists — let's create one to get started!
            </AlertDescription>
          </Alert>
        )}

        <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          <Card 
            className={`border-dashed cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors ${
              viewMode === "card" 
                ? "flex flex-col justify-center items-center p-6 h-[200px]" 
                : "flex items-center p-4"
            }`}
            onClick={handleCreateList}
          >
            <CardContent className={`p-0 flex ${viewMode === "card" ? "flex-col" : "flex-row"} items-center gap-2`}>
              <div className="flex justify-center items-center rounded-full bg-primary/10 p-3">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <span className="font-medium text-lg">Create New List</span>
            </CardContent>
          </Card>

          {isLoading && 
            Array(3).fill(0).map((_, index) => <ListSkeleton key={index} />)
          }

          {!isLoading && 
            lists.map((list) => <ListItem key={list.id} list={list} />)
          }
        </div>
      </div>
    </div>
  );
}
