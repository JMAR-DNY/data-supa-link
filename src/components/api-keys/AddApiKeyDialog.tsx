
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { ApiProvider, Environment, Function, Module } from '@/types/api-keys';

interface AddApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  modules: Module[] | undefined;
  functions: Function[] | undefined;
  environments: Environment[] | undefined;
  providers: ApiProvider[] | undefined;
  selectedModuleId: number | null;
  setSelectedModuleId: (id: number | null) => void;
  selectedFunctionId: number | null;
  setSelectedFunctionId: (id: number | null) => void;
  selectedEnvironmentId: number | null;
  setSelectedEnvironmentId: (id: number | null) => void;
  selectedProviderId: number | null;
  setSelectedProviderId: (id: number | null) => void;
  apiKeyValue: string;
  setApiKeyValue: (value: string) => void;
  keyDescription: string;
  setKeyDescription: (desc: string) => void;
  generatedName: string;
  handleAddApiKey: () => void;
  resetForm: () => void;
}

const AddApiKeyDialog: React.FC<AddApiKeyDialogProps> = ({
  isOpen,
  onOpenChange,
  modules,
  functions,
  environments,
  providers,
  selectedModuleId,
  setSelectedModuleId,
  selectedFunctionId,
  setSelectedFunctionId,
  selectedEnvironmentId,
  setSelectedEnvironmentId,
  selectedProviderId,
  setSelectedProviderId,
  apiKeyValue,
  setApiKeyValue,
  keyDescription,
  setKeyDescription,
  generatedName,
  handleAddApiKey,
  resetForm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Module, Function, Environment row */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="module" className="text-xs mb-1 block">Module</Label>
              <Select 
                onValueChange={(value) => {
                  setSelectedModuleId(Number(value));
                  setSelectedFunctionId(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Module" />
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
            
            <div>
              <Label htmlFor="function" className="text-xs mb-1 block">Function</Label>
              <Select 
                onValueChange={(value) => setSelectedFunctionId(Number(value))}
                disabled={!selectedModuleId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Function" />
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
            
            <div>
              <Label htmlFor="environment" className="text-xs mb-1 block">Environment</Label>
              <Select onValueChange={(value) => setSelectedEnvironmentId(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Environment" />
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
          </div>
          
          {/* Generated name */}
          <div className="space-y-2">
            <Label htmlFor="name">Generated Name</Label>
            <Input id="name" value={generatedName} disabled className="bg-gray-50" />
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
            onOpenChange(false);
          }}>
            Cancel
          </Button>
          <Button onClick={handleAddApiKey}>Add Key</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddApiKeyDialog;
