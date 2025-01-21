import type { AuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getUserByEmail, loginUser } from '@/lib/database';
import { stripe } from '@/lib/stripe';
import { RealtorStatus } from '@/types/statuses';
import { sendVerificationEmail } from '@/utils/sendEmail';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/realtor-login',
    signOut: '/',
  },
  callbacks: {
    async signIn({ user }): Promise<boolean> {
      return !!user;
    },
    async jwt({ token, user, trigger, session }: { token: JWT; user?: User; trigger?: string; session?: Partial<Session>; }): Promise<JWT> {
      // Include all attributes from the `user` definition when a user logs in or signs up
      if (user) {
        token = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          realtyGroup: user.realtyGroup,
          emailReportIds: user.emailReportIds,
          emailVerificationToken: user.emailVerificationToken,
          emailVerificationTokenExpires: user.emailVerificationTokenExpires,
          isVerified: user.isVerified,
          status: user.status,
          theme: user.theme,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          notificationsEnabled: user.notificationsEnabled,
        };
      }

      // If updating the session, include updated session values
      if (trigger === 'update' && session) {
        Object.assign(token, session);
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      // Pass all relevant attributes to the session object
      session.user = {
        id: token.id as string,
        email: token.email as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        realtyGroup: token.realtyGroup as string,
        emailReportIds: token.emailReportIds as boolean,
        emailVerificationToken: token.emailVerificationToken as string,
        emailVerificationTokenExpires: token.emailVerificationTokenExpires as string,
        isVerified: token.isVerified as boolean,
        status: token.status as string,
        theme: token.theme as string,
        createdAt: token.createdAt as string,
        lastLogin: token.lastLogin as string,
        notificationsEnabled: token.notificationsEnabled as boolean,
      };
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'signin',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
    
        const { email, password } = credentials;
    
        if (!email || !password) {
          throw new Error('Email or password not provided');
        }
    
        const loginResponse = await loginUser(email, password);
    
        if (!loginResponse.success) {
          throw new Error(loginResponse.message || 'Failed to log in');
        }
    
        const user = loginResponse.data;
    
        if (!user) {
          throw new Error('User not found');
        }
    
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword as User
      },
    }),
    CredentialsProvider({
      id: 'signup',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        firstName: { label: 'First Name', type: 'text' },
        lastName: { label: 'Last Name', type: 'text' },
        realtyGroup: { label: 'Realty Group', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
    
        const { email, password, firstName, lastName, realtyGroup } = credentials;
    
        if (!email || !password || !firstName || !lastName || !realtyGroup) {
          throw new Error('Missing required fields');
        }
    
        // Check if user already exists
        const existingUserResponse = await getUserByEmail(email);
        if (existingUserResponse !== null) {
          throw new Error('Email already in use');
        }
    
        // Create Stripe customer
        const stripeCustomer = await stripe.customers.create({ 
          email,
          name: `${firstName} ${lastName}`,
        });
    
        const curDate = new Date().toISOString();
    
        // Create new user
        const user: User = {
          createdAt: curDate,
          email,
          emailReportIds: true,
          emailVerificationToken: '',
          emailVerificationTokenExpires: '',
          firstName,
          id: stripeCustomer.id,
          isVerified: false,
          lastLogin: curDate,
          lastName,
          notificationsEnabled: true,
          realtyGroup,
          status: RealtorStatus.Unverified,
          theme: 'Light',
        };
    
        const createResponse = await createUser(user);
    
        if (!createResponse.success) {
          throw new Error(createResponse.message);
        }
    
        // Send verification email
        const emailResult = await sendVerificationEmail(stripeCustomer.id, email);
    
        if (!emailResult.success) {
          throw new Error('Failed to send verification email');
        }
    
        // Exclude password from user object
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword as User; 
      },
    }),

  ],
};
