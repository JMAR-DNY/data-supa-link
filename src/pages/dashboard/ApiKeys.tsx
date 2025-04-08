
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PageHeader from '@/components/dashboard/PageHeader';
import { ApiKeysTable, AddApiKeyDialog, ApiKeyDetailsDialog } from '@/components/api-keys';
import { useApiKeys } from '@/hooks/use-api-keys';
import { ApiKey, Function } from '@/types/api-keys';

const ApiKeys = () => {
  // State for API key dialog
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState<ApiKey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedFunctionId, setSelectedFunctionId] = useState<number | null>(null);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<number | null>(null);
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [keyDescription, setKeyDescription] = useState('');
  const [generatedName, setGeneratedName] = useState('');
  
  // Get API Keys data from custom hook
  const {
    apiKeys,
    apiKeysLoading,
    modules,
    environments,
    providers,
    nameSort,
    activeFilter,
    setActiveFilter,
    toggleNameSort,
    refetchApiKeys
  } = useApiKeys();

  // Fetch functions based on selected module
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
  
  return (
    <div className="container p-4 md:p-6">
      <PageHeader title="API Keys" />
      
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search API keys..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 items-center">              
              <Button onClick={() => setIsAddDialogOpen(true)} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Add API Key
              </Button>
            </div>
          </div>
          
          <ApiKeysTable 
            apiKeys={apiKeys}
            apiKeysLoading={apiKeysLoading}
            nameSort={nameSort}
            toggleNameSort={toggleNameSort}
            openEditDialog={openEditDialog}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchQuery={searchQuery}
          />
        </CardContent>
      </Card>
      
      {/* Add API Key Dialog */}
      <AddApiKeyDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        modules={modules}
        functions={functions}
        environments={environments}
        providers={providers}
        selectedModuleId={selectedModuleId}
        setSelectedModuleId={setSelectedModuleId}
        selectedFunctionId={selectedFunctionId}
        setSelectedFunctionId={setSelectedFunctionId}
        selectedEnvironmentId={selectedEnvironmentId}
        setSelectedEnvironmentId={setSelectedEnvironmentId}
        selectedProviderId={selectedProviderId}
        setSelectedProviderId={setSelectedProviderId}
        apiKeyValue={apiKeyValue}
        setApiKeyValue={setApiKeyValue}
        keyDescription={keyDescription}
        setKeyDescription={setKeyDescription}
        generatedName={generatedName}
        handleAddApiKey={handleAddApiKey}
        resetForm={resetForm}
      />
      
      {/* Edit API Key Dialog */}
      <ApiKeyDetailsDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        apiKey={currentApiKey}
        onActivate={handleEditApiKey}
      />
    </div>
  );
};

export default ApiKeys;
