
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";

export function ManualEntry() {
  return (
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
  );
}
