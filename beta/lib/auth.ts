import type { AuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getUser, verifyPassword } from '@/lib/database';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';
// import GoogleProvider from 'next-auth/providers/google';
// import AppleProvider from 'next-auth/providers/apple';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/realtor-login',
    signOut: '/',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      return true;
    },
    async session({ session, token }) {
      return session as DefaultSession;
    },
    async jwt({ token, user, trigger, session }) {
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Email & Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
          
        let user = null;
        try {
          const email = credentials?.email;
          const password = credentials?.password;
          if (!email || !password) {
            throw new Error('Email or password not provided');
          }

          console.log(`Looking for user with email: ${email}`);

          const tableName = 'Realtors';
          const response = await getUser( tableName, email );

          console.log("get response:", response);
          if (!response.success) {
            throw new Error(response.error);
          }

          user = response.data;

          if (!user) {
            throw new Error('Incorrect email or password');
          }

          const validPassword = await verifyPassword( user, password );
          if (!validPassword) {
            throw new Error("Incorrect email or password");
          }
            
          console.log('User validated successfully');
            
        } catch (err) {
          console.error(err);
          return null;
        }

        return {
          email: user.email,
        };
      },
    }),
    CredentialsProvider({
      id: 'signup',
      name: 'Email & Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        firstName: {},
        lastName: {},
        realtyGroup: {},
      },
      async authorize(credentials, req) {
          
        console.log('Signing up a realtor');

        const email = credentials?.email;
        const password = credentials?.password;
        if (!email) {
          console.log('Could not find an email for authorization');
          return null;
        }

        let user = null;
       
        try {
          const response = await getUser( email );
          console.log("get response:", JSON.stringify(response.data));
          if (!response.success) {
            throw new Error(response.error);
          }

          if (response.data) {
            throw new Error("User already exists");
          }
          
          const account = await stripe.customers.create({
            email: email,
          });
          console.log('Created customer account', account.id);

          user = {
            email,
            password,
            customerAccountId: account.id,
          };
          
          const createResponse = await createUser( user);
          if (!createResponse.success) {
            throw new Error(createResponse.error);
          }

        } catch (error) {
          console.error("Error signing up user:", error);
          return null;
        }

        return {
          email: user.email,
          customerAccountId: user.customerAccountId,
        
        };
      }
    }),
  ],
};