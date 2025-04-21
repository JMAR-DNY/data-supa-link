
import { useMemo, useState, useEffect } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box } from "@mui/material";
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
        marginLeft: 'auto'
      },
    },
    muiTablePaperProps: {
      sx: {
        boxShadow: '0 0 2px rgba(0,0,0,0.1)',
        backgroundColor: theme === "dark" ? "#1A1F2C" : undefined,
      },
    },
    enableRowVirtualization: true,
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
        "& .MuiTableRow-root": {
          backgroundColor: theme === "dark" ? "#23293D" : undefined,
        },
        "& .MuiTableCell-root": {
          color: theme === "dark" ? "#FFFFFF" : undefined,
        },
      },
    },
    muiTableBodyProps: {
      sx: {
        "& .MuiTableRow-root:nth-of-type(odd)": {
          backgroundColor: theme === "dark" ? "#181D29" : undefined,
        },
        "& .MuiTableRow-root:hover": {
          backgroundColor: theme === "dark" ? "#2A3041" : undefined,
        },
      },
    },
    muiTableHeadProps: {
      sx: {
        "& .MuiTableCell-root": {
          backgroundColor: theme === "dark" ? "#23293D" : "#f3f4f6",
          color: theme === "dark" ? "#FFFFFF" : undefined,
          fontWeight: "bold",
        },
      },
    },
    muiTableFooterProps: {
      sx: {
        backgroundColor: theme === "dark" ? "#23293D" : undefined,
      }
    },
    muiPaginationProps: {
      sx: {
        color: theme === "dark" ? "#FFFFFF" : undefined,
      }
    },
    // Style the table's toolbar in dark mode
    muiTopToolbarProps: {
      sx: {
        backgroundColor: theme === "dark" ? "#23293D" : undefined,
        "& .MuiInputBase-root": {
          backgroundColor: theme === "dark" ? "#1A1F2C" : undefined,
          color: theme === "dark" ? "#FFFFFF" : undefined,
        },
        "& .MuiSvgIcon-root": {
          color: theme === "dark" ? "#C8C8C9" : undefined,
        },
        "& .MuiButtonBase-root": {
          color: theme === "dark" ? "#FFFFFF" : undefined,
        },
      },
    },
    muiBottomToolbarProps: {
      sx: {
        backgroundColor: theme === "dark" ? "#23293D" : undefined,
        color: theme === "dark" ? "#FFFFFF" : undefined,
      },
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
    <Box sx={{ height: "calc(100vh - 300px)", width: '100%' }}>
      <MaterialReactTable table={table} />
    </Box>
  );
}
