
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, Plus, ArrowUpDown, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Type definitions
type Module = {
  id: number;
  name: string;
  description: string | null;
}

type Function = {
  id: number;
  name: string;
  description: string | null;
  module_id: number | null;
}

type Environment = {
  id: number;
  name: string;
  description: string | null;
}

type ApiProvider = {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
}

type ApiKey = {
  id: number;
  name: string | null;
  description: string | null;
  module_id: number | null;
  function_id: number | null;
  environment_id: number | null;
  api_provider_id: number | null;
  vault_key: string;
  active: boolean;
  created_at: string;
  rotate_on: string | null;
  // Related data
  modules?: Module;
  functions?: Function;
  environments?: Environment;
  api_providers?: ApiProvider;
}

type SortOrder = 'asc' | 'desc';
type ActiveFilter = 'active' | 'inactive' | 'all';

const ApiKeys = () => {
  // State for API key dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState<ApiKey | null>(null);
  
  // Form state
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState<number | null>(null);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<number | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [keyDescription, setKeyDescription] = useState('');
  const [generatedName, setGeneratedName] = useState('');
  
  // Table sorting and filtering
  const [nameSort, setNameSort] = useState<SortOrder>('asc');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('active');
  
  // Fetch data queries
  const { data: apiKeys, isLoading: apiKeysLoading, refetch: refetchApiKeys } = useQuery({
    queryKey: ['apiKeys', nameSort, activeFilter],
    queryFn: async () => {
      let query = supabase
        .from('api_keys')
        .select(`
          *,
          modules (id, name, description),
          functions:function_id (id, name, description),
          environments (id, name, description),
          api_providers (id, name, description, website)
        `)
        .order('name', { ascending: nameSort === 'asc' });
      
      if (activeFilter !== 'all') {
        query = query.eq('active', activeFilter === 'active');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as ApiKey[];
    }
  });
  
  const { data: modules } = useQuery({
    queryKey: ['modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data as Module[];
    }
  });
  
  const { data: environments } = useQuery({
    queryKey: ['environments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('environments')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data as Environment[];
    }
  });
  
  const { data: providers } = useQuery({
    queryKey: ['apiProviders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_providers')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;
      return data as ApiProvider[];
    }
  });
  
  const { data: functions, refetch: refetchFunctions } = useQuery({
    queryKey: ['functions', selectedModuleId],
    queryFn: async () => {
      if (!selectedModuleId) return [];
      
      const { data, error } = await supabase
        .from('functions')
        .select('*')
        .eq('module_id', selectedModuleId)
        .eq('active', true);
      
      if (error) throw error;
      return data as Function[];
    },
    enabled: !!selectedModuleId
  });
  
  // Generate name when selections change
  useEffect(() => {
    if (selectedModuleId && selectedFunctionId && selectedEnvironmentId) {
      const moduleName = modules?.find(m => m.id === selectedModuleId)?.name || '';
      const functionName = functions?.find(f => f.id === selectedFunctionId)?.name || '';
      const envName = environments?.find(e => e.id === selectedEnvironmentId)?.name || '';
      
      if (moduleName && functionName && envName) {
        setGeneratedName(`${moduleName}_${functionName}_${envName}`);
      }
    }
  }, [selectedModuleId, selectedFunctionId, selectedEnvironmentId, modules, functions, environments]);
  
  const handleAddApiKey = async () => {
    try {
      if (!selectedModuleId || !selectedFunctionId || !selectedEnvironmentId || !selectedProviderId || !apiKeyValue) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name: generatedName,
          description: keyDescription,
          module_id: selectedModuleId,
          function_id: selectedFunctionId,
          environment_id: selectedEnvironmentId,
          api_provider_id: selectedProviderId,
          vault_key: apiKeyValue,
          active: true
        })
        .select();
      
      if (error) throw error;
      
      toast.success("API Key added successfully");
      resetForm();
      setIsAddDialogOpen(false);
      refetchApiKeys();
    } catch (error) {
      console.error("Error adding API key:", error);
      toast.error("Failed to add API key");
    }
  };
  
  const handleEditApiKey = async (active: boolean) => {
    if (!currentApiKey) return;
    
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ active })
        .eq('id', currentApiKey.id);
      
      if (error) throw error;
      
      toast.success(`API Key ${active ? 'activated' : 'deactivated'} successfully`);
      setIsEditDialogOpen(false);
      refetchApiKeys();
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("Failed to update API key");
    }
  };
  
  const resetForm = () => {
    setSelectedModuleId(null);
    setSelectedFunctionId(null);
    setSelectedEnvironmentId(null);
    setSelectedProviderId(null);
    setApiKeyValue('');
    setKeyDescription('');
    setGeneratedName('');
    setCurrentApiKey(null);
  };
  
  const openEditDialog = (apiKey: ApiKey) => {
    setCurrentApiKey(apiKey);
    setIsEditDialogOpen(true);
  };
  
  const toggleNameSort = () => {
    setNameSort(nameSort === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className="container p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add API Key
        </Button>
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex items-center p-4 border-b">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {activeFilter === 'active' ? 'Active' : activeFilter === 'inactive' ? 'Inactive' : 'All'} <span className="ml-2">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setActiveFilter('active')}>
                Active {activeFilter === 'active' && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter('inactive')}>
                Inactive {activeFilter === 'inactive' && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter('all')}>
                All {activeFilter === 'all' && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {apiKeysLoading ? (
          <div className="p-8 text-center">Loading API keys...</div>
        ) : (
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
        )}
      </div>
      
      {/* Add API Key Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add API Key</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="module">Module</Label>
              <Select 
                onValueChange={(value) => {
                  setSelectedModuleId(Number(value));
                  setSelectedFunctionId(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a module" />
                </SelectTrigger>
                <SelectContent>
                  {modules?.map((module) => (
                    <SelectItem key={module.id} value={module.id.toString()}>
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="function">Function</Label>
              <Select 
                onValueChange={(value) => setSelectedFunctionId(Number(value))}
                disabled={!selectedModuleId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedModuleId ? "Select a function" : "Select a module first"} />
                </SelectTrigger>
                <SelectContent>
                  {functions?.map((func) => (
                    <SelectItem key={func.id} value={func.id.toString()}>
                      {func.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="environment">Environment</Label>
              <Select onValueChange={(value) => setSelectedEnvironmentId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an environment" />
                </SelectTrigger>
                <SelectContent>
                  {environments?.map((env) => (
                    <SelectItem key={env.id} value={env.id.toString()}>
                      {env.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="provider">API Provider</Label>
              <Select onValueChange={(value) => setSelectedProviderId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers?.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id.toString()}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Generated Name</Label>
              <Input id="name" value={generatedName} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={keyDescription}
                onChange={(e) => setKeyDescription(e.target.value)}
                placeholder="Enter a description for this API key"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input 
                id="apiKey"
                type="password"
                value={apiKeyValue}
                onChange={(e) => setApiKeyValue(e.target.value)}
                placeholder="Enter API key value"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              resetForm();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddApiKey}>Add Key</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Edit API Key Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
          </DialogHeader>
          
          {currentApiKey && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <div className="p-2 border rounded-md bg-gray-50">{currentApiKey.name}</div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="p-2 border rounded-md bg-gray-50">{currentApiKey.description || 'No description'}</div>
              </div>
              
              <div className="space-y-2">
                <Label>Provider</Label>
                <div className="p-2 border rounded-md bg-gray-50">{currentApiKey.api_providers?.name || 'Unknown'}</div>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="p-2 border rounded-md bg-gray-50">
                  <span className={`px-2 py-1 rounded-full text-xs ${currentApiKey.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {currentApiKey.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Rotate On</Label>
                <div className="p-2 border rounded-md bg-gray-50">
                  {currentApiKey.rotate_on 
                    ? format(new Date(currentApiKey.rotate_on), 'MMMM d, yyyy')
                    : 'Not set'}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            {currentApiKey?.active ? (
              <Button variant="destructive" onClick={() => handleEditApiKey(false)}>
                <X className="mr-2 h-4 w-4" /> Deactivate
              </Button>
            ) : (
              <Button variant="default" onClick={() => handleEditApiKey(true)}>
                <Check className="mr-2 h-4 w-4" /> Activate
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeys;
