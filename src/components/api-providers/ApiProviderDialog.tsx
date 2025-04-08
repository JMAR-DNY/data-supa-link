
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiProviderForm } from "./ApiProviderForm";
import { ApiProvider, ApiProviderFormValues } from "@/hooks/use-api-providers";

interface ApiProviderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  provider: ApiProvider | null;
  onSubmit: (values: ApiProviderFormValues) => Promise<boolean>;
}

export function ApiProviderDialog({
  isOpen,
  onOpenChange,
  provider,
  onSubmit
}: ApiProviderDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{provider ? "Edit Provider" : "Add New Provider"}</DialogTitle>
          <DialogDescription>
            {provider ? "Update the details for this API provider." : "Enter the details for the new API provider."}
          </DialogDescription>
        </DialogHeader>
        
        <ApiProviderForm
          initialData={provider || undefined}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
