import { EmptyState } from "@/components/states/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function DefaultGroupPage() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Group Details</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center h-full">
        <EmptyState
          className="ring-0"
          icon={Users}
          title="Choose a group to get started"
          description="Choose a group from the list to view members, manage permissions, and update settings."
        />
      </CardContent>
    </Card>
  );
}
