
import { useState } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { useTheme } from "@/hooks/use-theme";
import { ContactDataItem } from "@/contexts/ListCreationContext";

const PAGE_SIZE = 10;

interface MaterialTableViewProps {
  contactData: ContactDataItem[];
  columns: any[];
}

export function MaterialTableView({ contactData, columns }: MaterialTableViewProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('compact');
  const { theme } = useTheme();

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
      density,
    },
    onDensityChange: setDensity,
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
            padding: density === 'compact' ? '2px 4px' : '8px 16px',
            height: density === 'compact' ? '2rem' : 'auto',
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

  return <MaterialReactTable table={table} />;
}
