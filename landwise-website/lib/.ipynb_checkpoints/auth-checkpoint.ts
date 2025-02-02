import type { AuthOptions, DefaultSession } from 'next-auth';
import { BackendUser } from '@/types/backendUser';
import { backendUserToUser } from '@/utils/backendUserToUser';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createUser, getUserByEmail, getUserById, loginUser } from '@/lib/database';
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
    async signIn({ user, account, profile }) {
      return true;
    },
    async session({ session, token }) {
      try {
        const id = session?.user?.id || token?.id;
        const email = session?.user?.email || token?.email;

        const sessionUser = session?.user || {};
        const {
          firstName,
          lastName,
          realtyGroup,
          createdAt,
          lastLogin,
          emailReportIds,
          notificationsEnabled,
          status,
        } = sessionUser;
          
        if (!id && !email) {
          console.log('Email and ID not found in session');
          return session;
        }
          
        if (id && email && firstName && lastName && realtyGroup && createdAt && lastLogin && emailReportIds && notificationsEnabled && status) {
          console.log('Got session for', session?.user?.email, session.user);
          return session;
        }

        let user;
        
        if (id) {
          user = await getUserById(id);
        } else if (email) {
          user = await getUserByEmail(email);
        } 

        if (!user) { 
          console.log('User not found');
          return session
        }

        const frontendUser = backendUserToUser(user);
  
        session.user = frontendUser;
        console.log('Got session for', session?.user?.email, session.user);

        return session as DefaultSession;
      } catch (error: any) {
        console.log('Error in session callback:', error);
        return session;
      }
    },
    async jwt({ token, user, trigger, session }) {
      console.log("JWT Callback: (token)", token, "(user)", user,"(trigger)", trigger, "(session)",session);
      if (trigger === 'update' && session?.user) {
        token.email = session.user.email;
        token.id = session.user.id;
      }
      
      else if (user) {
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },
  },
  providers: [
    CredentialsProvider({
      id: 'signin',
      name: 'Email & Password',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: {},
      },
      async authorize(credentials, req) {
        try {
          console.log("Sign in", credentials, req);
          if (!credentials) {
            throw new Error('No credentials provided');
          }

          const { email, password } = credentials;
          if (!email || !password) {
            throw new Error('Both email and password are required');
          }

          const loginResponse = await loginUser(email, password);

          console.log("Sign in login response:", loginResponse);
          if (!loginResponse.success) {
            throw new Error(loginResponse.message || 'Invalid email or password');
          }

          const user = loginResponse.data;
          if (!user) {
            throw new Error('No user found with the provided credentials');
          }

          console.log("Authentication successful:", user);
          
          return user;
        } catch (error: any) {
          console.log('Error logging in user:', error);
          return null;
        }
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
      async authorize(credentials, req) {
        try {
          console.log("Sign up:", credentials, req);
            
          if (!credentials) {
            throw new Error('No credentials provided');
          }

          const { email, password, firstName, lastName, realtyGroup } = credentials;
          if (!email || !password || !firstName || !lastName || !realtyGroup) {
            throw new Error('All fields are required: Email, Password, First Name, Last Name, Realty Group');
          }

          const existingUser = await getUserByEmail(email);

          console.log("existing user:", existingUser);
          if (existingUser) {
            throw new Error('This email is already in use');
          }

          const stripeCustomer = await stripe.customers.create({
            email,
            name: `${firstName} ${lastName}`,
          });

          console.log("Created stripe customer:", stripeCustomer);
  
          const curDate = new Date().toISOString();
          const newUser: BackendUser = {
            id: stripeCustomer.id,
            email,
            firstName,
            lastName,
            realtyGroup,
            createdAt: curDate,
            lastLogin: curDate,
            emailReportIds: true,
            notificationsEnabled: true,
            status: RealtorStatus.Unverified,
            password,
            emailVerificationToken: '',
            emailVerificationTokenExpires: '',
          };

          console.log("new user:", newUser);

          const createResponse = await createUser(newUser);

          console.log("create user response:", createResponse);
          if (!createResponse.success) {
            throw new Error('Failed to create user');
          }

          const emailResult = await sendVerificationEmail(stripeCustomer.id, email);

          console.log("email Result:", emailResult);
          if (!emailResult.success) {
            throw new Error('Failed to send verification email');
          }

          const frontendUser = backendUserToUser(newUser);

          console.log("Sign up successful");
          return frontendUser;
        } catch (error: any) {
          console.log('Error signing up user', error);
          return null;
        }
      },
    }),
  ],
};
