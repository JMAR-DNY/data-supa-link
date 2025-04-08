
// Type definitions for API keys and related entities
export type Module = {
  id: number;
  name: string;
  description: string | null;
}

export type Function = {
  id: number;
  name: string;
  description: string | null;
  module_id: number | null;
}

export type Environment = {
  id: number;
  name: string;
  description: string | null;
}

export type ApiProvider = {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
}

export type ApiKey = {
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

export type SortOrder = 'asc' | 'desc';
export type ActiveFilter = 'active' | 'inactive' | 'all';
