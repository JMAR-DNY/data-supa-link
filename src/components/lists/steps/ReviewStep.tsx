import { useMemo, useState, useEffect } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useTheme } from "@/hooks/use-theme";

const PAGE_SIZE = 10;

export default function ReviewStep() {
  const { fileMetadata, contactData, setIsComplete } = useListCreation();
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

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

  const table = useMaterialReactTable({
    columns,
    data: contactData,
    enableRowSelection: true,
    enableColumnOrdering: false,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enablePagination: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
    enableDensityToggle: true,
    initialState: {
      density: 'compact',
      pagination: { pageSize: PAGE_SIZE, pageIndex: 0 },
      showGlobalFilter: true,
    },
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    positionGlobalFilter: "right",
    muiSearchTextFieldProps: {
      variant: 'outlined',
      placeholder: 'Search contacts',
      size: 'small',
      sx: { 
        width: '300px', 
        marginBlock: '0.5rem',
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        height: '100%',
      },
    },
    enableRowVirtualization: true,
    muiTableContainerProps: {
      sx: {
        maxHeight: 'calc(100% - 120px)',
        height: '100%',
      },
    },
    muiTableHeadProps: {
      sx: {
        position: 'sticky',
        top: 0,
        zIndex: 1,
        "& .MuiTableCell-root": {
          backgroundColor: theme === "dark" ? "#23293D" : "#f3f4f6",
        },
      },
    },
    muiTopToolbarProps: {
      sx: {
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: theme === "dark" ? "#181D29" : "white",
      },
    },
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
        "& .MuiTableRow-root": {
          backgroundColor: theme === "dark" ? "#23293D" : undefined,
          "& .MuiTableCell-root": {
            padding: theme.currentDensity === 'compact' ? '4px 8px' : 
                     theme.currentDensity === 'comfortable' ? '8px 16px' : 
                     '12px 24px',
            height: theme.currentDensity === 'compact' ? 'auto' : 
                    theme.currentDensity === 'comfortable' ? 'auto' : 
                    '4.5rem',
          },
        },
        "& .MuiTableCell-root": {
          color: theme === "dark" ? "white" : undefined,
        },
      },
    },
    muiTableBodyProps: {
      sx: {
        "& .MuiTableRow-root:nth-of-type(odd)": {
          backgroundColor: theme === "dark" ? "#181D29" : undefined,
        },
      },
    },
    muiBottomToolbarProps: {
      sx: {
        position: 'relative',
        bottom: 0,
        zIndex: 2,
        backgroundColor: theme === "dark" ? "#181D29" : "white",
      },
    },
    muiPaginationProps: {
      rowsPerPageOptions: [10, 20, 30, 50],
      showFirstButton: true,
      showLastButton: true,
    },
  });

  if (error && contactData.length === 0) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading && contactData.length === 0) {
    return <div className="text-center py-8">Loading data...</div>;
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
      <div style={{ height: "calc(100vh - 180px)", width: '100%', marginBottom: '1rem' }}>
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
}
