
import React from 'react';
import { format } from 'date-fns';
import { ArrowUpDown, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ApiKey, SortOrder } from '@/types/api-keys';

interface ApiKeysTableProps {
  apiKeys: ApiKey[] | undefined;
  apiKeysLoading: boolean;
  nameSort: SortOrder;
  toggleNameSort: () => void;
  openEditDialog: (apiKey: ApiKey) => void;
}

const ApiKeysTable: React.FC<ApiKeysTableProps> = ({
  apiKeys,
  apiKeysLoading,
  nameSort,
  toggleNameSort,
  openEditDialog,
}) => {
  if (apiKeysLoading) {
    return <div className="p-8 text-center">Loading API keys...</div>;
  }

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
            <TableHead>Status</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead>Rotate On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center p-4">
                No API keys found
              </TableCell>
            </TableRow>
          ) : (
            apiKeys?.map((apiKey) => (
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
