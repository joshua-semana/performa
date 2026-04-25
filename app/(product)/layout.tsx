"use client";

import { AppSidebar } from "@/features/sidebar/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";
import { appConfig } from "@/lib/config/app";

interface BreadcrumbItem {
  title: string;
  href?: string;
}

function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  const pathSegments = path.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    if (segment === "home") {
      return;
    }

    // Replace dashes with spaces, example: "product-name" -> "product name"
    let title = segment.replace(/-/g, " ");
    // Capitalize the first letter of each word, example: "product name" -> "Product Name"
    title = title.replace(/\b\w/g, (char) => char.toUpperCase());
    // Check if the segment is a type of ID, UUID, and other database keys, example: "1a2b3c" -> "Details"
    if (segment.match(/^[0-9a-fA-F-]+$/)) {
      title = "Details";
    }

    const specialNames: Record<string, string> = {
      users: "Users",
      new: "Create New",
      edit: "Edit",
      forms: "Forms",
      reports: "Reports",
      departments: "Departments",
      roles: "Roles & Permissions",
      settings: "Settings",
    };

    if (specialNames[segment.toLowerCase()]) {
      title = specialNames[segment.toLowerCase()];
    }

    breadcrumbs.push({
      title,
      href: index < pathSegments.length - 1 ? currentPath : undefined,
    });
  });

  return breadcrumbs;
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-1 border-b px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <div className="flex">
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home">{appConfig.name}</BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((breadcrumb, index) => (
                <Fragment key={breadcrumb.title + index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {breadcrumb.href ? (
                      <BreadcrumbLink href={breadcrumb.href}>
                        {breadcrumb.title}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <main className="flex flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
