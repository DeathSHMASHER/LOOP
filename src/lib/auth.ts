import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
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
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false;

        const email = user.email.toLowerCase().trim();
        let existingUser = await db.user.findUnique({
          where: { email },
          include: { workspace: true },
        });

        if (!existingUser) {
          // Auto-provision a workspace and admin user for new Google signup
          const workspaceName = user.name ? `${user.name.split(' ')[0]}'s Workspace` : 'Personal Workspace';
          const workspace = await db.workspace.create({
            data: {
              name: workspaceName,
            },
          });

          existingUser = await db.user.create({
            data: {
              name: user.name || 'User',
              email,
              role: 'ADMIN',
              workspaceId: workspace.id,
              image: user.image || null,
            } as any,
            include: { workspace: true },
          });
        } else if (user.image && !(existingUser as any).image) {
          await db.user.update({
            where: { id: existingUser.id },
            data: { image: user.image } as any,
          });
        }

        if (!existingUser) return false;

        (user as any).id = existingUser.id;
        (user as any).role = existingUser.role;
        (user as any).workspaceId = existingUser.workspaceId;
        (user as any).workspaceName = existingUser.workspace.name;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.workspaceId = (user as any).workspaceId;
        token.workspaceName = (user as any).workspaceName;
      } else if (!token.workspaceId && token.email) {
        const dbUser = await db.user.findUnique({
          where: { email: (token.email as string).toLowerCase().trim() },
          include: { workspace: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.workspaceId = dbUser.workspaceId;
          token.workspaceName = dbUser.workspace.name;
        }
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
