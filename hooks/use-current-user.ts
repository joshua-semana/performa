import { api } from "@/convex/_generated/api";
import { formatFullName } from "@/lib/utils";
import { useQuery } from "convex/react";

export function useCurrentUser() {
  const user = useQuery(api.userProfiles.getCurrentUserProfile);

  const fullName = user
    ? formatFullName({
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        suffix: user.suffix,
      })
    : null;

  const initials = user ? user.firstName[0] + user.lastName[0] : null;

  return {
    user,
    fullName,
    initials,
    isUserLoading: user === undefined,
    isAuthenticated: !!user,
  };
}
