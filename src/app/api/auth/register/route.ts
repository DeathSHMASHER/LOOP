import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const RegisterSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  workspaceName: z.string().min(2, 'Workspace name is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = RegisterSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // 1. Create new Workspace
    const workspace = await db.workspace.create({
      data: {
        name: validated.workspaceName,
      },
    });

    // 2. Hash password
    const passwordHash = await bcrypt.hash(validated.password, 10);

    // 3. Create Admin User linked to new Workspace
    const user = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase().trim(),
        passwordHash,
        role: 'ADMIN', // Creator is automatically ADMIN
        workspaceId: workspace.id,
      },
    });

    // 4. Seed default workspace themes
    const defaultThemes = [
      { name: 'Onboarding & UX', description: 'User setup and navigation feedback', color: '#6366f1' },
      { name: 'Performance & Latency', description: 'Speed and API responsiveness', color: '#ef4444' },
      { name: 'Feature Requests', description: 'New capability suggestions', color: '#06b6d4' },
    ];

    for (const themeDef of defaultThemes) {
      await db.theme.create({
        data: {
          name: themeDef.name,
          description: themeDef.description,
          color: themeDef.color,
          workspaceId: workspace.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      workspace: { id: workspace.id, name: workspace.name },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
