import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { classifyFeedback } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const user = await requireRole(['ADMIN', 'ANALYST']);
    const body = await request.json();
    const { feedbackId } = body;

    if (!feedbackId) {
      return NextResponse.json({ error: 'Feedback ID is required' }, { status: 400 });
    }

    const item = await db.feedback.findFirst({
      where: { id: feedbackId, workspaceId: user.workspaceId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Feedback item not found' }, { status: 404 });
    }

    const existingThemes = await db.theme.findMany({
      where: { workspaceId: user.workspaceId },
      select: { name: true },
    });
    const themeNames = existingThemes.map((t) => t.name);

    // Run AI classification with Google Gemini
    const aiResult = await classifyFeedback(item.content, themeNames);

    // Update item
    const updated = await db.feedback.update({
      where: { id: feedbackId },
      data: {
        sentiment: aiResult.sentiment as any,
        sentimentScore: aiResult.sentimentScore,
        featureArea: aiResult.featureArea,
        rationale: aiResult.rationale,
      },
    });

    // Clear old theme mappings and link new
    await db.feedbackTheme.deleteMany({
      where: { feedbackId },
    });

    for (const themeName of aiResult.themes) {
      let theme = await db.theme.findFirst({
        where: { workspaceId: user.workspaceId, name: themeName },
      });

      if (!theme) {
        theme = await db.theme.create({
          data: {
            name: themeName,
            description: `Auto-generated theme for ${themeName}`,
            workspaceId: user.workspaceId,
          },
        });
      }

      await db.feedbackTheme.create({
        data: {
          feedbackId: updated.id,
          themeId: theme.id,
          confidence: 0.95,
        },
      });
    }

    return NextResponse.json({ success: true, feedback: updated, aiResult });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Re-classification failed' },
      { status: error.status || 500 }
    );
  }
}
