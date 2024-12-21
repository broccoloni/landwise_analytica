import type { AuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getUserByEmail, loginUser } from '@/lib/database';
import { stripe } from '@/lib/stripe';

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
      // Only update the JWT if user data is passed (such as after sign-in or after update)

      console.log("JWT user:", user," trigger:", trigger);
      if (user) {
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.realtyGroup = user.realtyGroup;
        token.id = user.id;
      }

      if (trigger === 'update' && session) {
        token.firstName = session?.firstName;
        token.lastName = session?.lastName;
        token.email = session?.email;
        token.realtyGroup = session?.realtyGroup;
        token.id = session?.id;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
      session.user = {
        ...session.user,
        email: token.email,
        firstName: token.firstName,
        lastName: token.lastName,
        realtyGroup: token.realtyGroup,
        id: token.id,
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
    
        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          realtyGroup: user.realtyGroup,
          id: user.id,
        };
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

        const stripeCustomer = await stripe.customers.create({ email });
        const user = {
          email,
          password,
          firstName,
          lastName,
          realtyGroup,
          id: stripeCustomer.id,
        };

        const createResponse = await createUser(user);
        if (!createResponse.success) {
          throw new Error(createResponse.error);
        }

        return {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          realtyGroup: user.realtyGroup,
          id: user.id,
        };
      },
    }),
  ],
};
