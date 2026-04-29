"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatFullName } from "@/lib/utils";
import { UserProfileRow } from "./columns";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { UserPreviewContent } from "./user-preview-content";

interface UserPreviewProps {
  user: UserProfileRow;
}

export function UserPreview({ user }: UserPreviewProps) {
  const fullName = formatFullName({
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    suffix: user.suffix,
  });

  const isMobile = useIsMobile();

  const title = "User Profile";
  const description = "Quick preview and management";

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger className="hover:underline cursor-pointer">
          {fullName}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <UserPreviewContent
            fullName={fullName}
            isMobile={isMobile}
            user={user}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet>
      <SheetTrigger className="hover:underline cursor-pointer">
        {fullName}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>Quick preview and management</SheetDescription>
        </SheetHeader>
        <UserPreviewContent
          fullName={fullName}
          isMobile={isMobile}
          user={user}
        />
      </SheetContent>
    </Sheet>
  );
}
