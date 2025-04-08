import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, Pencil, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiProvider {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
  active: boolean;
  created_at: string;
}

const apiProviderSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional().nullable(),
  website: z.string().url().optional().nullable(),
  active: z.boolean().default(true),
});

type ApiProviderFormValues = z.infer<typeof apiProviderSchema>;

export default function ApiProviders() {
  const { toast } = useToast();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState<boolean | null>(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<ApiProvider | null>(null);

  const form = useForm<ApiProviderFormValues>({
    resolver: zodResolver(apiProviderSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
      active: true,
    },
  });

  const {
    data: apiProvidersData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["apiProviders", pageIndex, pageSize, searchQuery, showActiveOnly, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("api_providers")
        .select("*", { count: "exact" });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      if (showActiveOnly !== null) {
        query = query.eq("active", showActiveOnly);
      }

      query = query.order("name", { ascending: sortOrder === "asc" });

      const from = pageIndex * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        providers: data as ApiProvider[],
        totalCount: count || 0,
      };
    },
  });

  const pageCount = Math.ceil((apiProvidersData?.totalCount || 0) / pageSize);

  const handleAddProvider = () => {
    form.reset({
      name: "",
      description: "",
      website: "",
      active: true,
    });
    setCurrentProvider(null);
    setIsDialogOpen(true);
  };

  const handleEditProvider = (provider: ApiProvider) => {
    form.reset({
      id: provider.id,
      name: provider.name,
      description: provider.description || "",
      website: provider.website || "",
      active: provider.active,
    });
    setCurrentProvider(provider);
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: ApiProviderFormValues) => {
    try {
      if (values.id) {
        const { error } = await supabase
          .from("api_providers")
          .update({
            name: values.name,
            description: values.description,
            website: values.website,
            active: values.active,
          })
          .eq("id", values.id);

        if (error) throw error;
        toast({
          title: "Provider updated",
          description: `${values.name} has been updated successfully.`,
        });
      } else {
        const { error } = await supabase
          .from("api_providers")
          .insert({
            name: values.name,
            description: values.description,
            website: values.website,
            active: values.active,
          });

        if (error) throw error;
        toast({
          title: "Provider added",
          description: `${values.name} has been added successfully.`,
        });
      }

      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setShowActiveOnly(value === "all" ? null : value === "active");
    setPageIndex(0);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setPageIndex(0);
  };

  const generatePaginationItems = () => {
    const items = [];
    
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          isActive={pageIndex === 0}
          onClick={() => setPageIndex(0)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    if (pageIndex > 2) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    const startPage = Math.max(1, pageIndex - 1);
    const endPage = Math.min(pageCount - 2, pageIndex + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i < pageCount - 1) {
        items.push(
          <PaginationItem key={i + 1}>
            <PaginationLink
              isActive={pageIndex === i}
              onClick={() => setPageIndex(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    if (pageIndex < pageCount - 3) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    if (pageCount > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            isActive={pageIndex === pageCount - 1}
            onClick={() => setPageIndex(pageCount - 1)}
          >
            {pageCount}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="container p-4 md:p-6">
      <PageHeader title="API Provider Configuration" />
      
      <Card className="mb-6">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search providers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 items-center">              
              <Button onClick={handleAddProvider} className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Add Provider
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[250px] cursor-pointer"
                    onClick={toggleSortOrder}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Name</span>
                      {sortOrder === "asc" ? (
                        <ArrowDownAZ className="h-4 w-4" />
                      ) : (
                        <ArrowUpAZ className="h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Website</TableHead>
                  <TableHead>
                    <Select
                      value={showActiveOnly === null ? "all" : showActiveOnly ? "active" : "inactive"}
                      onValueChange={handleStatusFilterChange}
                    >
                      <SelectTrigger className="h-8 w-[110px] border-none bg-transparent">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">Loading...</TableCell>
                  </TableRow>
                ) : apiProvidersData?.providers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">No API providers found</TableCell>
                  </TableRow>
                ) : (
                  apiProvidersData?.providers.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{provider.description || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {provider.website ? (
                          <a 
                            href={provider.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:underline"
                          >
                            {provider.website}
                          </a>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          provider.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {provider.active ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditProvider(provider)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit {provider.name}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {pageCount > 0 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPageIndex(Math.max(0, pageIndex - 1))}
                      className={pageIndex === 0 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {generatePaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPageIndex(Math.min(pageCount - 1, pageIndex + 1))}
                      className={pageIndex === pageCount - 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentProvider ? "Edit Provider" : "Add New Provider"}</DialogTitle>
            <DialogDescription>
              {currentProvider ? "Update the details for this API provider." : "Enter the details for the new API provider."}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {currentProvider ? "Update" : "Add"} Provider
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
