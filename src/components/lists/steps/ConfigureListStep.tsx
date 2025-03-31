
import { useListCreation } from "@/contexts/ListCreationContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ConfigureListStep() {
  const { listData, updateListData } = useListCreation();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">List Name</Label>
            <Input 
              id="name" 
              placeholder="Enter list name"
              value={listData.name}
              onChange={(e) => updateListData({ name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Enter a description for your list"
              value={listData.description}
              onChange={(e) => updateListData({ description: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
