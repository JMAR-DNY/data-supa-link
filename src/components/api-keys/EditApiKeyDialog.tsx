
import React from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ApiKey } from '@/types/api-keys';

interface EditApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: ApiKey | null;
  onActivate: (active: boolean) => void;
}

const EditApiKeyDialog: React.FC<EditApiKeyDialogProps> = ({
  isOpen,
  onOpenChange,
  apiKey,
  onActivate
}) => {
  if (!apiKey) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <div className="p-2 border rounded-md bg-gray-50">{apiKey.name}</div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <div className="p-2 border rounded-md bg-gray-50">{apiKey.description || 'No description'}</div>
          </div>
          
          <div className="space-y-2">
            <Label>Provider</Label>
            <div className="p-2 border rounded-md bg-gray-50">{apiKey.api_providers?.name || 'Unknown'}</div>
          </div>
          
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              <span className={`px-2 py-1 rounded-full text-xs ${apiKey.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {apiKey.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Rotate On</Label>
            <div className="p-2 border rounded-md bg-gray-50">
              {apiKey.rotate_on 
                ? format(new Date(apiKey.rotate_on), 'MMMM d, yyyy')
                : 'Not set'}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {apiKey.active ? (
            <Button variant="destructive" onClick={() => onActivate(false)}>
              <X className="mr-2 h-4 w-4" /> Deactivate
            </Button>
          ) : (
            <Button variant="default" onClick={() => onActivate(true)}>
              <Check className="mr-2 h-4 w-4" /> Activate
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditApiKeyDialog;
