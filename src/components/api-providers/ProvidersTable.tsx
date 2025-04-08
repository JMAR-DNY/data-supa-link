
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { ApiProvider } from "@/hooks/use-api-providers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProvidersTableProps {
  providers: ApiProvider[];
  isLoading: boolean;
  sortOrder: "asc" | "desc";
  onToggleSortOrder: () => void;
  showActiveOnly: boolean | null;
  onStatusFilterChange: (value: string) => void;
  onEditProvider: (provider: ApiProvider) => void;
}

export function ProvidersTable({
  providers,
  isLoading,
  sortOrder,
  onToggleSortOrder,
  showActiveOnly,
  onStatusFilterChange,
  onEditProvider
}: ProvidersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[250px] cursor-pointer"
              onClick={onToggleSortOrder}
            >
              <div className="flex items-center space-x-1">
                <span>Name</span>
                {sortOrder === "asc" ? (
                  <ArrowDownAZ className="h-4 w-4" />
                ) : (
                  <ArrowUpAZ className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell">Description</TableHead>
            <TableHead className="hidden md:table-cell">Website</TableHead>
            <TableHead>
              <Select
                value={showActiveOnly === null ? "all" : showActiveOnly ? "active" : "inactive"}
                onValueChange={onStatusFilterChange}
              >
                <SelectTrigger className="h-8 w-[110px] border-none bg-transparent">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">Loading...</TableCell>
            </TableRow>
          ) : providers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">No API providers found</TableCell>
            </TableRow>
          ) : (
            providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell className="hidden md:table-cell">{provider.description || "-"}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {provider.website ? (
                    <a 
                      href={provider.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline"
                    >
                      {provider.website}
                    </a>
                  ) : "-"}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    provider.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {provider.active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEditProvider(provider)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit {provider.name}</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
