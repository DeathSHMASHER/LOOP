import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { subDays, format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const user = await requireAuth();

    // 1. Fetch total feedback items count for tenant
    const totalCount = await db.feedback.count({
      where: { workspaceId: user.workspaceId },
    });

    const positiveCount = await db.feedback.count({
      where: { workspaceId: user.workspaceId, sentiment: 'POS' },
    });

    const neutralCount = await db.feedback.count({
      where: { workspaceId: user.workspaceId, sentiment: 'NEU' },
    });

    const negativeCount = await db.feedback.count({
      where: { workspaceId: user.workspaceId, sentiment: 'NEG' },
    });

    // Items created this week
    const sevenDaysAgo = subDays(new Date(), 7);
    const newThisWeekCount = await db.feedback.count({
      where: {
        workspaceId: user.workspaceId,
        createdAt: { gte: sevenDaysAgo },
      },
    });

    // 2. Aggregate Feedback Volume over time (Last 30 days)
    const thirtyDaysAgo = subDays(new Date(), 30);
    const recentFeedback = await db.feedback.findMany({
      where: {
        workspaceId: user.workspaceId,
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true, sentiment: true },
      orderBy: { createdAt: 'asc' },
    });

    const volumeMap: Record<string, { date: string; positive: number; neutral: number; negative: number; total: number }> = {};

    for (let i = 29; i >= 0; i--) {
      const dateKey = format(subDays(new Date(), i), 'MMM dd');
      volumeMap[dateKey] = { date: dateKey, positive: 0, neutral: 0, negative: 0, total: 0 };
    }

    recentFeedback.forEach((item) => {
      const dateKey = format(new Date(item.createdAt), 'MMM dd');
      if (volumeMap[dateKey]) {
        volumeMap[dateKey].total += 1;
        if (item.sentiment === 'POS') volumeMap[dateKey].positive += 1;
        if (item.sentiment === 'NEU') volumeMap[dateKey].neutral += 1;
        if (item.sentiment === 'NEG') volumeMap[dateKey].negative += 1;
      }
    });

    const volumeChartData = Object.values(volumeMap);

    // 3. Top Themes Breakdown
    const themes = await db.theme.findMany({
      where: { workspaceId: user.workspaceId },
      include: {
        _count: {
          select: { feedback: true },
        },
      },
      orderBy: {
        feedback: {
          _count: 'desc',
        },
      },
      take: 6,
    });

    const topThemesChartData = themes.map((t) => ({
      name: t.name,
      count: t._count.feedback,
      color: t.color,
    }));

    const sentimentChartData = [
      { name: 'Positive', value: positiveCount, color: '#10b981' },
      { name: 'Neutral', value: neutralCount, color: '#64748b' },
      { name: 'Negative', value: negativeCount, color: '#ef4444' },
    ];

    return NextResponse.json({
      statCards: {
        totalFeedback: totalCount,
        negativePct: `${Math.round((negativeCount / (totalCount || 1)) * 100)}%`,
        newThisWeek: newThisWeekCount,
        positivePct: `${Math.round((positiveCount / (totalCount || 1)) * 100)}%`,
      },
      volumeChartData,
      sentimentChartData,
      topThemesChartData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: error.status || 500 }
    );
  }
}
