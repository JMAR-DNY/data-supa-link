
import { useMemo, useState, useEffect } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { ErrorDisplay } from "./review/ErrorDisplay";
import { LoadingDisplay } from "./review/LoadingDisplay";
import { ReviewTable } from "./review/ReviewTable";

export default function ReviewStep() {
  const { fileMetadata, contactData, setIsComplete } = useListCreation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex flex-col min-h-0 h-full">
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full overflow-x-auto">
          <ReviewTable contactData={contactData} />
        </div>
      </div>
    </div>
  );
}
