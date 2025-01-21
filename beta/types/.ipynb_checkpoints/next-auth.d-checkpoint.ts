import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, and the `session` callback
   */
  interface Session {
    user: {
      createdAt: string;
      email: string;
      emailReportIds: boolean;
      emailVerificationToken: string;
      emailVerificationTokenExpires: string;
      firstName: string;
      id: string;
      isVerified: boolean;
      lastLogin: string;
      lastName: string;
      notificationsEnabled: boolean;
      realtyGroup: string;
      status: string;
      theme: string;
    } & DefaultSession["user"];
  }

  /**
   * Custom User object
   */
  interface User extends DefaultUser {
    createdAt: string;
    email: string;
    emailReportIds: boolean;
    emailVerificationToken: string;
    emailVerificationTokenExpires: string;
    firstName: string;
    id: string;
    isVerified: boolean;
    lastLogin: string;
    lastName: string;
    notificationsEnabled: boolean;
    realtyGroup: string;
    status: string;
    theme: string;
    password?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`
   */
  interface JWT {
    createdAt: string;
    email: string;
    emailReportIds: boolean;
    emailVerificationToken: string;
    emailVerificationTokenExpires: string;
    firstName: string;
    id: string;
    isVerified: boolean;
    lastLogin: string;
    lastName: string;
    notificationsEnabled: boolean;
    realtyGroup: string;
    status: string;
    theme: string;
  }
}



