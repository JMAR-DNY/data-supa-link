import { useState } from "react";
import { Plus, LayoutGrid, LayoutList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// Mock data for lists - would be replaced with real data from API
interface List {
  id: string;
  name: string;
  description?: string;
  contactCount: number;
  createdAt: Date;
}

export default function Lists() {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  // Mock empty lists state - would be fetched from an API
  const [lists, setLists] = useState<List[]>([]);
  const hasLists = lists.length > 0;

  const handleCreateList = () => {
    // This would open a modal or navigate to create list page
    console.log("Create new list clicked");
  };

  return (
    <div className="container p-6">
      <div className="flex flex-col gap-6">
        {/* Header with toggle */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Lists</h1>
          <div className="flex items-center gap-2">
            <LayoutList className={`h-5 w-5 ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`} />
            <Switch
              checked={viewMode === "card"}
              onCheckedChange={(checked) => setViewMode(checked ? "card" : "list")}
            />
            <LayoutGrid className={`h-5 w-5 ${viewMode === "card" ? "text-primary" : "text-muted-foreground"}`} />
          </div>
        </div>

        {/* System message if no lists */}
        {!hasLists && (
          <Alert>
            <AlertTitle>Welcome to Lists!</AlertTitle>
            <AlertDescription>
              Looks like you don't have any lists — let's create one to get started!
            </AlertDescription>
          </Alert>
        )}

        {/* Lists grid or list view */}
        <div className={viewMode === "card" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          {/* Create new list card - always shown regardless of view mode */}
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

          {/* Existing lists would be mapped here */}
          {lists.map((list) => (
            <Card key={list.id} className="cursor-pointer hover:border-primary transition-colors">
              <CardContent className={viewMode === "card" ? "p-6" : "p-4 flex justify-between items-center"}>
                {viewMode === "card" ? (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{list.name}</h3>
                    {list.description && <p className="text-muted-foreground text-sm">{list.description}</p>}
                    <p className="text-sm">{list.contactCount} contacts</p>
                    <p className="text-xs text-muted-foreground">
                      Created {list.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold">{list.name}</h3>
                      <p className="text-sm text-muted-foreground">{list.contactCount} contacts</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
