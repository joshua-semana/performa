"use client";

import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { colorMap } from "@/lib/constants/color";
import { groupMap } from "@/lib/constants/group";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { GroupAction } from "./group-action";

interface GroupPreviewProps {
  id: string;
}

export default function GroupPreview({ id }: GroupPreviewProps) {
  const groupDetails = useQuery(api.groups.getGroupByID, { id: id });
  const router = useRouter();

  if (groupDetails === undefined) {
    return <LoadingState />;
  } else if (groupDetails === null) {
    return (
      <ErrorState
        className="w-full"
        description="We couldn't load the requested information. It may no longer be available or the link may be invalid."
        showRetry
        onRetry={() => router.refresh()}
      />
    );
  } else {
    const group = groupMap[groupDetails.type];
    const Icon = group.icon;
    return (
      <Card className="h-full">
        <CardHeader className="flex gap-3 items-center">
          <div
            className={cn(
              "p-3 rounded-md w-fit",
              colorMap[groupDetails.color].badge,
            )}
          >
            <Icon className="size-5 shrink-0" />
          </div>
          <div className="flex flex-col">
            <CardTitle>{groupDetails.name}</CardTitle>
            <CardDescription>{groupDetails.description}</CardDescription>
          </div>
          <GroupAction id={id} />
        </CardHeader>
        <Separator />
        <CardContent></CardContent>
      </Card>
    );
  }
}
