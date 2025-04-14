
import { useState, useEffect } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUp, Edit, Link, File, Upload, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function GetDataStep() {
  const { 
    dataSource, 
    setDataSource, 
    contactData, 
    setContactData, 
    setIsProcessing, 
    fileMetadata,
    setFileMetadata
  } = useListCreation();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  // Initialize state based on existing data when component mounts
  useEffect(() => {
    // If we already have contact data, we should show the file as uploaded
    if ((contactData.length > 0 || fileMetadata) && !isUploaded && !file) {
      setIsUploaded(true);
    }
  }, [contactData, fileMetadata, isUploaded, file]);

  // Update the processing state based on file upload status
  useEffect(() => {
    setIsProcessing(isUploading);
  }, [isUploading, setIsProcessing]);

  // Set default data source to "csv" on component mount
  useEffect(() => {
    if (!dataSource) {
      setDataSource("csv");
    }
  }, [dataSource, setDataSource]);

  const handleSourceSelect = (source: "csv" | "manual" | "api") => {
    setDataSource(source);
    // Reset file upload state when changing sources
    if (source !== "csv") {
      resetFileUpload();
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileSelect(droppedFile);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      toast.error("Please select a CSV file");
      return;
    }

    // Ensure dataSource is set to "csv" when a file is selected
    setDataSource("csv");
    setFile(selectedFile);
    
    // Save file metadata to context
    setFileMetadata({
      name: selectedFile.name,
      size: selectedFile.size
    });
    
    simulateUpload(selectedFile);
  };
  
  const simulateUpload = (selectedFile: File) => {
    setIsUploading(true);
    setIsUploaded(false);
    setUploadProgress(0);
    
    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploaded(true);
          // In a real implementation, we would parse the CSV here
          // and set the contact data in the context
          setContactData([
            { id: 1, email: "example@example.com", firstName: "John", lastName: "Doe" }
            // Real data would come from parsing the CSV
          ]);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const resetFileUpload = () => {
    setFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsUploaded(false);
    setContactData([]);
    setFileMetadata(null);
  };

  const preventDefaultDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Get the file name to display from either the file object or the stored metadata
  const getDisplayFileName = () => {
    if (file) {
      return file.name;
    }
    if (fileMetadata) {
      return fileMetadata.name;
    }
    return "uploaded-file.csv"; // Fallback name only if nothing else is available
  };

  // Get the file size to display
  const getDisplayFileSize = () => {
    if (file) {
      return `${(file.size / 1024).toFixed(1)} KB`;
    }
    if (fileMetadata) {
      return `${(fileMetadata.size / 1024).toFixed(1)} KB`;
    }
    return 'File uploaded'; // Fallback text
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
            {!isUploaded && !isUploading ? (
              <div 
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors hover:bg-accent/50"
                onDrop={handleFileDrop}
                onDragOver={preventDefaultDrag}
                onDragEnter={preventDefaultDrag}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Drag and drop a CSV file here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  The first row should contain column headers
                </p>
                <input 
                  id="file-upload" 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  onChange={handleFileInputChange} 
                />
              </div>
            ) : (
              <div className="space-y-4">
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                {(file || isUploaded) && (
                  <div className="flex items-center justify-between bg-accent/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{getDisplayFileName()}</p>
                        <p className="text-xs text-muted-foreground">
                          {getDisplayFileSize()}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={resetFileUpload}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                
                {isUploaded && !isUploading && (
                  <div>
                    <p className="text-sm text-green-600">File ready for processing</p>
                  </div>
                )}
              </div>
            )}
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
