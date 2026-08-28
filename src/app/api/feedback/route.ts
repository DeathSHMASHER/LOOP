import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { classifyFeedback, generateTextEmbedding } from '@/lib/ai';
import { z } from 'zod';

const SingleFeedbackSchema = z.object({
  content: z.string().min(3, 'Feedback content is required'),
  channel: z.string().default('Support Ticket'),
  sourceRef: z.string().optional(),
  customerLabel: z.string().optional(),
});

// GET /api/feedback - Paginated, filtered, searched inbox query
export async function GET(request: Request) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const search = searchParams.get('search') || '';
    const channel = searchParams.get('channel') || '';
    const sentiment = searchParams.get('sentiment') || '';
    const status = searchParams.get('status') || '';
    const themeId = searchParams.get('themeId') || '';

    const skip = (page - 1) * limit;

    // Build Prisma query condition strictly scoped to user's workspaceId
    const where: any = {
      workspaceId: user.workspaceId,
    };

    if (search) {
      where.content = { contains: search };
    }

    if (channel && channel !== 'ALL') {
      where.channel = channel;
    }

    if (sentiment && sentiment !== 'ALL') {
      where.sentiment = sentiment;
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (themeId && themeId !== 'ALL') {
      where.themes = {
        some: {
          themeId: themeId,
        },
      };
    }

    const [items, totalCount] = await Promise.all([
      db.feedback.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          themes: {
            include: {
              theme: true,
            },
          },
        },
      }),
      db.feedback.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch feedback' },
      { status: error.status || 500 }
    );
  }
}

// POST /api/feedback - Ingest single feedback item & trigger AI auto-classification
export async function POST(request: Request) {
  try {
    // Only ADMIN or ANALYST can ingest feedback
    const user = await requireRole(['ADMIN', 'ANALYST']);
    const body = await request.json();
    const validated = SingleFeedbackSchema.parse(body);

    // Fetch workspace themes for classification prompt
    const existingThemes = await db.theme.findMany({
      where: { workspaceId: user.workspaceId },
      select: { name: true },
    });
    const themeNames = existingThemes.map((t) => t.name);

    // 1. Run AI Auto-Classification with Google Gemini
    const aiResult = await classifyFeedback(validated.content, themeNames);

    // 2. Create Feedback item in DB
    const feedback = await db.feedback.create({
      data: {
        content: validated.content,
        channel: validated.channel,
        sourceRef: validated.sourceRef || `MANUAL-${Date.now()}`,
        customerLabel: validated.customerLabel || 'Manual Entry',
        sentiment: aiResult.sentiment as any,
        sentimentScore: aiResult.sentimentScore,
        featureArea: aiResult.featureArea,
        rationale: aiResult.rationale,
        status: 'NEW',
        workspaceId: user.workspaceId,
      },
    });

    // 3. Link or create Themes
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
          feedbackId: feedback.id,
          themeId: theme.id,
          confidence: 0.9,
        },
      });
    }

    // 4. Generate and store vector embedding for semantic search
    const vector = await generateTextEmbedding(validated.content);
    await db.embedding.create({
      data: {
        feedbackId: feedback.id,
        vector: JSON.stringify(vector),
      },
    });

    return NextResponse.json({ success: true, feedback }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create feedback' },
      { status: error.status || 500 }
    );
  }
}
