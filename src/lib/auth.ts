import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import * as bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
          include: { workspace: true },
        });

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password');
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          workspaceId: user.workspaceId,
          workspaceName: user.workspace.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.workspaceId = (user as any).workspaceId;
        token.workspaceName = (user as any).workspaceName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).workspaceId = token.workspaceId;
        (session.user as any).workspaceName = token.workspaceName;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'loop_jwt_secret_key_zidio_2026_safe_dev',
};

export async function getAuthSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth() {
  const session = await getAuthSession();
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  return session.user as {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'ANALYST' | 'VIEWER';
    workspaceId: string;
    workspaceName: string;
  };
}

export async function requireRole(allowedRoles: ('ADMIN' | 'ANALYST' | 'VIEWER')[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    const error: any = new Error('Forbidden: Insufficient privileges');
    error.status = 403;
    throw error;
  }
  return user;
}
