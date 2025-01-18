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
    async jwt({ token, user, trigger, session }: { token: JWT; user?: User; trigger?: string }): Promise<JWT> {
      if (user) {
        Object.assign(token, user);
      }
    
      if (trigger === 'update' && session) {
        Object.assign(token, session);
      }
    
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.user = {
        ...session.user, // Retain any existing attributes in session.user
        ...token,        // Spread all attributes from the token into session.user
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
    
        const { password: _password, ...otherFields } = user;
        return { ...otherFields };
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

        const existingUserResponse = await getUserByEmail(email);
        if (existingUserResponse !== null) {
          throw new Error('Email already in use');
        }

        const stripeCustomer = await stripe.customers.create({ 
          email,
          name: `${firstName} ${lastName}`,
        });

        const curDate = new Date().toISOString();
        const user = {
          email,
          password,
          firstName,
          lastName,
          realtyGroup,
          id: stripeCustomer.id,
          status: RealtorStatus.Unverified,
          createdAt: curDate,
          lastLogin: curDate,
        };

        const createResponse = await createUser(user);
        if (!createResponse.success) {
          throw new Error(createResponse.error);
        }
          
        const emailResult = await sendVerificationEmail(stripeCustomer.id, email);

        if (!emailResult.success) {
          return { success: false, error: 'Failed to send verification email.' };
        }

        const { password: _password, ...otherFields } = user;
        return { ...otherFields };
      },
    }),
  ],
};
