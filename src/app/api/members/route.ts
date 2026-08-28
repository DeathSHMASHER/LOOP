import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const AddMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']),
});

const UpdateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']),
});

// GET /api/members - Fetch workspace member list
export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    const members = await db.user.findMany({
      where: { workspaceId: user.workspaceId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(members);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch workspace members' },
      { status: error.status || 500 }
    );
  }
}

// POST /api/members - Add new member to workspace (ADMIN ONLY)
export async function POST(request: Request) {
  try {
    const admin = await requireRole(['ADMIN']);
    const body = await request.json();
    const validated = AddMemberSchema.parse(body);

    const existing = await db.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const newUser = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase(),
        passwordHash,
        role: validated.role,
        workspaceId: admin.workspaceId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create workspace member' },
      { status: error.status || 500 }
    );
  }
}

// PATCH /api/members - Update user role (ADMIN ONLY)
export async function PATCH(request: Request) {
  try {
    const admin = await requireRole(['ADMIN']);
    const body = await request.json();
    const { userId, role } = UpdateRoleSchema.parse(body);

    // Verify member belongs to admin's workspace
    const member = await db.user.findFirst({
      where: { id: userId, workspaceId: admin.workspaceId },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found in your workspace' }, { status: 404 });
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update member role' },
      { status: error.status || 500 }
    );
  }
}
