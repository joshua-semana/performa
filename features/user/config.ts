export const userSortConfig = {
    email: "by_email",
    firstName: "by_firstName",
    lastName: "by_lastName",
    status: "by_status"
} as const;

export type UserSortField = keyof typeof userSortConfig;