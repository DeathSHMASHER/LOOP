import { NextResponse } from 'next/server';
import { requireAuth, requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateVoCReportNarrative } from '@/lib/ai';

// GET /api/reports - Fetch all VoC reports for caller's workspace
export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    const reports = await db.report.findMany({
      where: { workspaceId: user.workspaceId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reports' },
      { status: error.status || 500 }
    );
  }
}

// POST /api/reports - Generate a new VoC Report with pre-computed stats + Google Gemini narrative
export async function POST(request: Request) {
  try {
    const user = await requireRole(['ADMIN', 'ANALYST']);
    const body = await request.json();
    const periodDays = parseInt(body.periodDays || '30', 10);

    const now = new Date();
    const periodStart = new Date(now.getTime() - periodDays * 86400000);

    // 1. Gather stats in workspace
    const feedbackItems = await db.feedback.findMany({
      where: {
        workspaceId: user.workspaceId,
        createdAt: { gte: periodStart },
      },
      include: {
        themes: {
          include: { theme: true },
        },
      },
    });

    const totalCount = feedbackItems.length;
    const positiveCount = feedbackItems.filter((i) => i.sentiment === 'POS').length;
    const neutralCount = feedbackItems.filter((i) => i.sentiment === 'NEU').length;
    const negativeCount = feedbackItems.filter((i) => i.sentiment === 'NEG').length;

    // Theme frequency count
    const themeCounts: Record<string, number> = {};
    feedbackItems.forEach((item) => {
      item.themes.forEach((ft) => {
        themeCounts[ft.theme.name] = (themeCounts[ft.theme.name] || 0) + 1;
      });
    });

    const topThemes = Object.entries(themeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const sampleQuotes = feedbackItems
      .slice(0, 5)
      .map((i) => ({ content: i.content, channel: i.channel, sentiment: i.sentiment }));

    // 2. Generate executive narrative using Google Gemini
    const narrative = await generateVoCReportNarrative(
      `Last ${periodDays} Days`,
      { totalCount, positiveCount, neutralCount, negativeCount },
      topThemes,
      sampleQuotes
    );

    const fullContentJson = JSON.stringify({
      metrics: {
        totalCount,
        positiveCount,
        neutralCount,
        negativeCount,
        negativePct: `${Math.round((negativeCount / (totalCount || 1)) * 100)}%`,
      },
      topThemes,
      ...narrative,
    });

    // 3. Save report entity
    const report = await db.report.create({
      data: {
        title: `Voice of Customer Digest — ${periodDays}-Day Executive Summary`,
        periodStart,
        periodEnd: now,
        contentJson: fullContentJson,
        workspaceId: user.workspaceId,
        generatedBy: user.id,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate report' },
      { status: error.status || 500 }
    );
  }
}
