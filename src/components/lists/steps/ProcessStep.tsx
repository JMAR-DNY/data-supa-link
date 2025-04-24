
import { useEffect } from "react";
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertTriangle } from "lucide-react";

export default function ProcessStep() {
  const { 
    listData, 
    dataSource, 
    isProcessing, 
    setIsProcessing, 
    isComplete, 
    setIsComplete 
  } = useListCreation();

  useEffect(() => {
    if (!isProcessing && !isComplete) {
      // Start the "processing" simulation
      setIsProcessing(true);
      
      // Simulate processing completion after 3 seconds
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing, isComplete, setIsProcessing, setIsComplete]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isProcessing ? (
            <>
              <div className="space-y-2">
                <p>Creating list "{listData.name}"...</p>
                <Progress value={60} />
              </div>
              <p className="text-sm text-muted-foreground">
                We're setting up your list with the data source: {dataSource}.
                This may take a moment.
              </p>
            </>
          ) : isComplete ? (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-medium">List Created Successfully!</h3>
                <p className="text-muted-foreground mt-2">
                  Your list "{listData.name}" has been created and is ready to use.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="flex justify-center">
                <AlertTriangle className="h-16 w-16 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Action Required</h3>
                <p className="text-muted-foreground mt-2">
                  Please go back to the previous step and map your CSV columns to database fields.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
