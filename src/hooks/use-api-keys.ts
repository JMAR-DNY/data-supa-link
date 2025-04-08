
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ActiveFilter, ApiKey, ApiProvider, Environment, Function, Module, SortOrder } from '@/types/api-keys';

export function useApiKeys() {
  // Table sorting and filtering
  const [nameSort, setNameSort] = useState<SortOrder>('asc');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('active');

  // Fetch API keys with sorting and filtering
  const { data: apiKeys, isLoading: apiKeysLoading, refetch: refetchApiKeys } = useQuery({
    queryKey: ['apiKeys', nameSort, activeFilter],
    queryFn: async () => {
      let query = supabase
        .from('api_keys')
        .select(`
          *,
          modules (id, name, description),
          functions:function_id (id, name, description, module_id),
          environments (id, name, description),
          api_providers (id, name, description, website)
        `)
        .order('name', { ascending: nameSort === 'asc' });
      
      if (activeFilter !== 'all') {
        query = query.eq('active', activeFilter === 'active');
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as unknown as ApiKey[];
    }
  });
  
  // Fetch modules
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
  
  // Fetch environments
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
  
  // Fetch API providers
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
  
  // Functions to get functions for a selected module
  const fetchFunctionsForModule = async (moduleId: number) => {
    if (!moduleId) return [];
    
    const { data, error } = await supabase
      .from('functions')
      .select('*')
      .eq('module_id', moduleId)
      .eq('active', true);
    
    if (error) throw error;
    return data as Function[];
  };

  // Create API key
  const createApiKey = async (
    name: string, 
    description: string, 
    moduleId: number, 
    functionId: number, 
    environmentId: number, 
    providerId: number,
    apiKeyValue: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name,
          description,
          module_id: moduleId,
          function_id: functionId,
          environment_id: environmentId,
          api_provider_id: providerId,
          vault_key: apiKeyValue,
          active: true
        })
        .select();
      
      if (error) throw error;
      
      toast.success("API Key added successfully");
      return true;
    } catch (error) {
      console.error("Error adding API key:", error);
      toast.error("Failed to add API key");
      return false;
    }
  };

  // Update API key active status
  const updateApiKeyStatus = async (keyId: number, active: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ active })
        .eq('id', keyId);
      
      if (error) throw error;
      
      toast.success(`API Key ${active ? 'activated' : 'deactivated'} successfully`);
      return true;
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("Failed to update API key");
      return false;
    }
  };

  const toggleNameSort = () => {
    setNameSort(nameSort === 'asc' ? 'desc' : 'asc');
  };

  return {
    apiKeys,
    apiKeysLoading,
    modules,
    environments,
    providers,
    fetchFunctionsForModule,
    createApiKey,
    updateApiKeyStatus,
    refetchApiKeys,
    nameSort,
    activeFilter,
    setActiveFilter,
    toggleNameSort
  };
}
