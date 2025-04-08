
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface ApiProvider {
  id: number;
  name: string;
  description: string | null;
  website: string | null;
  active: boolean;
  created_at: string;
}

export type ApiProviderFormValues = {
  id?: number;
  name: string;
  description: string | null;
  website: string | null;
  active: boolean;
}

export function useApiProviders() {
  const { toast } = useToast();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState<boolean | null>(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  const handleStatusFilterChange = (value: string) => {
    setShowActiveOnly(value === "all" ? null : value === "active");
    setPageIndex(0);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setPageIndex(0);
  };

  const addProvider = async (values: ApiProviderFormValues) => {
    try {
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
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const updateProvider = async (values: ApiProviderFormValues) => {
    if (!values.id) return false;
    
    try {
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
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const pageCount = Math.ceil((apiProvidersData?.totalCount || 0) / pageSize);

  return {
    providers: apiProvidersData?.providers || [],
    totalCount: apiProvidersData?.totalCount || 0,
    isLoading,
    pageIndex,
    setPageIndex,
    pageSize,
    pageCount,
    searchQuery,
    setSearchQuery,
    showActiveOnly,
    handleStatusFilterChange,
    sortOrder,
    toggleSortOrder,
    refetch,
    addProvider,
    updateProvider
  };
}
