"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Bolt, CircleUser, EllipsisVertical, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { MenuSignOut } from "./menu-signout";
import {
  AvatarSkeleton,
  TextSkeleton,
} from "@/components/skeletons/primitives";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const { user, fullName, isUserLoading } = useCurrentUser();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              tooltip="User Settings"
              disabled={isUserLoading}
            >
              {isUserLoading ? (
                <div className="flex gap-2 items-center">
                  <AvatarSkeleton />
                  <TextSkeleton />
                </div>
              ) : (
                <>
                  <Avatar>
                    <AvatarFallback>{user?.firstName[0]}</AvatarFallback>
                  </Avatar>

                  <div className="leading-tight">
                    <p className="truncate font-medium text-sm">{fullName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </>
              )}
              <EllipsisVertical className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side={isMobile ? "bottom" : "right"}>
            <DropdownMenuItem>
              <CircleUser className="text-muted-foreground" />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bolt className="text-muted-foreground" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <>
                  <Moon className="text-muted-foreground" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="text-muted-foreground" />
                  <span>Light Mode</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <MenuSignOut />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
