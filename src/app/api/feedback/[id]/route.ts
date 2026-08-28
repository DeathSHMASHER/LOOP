import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const UpdateSchema = z.object({
  status: z.enum(['NEW', 'REVIEWED', 'ACTIONED']).optional(),
  sentiment: z.enum(['POS', 'NEU', 'NEG']).optional(),
});

// PATCH /api/feedback/[id] - Update feedback status or sentiment
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(['ADMIN', 'ANALYST']);
    const body = await request.json();
    const validated = UpdateSchema.parse(body);

    // Verify item belongs to user's workspace
    const existing = await db.feedback.findFirst({
      where: { id: params.id, workspaceId: user.workspaceId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Feedback item not found' }, { status: 404 });
    }

    const updated = await db.feedback.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update feedback' },
      { status: error.status || 500 }
    );
  }
}

// DELETE /api/feedback/[id] - Delete item (ADMIN or ANALYST)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(['ADMIN', 'ANALYST']);

    const existing = await db.feedback.findFirst({
      where: { id: params.id, workspaceId: user.workspaceId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Feedback item not found' }, { status: 404 });
    }

    await db.feedback.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete feedback' },
      { status: error.status || 500 }
    );
  }
}
