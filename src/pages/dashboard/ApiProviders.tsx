
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useApiProviders, ApiProvider } from "@/hooks/use-api-providers";
import { ProvidersTable } from "@/components/api-providers/ProvidersTable";
import { ApiProviderDialog } from "@/components/api-providers/ApiProviderDialog";
import { ProvidersPagination } from "@/components/api-providers/ProvidersPagination";

export default function ApiProviders() {
  const {
    providers,
    isLoading,
    pageIndex,
    setPageIndex,
    pageCount,
    searchQuery,
    setSearchQuery,
    showActiveOnly,
    handleStatusFilterChange,
    sortOrder,
    toggleSortOrder,
    refetch,
    addProvider,
    updateProvider
  } = useApiProviders();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<ApiProvider | null>(null);

  const handleAddProvider = () => {
    setCurrentProvider(null);
    setIsDialogOpen(true);
  };

  const handleEditProvider = (provider: ApiProvider) => {
    setCurrentProvider(provider);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (values: any) => {
    let success;
    
    if (currentProvider) {
      success = await updateProvider(values);
    } else {
      success = await addProvider(values);
    }
    
    if (success) {
      refetch();
    }
    
    return success;
  };

  return (
    <div className="container p-4 md:p-6">
      <PageHeader title="API Provider Configuration" />
      
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search providers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 items-center">              
              <Button onClick={handleAddProvider} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Add Provider
              </Button>
            </div>
          </div>
          
          <ProvidersTable
            providers={providers}
            isLoading={isLoading}
            sortOrder={sortOrder}
            onToggleSortOrder={toggleSortOrder}
            showActiveOnly={showActiveOnly}
            onStatusFilterChange={handleStatusFilterChange}
            onEditProvider={handleEditProvider}
          />
          
          <ProvidersPagination
            pageIndex={pageIndex}
            pageCount={pageCount}
            setPageIndex={setPageIndex}
          />
        </CardContent>
      </Card>
      
      <ApiProviderDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        provider={currentProvider}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
