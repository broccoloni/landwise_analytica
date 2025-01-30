import { BackendUser } from "@/types/backendUser";
import { User } from "next-auth";

/**
 * Maps a BackendUser object to a User object for frontend usage.
 */
export const backendUserToUser = (backendUser: BackendUser): User => {
  const user: Partial<User> = {
    createdAt: backendUser.createdAt,
    email: backendUser.email,
    emailReportIds: backendUser.emailReportIds,
    firstName: backendUser.firstName,
    id: backendUser.id,
    lastLogin: backendUser.lastLogin,
    lastName: backendUser.lastName,
    notificationsEnabled: backendUser.notificationsEnabled,
    realtyGroup: backendUser.realtyGroup,
    status: backendUser.status,
    theme: backendUser.theme,
  };

  return user as User;
};
