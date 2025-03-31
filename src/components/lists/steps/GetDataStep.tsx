
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, Edit, Link } from "lucide-react";

export default function GetDataStep() {
  const { dataSource, setDataSource } = useListCreation();

  const handleSourceSelect = (source: "csv" | "manual" | "api") => {
    setDataSource(source);
  };

  return (
    <Tabs 
      defaultValue={dataSource || "csv"} 
      onValueChange={(value) => handleSourceSelect(value as any)}
      className="w-full"
    >
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="csv">CSV Upload</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      
      <TabsContent value="csv">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              CSV Upload
            </CardTitle>
            <CardDescription>
              Upload a CSV file with contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <p className="text-muted-foreground">
                Drag and drop a CSV file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Coming soon - this functionality is under development
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="manual">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Manual Entry
            </CardTitle>
            <CardDescription>
              Manually enter contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-12">
              Manual entry form coming soon - this functionality is under development
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              API Connection
            </CardTitle>
            <CardDescription>
              Connect to an external API to import contacts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-12">
              API connection coming soon - this functionality is under development
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
