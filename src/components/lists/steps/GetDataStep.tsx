
import { useEffect } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSVUpload } from "./data-sources/CSVUpload";
import { ManualEntry } from "./data-sources/ManualEntry";
import { APIConnection } from "./data-sources/APIConnection";

export default function GetDataStep() {
  const { dataSource, setDataSource } = useListCreation();

  useEffect(() => {
    if (!dataSource) {
      setDataSource("csv");
    }
  }, [dataSource, setDataSource]);

  return (
    <Tabs 
      defaultValue={dataSource || "csv"} 
      onValueChange={(value) => setDataSource(value as "csv" | "manual" | "api")}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="csv">CSV Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      
      <TabsContent value="csv">
        <CSVUpload />
      </TabsContent>
      
      <TabsContent value="manual">
        <ManualEntry />
      </TabsContent>
      
      <TabsContent value="api">
        <APIConnection />
      </TabsContent>
    </Tabs>
  );
}
