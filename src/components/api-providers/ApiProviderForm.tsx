
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApiProviderFormValues } from "@/hooks/use-api-providers";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

const apiProviderSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  active: z.boolean().default(true),
});

interface ApiProviderFormProps {
  initialData?: ApiProviderFormValues;
  onSubmit: (values: ApiProviderFormValues) => Promise<boolean>;
  onCancel: () => void;
}

export function ApiProviderForm({
  initialData,
  onSubmit,
  onCancel
}: ApiProviderFormProps) {
  const form = useForm<ApiProviderFormValues>({
    resolver: zodResolver(apiProviderSchema),
    defaultValues: {
      id: initialData?.id,
      name: initialData?.name || "",
      description: initialData?.description || "",
      website: initialData?.website || "",
      active: initialData?.active !== undefined ? initialData.active : true,
    },
  });

  const handleSubmit = async (values: ApiProviderFormValues) => {
    const success = await onSubmit(values);
    if (success) {
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Provider name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Provider description" {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} value={field.value || ""} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Active</FormLabel>
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {initialData?.id ? "Update" : "Add"} Provider
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
