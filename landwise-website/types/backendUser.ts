import { DefaultUser } from "next-auth";

export interface BackendUser extends Partial<DefaultUser> {
  // Things stored on DefaultUser in next-auth.d.ts  
  createdAt?: string;
  email?: string;
  emailReportIds?: boolean;
  firstName?: string;
  id?: string;
  isVerified?: boolean;
  lastLogin?: string;
  lastName?: string;
  notificationsEnabled?: boolean;
  realtyGroup?: string;
  status?: string;
  theme?: string;

  // Additional attributes for backend
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: string;
  password?: string;
}