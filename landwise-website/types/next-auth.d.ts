import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, and the `session` callback
   */
  interface Session {
    user: Partial<{
      createdAt: string;
      email: string;
      emailReportIds: boolean;
      firstName: string;
      id: string;
      lastLogin: string;
      lastName: string;
      notificationsEnabled: boolean;
      realtyGroup: string;
      status: string;
    }> & DefaultSession["user"];
  }

  /**
   * Custom User object
   */
  interface User extends Partial<DefaultUser> {
    createdAt?: string;
    email?: string;
    emailReportIds?: boolean;
    firstName?: string;
    id?: string;
    lastLogin?: string;
    lastName?: string;
    notificationsEnabled?: boolean;
    realtyGroup?: string;
    status?: string;
    password?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`
   */
  interface JWT extends Partial<{
    createdAt: string;
    email: string;
    emailReportIds: boolean;
    firstName: string;
    id: string;
    lastLogin: string;
    lastName: string;
    notificationsEnabled: boolean;
    realtyGroup: string;
    status: string;
  }> {}
}
