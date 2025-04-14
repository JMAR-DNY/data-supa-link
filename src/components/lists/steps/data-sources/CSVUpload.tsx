import { useState, useEffect } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, FileUp, Upload, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Papa from 'papaparse';

export function CSVUpload() {
  const { setDataSource, setContactData, setIsProcessing, fileMetadata, setFileMetadata } = useListCreation();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if ((fileMetadata) && !isUploaded && !file) {
      setIsUploaded(true);
    }
  }, [fileMetadata, isUploaded, file]);

  useEffect(() => {
    setIsProcessing(isUploading);
  }, [isUploading, setIsProcessing]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive"
      });
      return;
    }

    setFile(selectedFile);
    setDataSource("csv");
    setFileMetadata({
      name: selectedFile.name,
      size: selectedFile.size
    });

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "Error parsing CSV",
            description: results.errors[0].message,
            variant: "destructive"
          });
          return;
        }
        
        setContactData(results.data);
        simulateUpload(selectedFile);
      },
      error: (error) => {
        toast({
          title: "Error reading file",
          description: error.message,
          variant: "destructive"
        });
      }
    });
  };

  const simulateUpload = (selectedFile: File) => {
    setIsUploading(true);
    setIsUploaded(false);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploaded(true);
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

  const getDisplayFileName = () => fileMetadata?.name || file?.name;
  const getDisplayFileSize = () => {
    const size = fileMetadata?.size || file?.size;
    return size ? `${(size / 1024).toFixed(1)} KB` : 'File uploaded';
  };

  return (
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
  );
}
