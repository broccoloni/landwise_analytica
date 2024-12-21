import type { AuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getUserByEmail, verifyPassword } from '@/lib/database';
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
    async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
      if (user) {
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.realtyGroup = user.realtyGroup;
        token.id = user.id;
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

        const userResponse = await getUserByEmail(email);
        if (!userResponse.success) {
          throw new Error(userResponse.error);
        }

        const user = userResponse.data;
        if (!user || !(await verifyPassword(user.password, password))) {
          throw new Error('Incorrect email or password');
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
        if (existingUserResponse.success) {
          throw new Error('User already exists');
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
