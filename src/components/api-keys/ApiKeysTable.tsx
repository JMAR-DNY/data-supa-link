
import React from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Edit, Check, ChevronDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApiKey, SortOrder, ActiveFilter } from '@/types/api-keys';

interface ApiKeysTableProps {
  apiKeys: ApiKey[] | undefined;
  apiKeysLoading: boolean;
  nameSort: SortOrder;
  toggleNameSort: () => void;
  openEditDialog: (apiKey: ApiKey) => void;
  activeFilter: ActiveFilter;
  setActiveFilter: (filter: ActiveFilter) => void;
  searchQuery: string;
}

const ApiKeysTable: React.FC<ApiKeysTableProps> = ({
  apiKeys,
  apiKeysLoading,
  nameSort,
  toggleNameSort,
  openEditDialog,
  activeFilter,
  setActiveFilter,
  searchQuery,
}) => {
  if (apiKeysLoading) {
    return <div className="p-8 text-center">Loading API keys...</div>;
  }

  // Filter API keys based on search query
  const filteredApiKeys = searchQuery
    ? apiKeys?.filter(key => 
        key.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        key.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        key.api_providers?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : apiKeys;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={toggleNameSort}>
              <div className="flex items-center">
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 font-medium text-muted-foreground">
                    Status: {activeFilter === 'active' ? 'Active' : activeFilter === 'inactive' ? 'Inactive' : 'All'}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setActiveFilter('active')} className="flex items-center justify-between">
                    Active {activeFilter === 'active' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveFilter('inactive')} className="flex items-center justify-between">
                    Inactive {activeFilter === 'inactive' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveFilter('all')} className="flex items-center justify-between">
                    All {activeFilter === 'all' && <Check className="ml-2 h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableHead>
            <TableHead>Created On</TableHead>
            <TableHead>Rotate On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredApiKeys?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center p-4">
                No API keys found
              </TableCell>
            </TableRow>
          ) : (
            filteredApiKeys?.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell className="font-medium">{apiKey.name}</TableCell>
                <TableCell className="max-w-xs truncate">{apiKey.description}</TableCell>
                <TableCell>
                  {apiKey.api_providers?.website ? (
                    <a 
                      href={apiKey.api_providers.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {apiKey.api_providers?.name}
                    </a>
                  ) : (
                    apiKey.api_providers?.name
                  )}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${apiKey.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {apiKey.active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  {apiKey.created_at ? format(new Date(apiKey.created_at), 'MMM d, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  {apiKey.rotate_on ? format(new Date(apiKey.rotate_on), 'MMM d, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(apiKey)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApiKeysTable;
