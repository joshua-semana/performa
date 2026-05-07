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
import { useRouter } from "next/navigation";

export function UserPreview({ user }: { user: UserProfileRow }) {
  const router = useRouter();

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
        <DrawerTrigger className="hover:underline cursor-pointer text-left truncate w-full">
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
            router={router}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet>
      <SheetTrigger className="hover:underline cursor-pointer text-left truncate">
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
          router={router}
        />
      </SheetContent>
    </Sheet>
  );
}
