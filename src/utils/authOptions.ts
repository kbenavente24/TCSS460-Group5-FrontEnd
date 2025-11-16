// src/utils/authOptions.tsx
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from 'services/authApi';

// User type
interface AuthUser {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  phone?: string;
  accessToken?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    // ================= LOGIN PROVIDER =================
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await authApi.login({
            email: credentials.email.trim(),
            password: credentials.password
          });

          // Ensure the response exists
          const data = response?.data?.data;
          if (!data || !data.user || !data.accessToken) {
            throw new Error('Invalid login response from server');
          }

          // Return user with accessToken
          return { ...data.user, accessToken: data.accessToken };
        } catch (err: any) {
          console.error('Login error:', err);
          const errorMessage = err?.response?.data?.message || err?.message || 'Login failed';
          throw new Error(errorMessage);
        }
      }
    }),

    // ================= REGISTER PROVIDER =================
    // ================= REGISTER PROVIDER =================
CredentialsProvider({
  id: 'register',
  name: 'Register',
  credentials: {
    firstname: { label: 'First Name', type: 'text' },
    lastname: { label: 'Last Name', type: 'text' },
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
    username: { label: 'Username', type: 'text' },
    phone: { label: 'Phone', type: 'text' }
  },
  async authorize(credentials) {
    // Validate required fields
    if (
      !credentials?.firstname?.trim() ||
      !credentials?.lastname?.trim() ||
      !credentials?.email?.trim() ||
      !credentials?.password ||
      !credentials?.username?.trim() ||
      !credentials?.phone?.trim()
    ) {
      throw new Error('All fields are required');
    }

    try {
      // Call the API
      const response = await authApi.register({
        firstname: credentials.firstname.trim(),
        lastname: credentials.lastname.trim(),
        email: credentials.email.trim(),
        password: credentials.password,
        username: credentials.username.trim(),
        phone: credentials.phone.trim()
      });

      // Flexible handling for different response shapes
      const data = response?.data?.data || response?.data;
      if (!data || !data.user || !data.accessToken) {
        console.error('Full registration response:', response.data);
        throw new Error('Invalid registration response from server');
      }

      // Return the user object with accessToken
      return { ...data.user, accessToken: data.accessToken };
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  }
})

  ],

  // ================= CALLBACKS =================
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
        token.accessToken = (user as AuthUser).accessToken;
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.id = token.id as string;
      session.provider = token.provider as string;
      session.token = token;
      return session;
    }
  },

  // ================= SESSION =================
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXTAUTH_JWT_TIMEOUT) || 86400
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET
  },

  debug: process.env.NODE_ENV === 'development',

  pages: {
    signIn: '/login',
    newUser: '/register'
  }
};
