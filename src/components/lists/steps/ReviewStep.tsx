
import { useMemo, useState, useEffect } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Button } from "@/components/ui/button";
import { Table } from "lucide-react";
import { MaterialTableView } from "./review/MaterialTableView";
import { ReviewTable } from "./review/ReviewTable";
import { ErrorDisplay } from "./review/ErrorDisplay";
import { LoadingDisplay } from "./review/LoadingDisplay";

export default function ReviewStep() {
  const { fileMetadata, contactData, setIsComplete } = useListCreation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'material' | 'custom'>('material');

  useEffect(() => {
    if (contactData.length > 0) {
      setIsComplete(true);
      setIsLoading(false);
      setError(null);
    } else {
      setIsComplete(false);
      setIsLoading(true);
      setError("No data available to review");
    }
  }, [contactData, setIsComplete]);

  const columns = useMemo(() => {
    if (contactData.length === 0) return [];
    
    const allKeys = new Set<string>();
    contactData.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    return Array.from(allKeys).map((key) => ({
      accessorKey: key,
      header: key,
      id: key,
      size: 150,
    }));
  }, [contactData]);

  if (error && contactData.length === 0) {
    return <ErrorDisplay message={error} />;
  }

  if (isLoading && contactData.length === 0) {
    return <LoadingDisplay />;
  }

  if (contactData.length === 0) {
    return (
      <div className="text-center py-8">
        No data available. Please go back and upload a CSV file.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setViewMode(viewMode === 'material' ? 'custom' : 'material')}
        >
          <Table className="h-4 w-4 mr-2" />
          {viewMode === 'material' ? 'Simple View' : 'Advanced View'}
        </Button>
      </div>
      <div style={{ height: "calc(100vh - 180px)", width: '100%', marginBottom: '1rem' }}>
        {viewMode === 'material' ? (
          <MaterialTableView contactData={contactData} columns={columns} />
        ) : (
          <ReviewTable contactData={contactData} />
        )}
      </div>
    </div>
  );
}
