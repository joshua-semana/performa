"use client";

import { useConvexAuth } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated) {
      router.push("/home");
    } else {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="flex items-center justify-center min-h-svh gap-2">
      <Loader2 className="size-6 animate-spin" /> Loading, please wait...
    </main>
  );
}
