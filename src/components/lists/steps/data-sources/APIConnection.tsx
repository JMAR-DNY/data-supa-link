
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";

export function APIConnection() {
  return (
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
  );
}
