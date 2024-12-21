import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession`, and the `session` callback
   */
  interface Session {
    user: {
      email: string;
      firstName?: string;
      lastName?: string;
      realtyGroup?: string;
      customerAccountId?: string;
    } & DefaultSession["user"];
  }

  /**
   * Custom User object
   */
  interface User extends DefaultUser {
    firstName?: string;
    lastName?: string;
    realtyGroup?: string;
    customerAccountId?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`
   */
  interface JWT {
    email: string;
    firstName?: string;
    lastName?: string;
    realtyGroup?: string;
    customerAccountId?: string;
  }
}
