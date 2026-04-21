import { api } from "@/convex/_generated/api";
import { isAuthenticated } from "@/convex/auth";
import { useQuery } from "convex/react";

export function useCurrentUser() {
  const user = useQuery(api.userProfiles.getCurrentUserProfile);

  const fullName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ")
    : null;

  return {
    user,
    fullName,
    isUserLoading: user === undefined,
    isAuthenticated: !!user,
  };
}
