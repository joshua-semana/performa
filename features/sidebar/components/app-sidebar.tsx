import { ChartColumnBig, House, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../../../components/ui/sidebar";
import { NavUser } from "./nav-user";
import Link from "next/link";
import { SidebarItem } from "@/lib/sidebar/types";
import { NavMain } from "./nav-main";
import { appConfig } from "@/lib/config/app";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/home">
                <div className="bg-primary text-primary-foreground size-8 aspect-square flex items-center justify-around rounded-lg">
                  <ChartColumnBig className="size-4" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="truncate font-semibold text-sm">
                    {appConfig.name}
                  </span>
                  <span className="truncate text-muted-foreground text-xs">
                    {appConfig.description}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
