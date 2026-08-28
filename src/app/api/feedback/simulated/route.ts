import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { classifyFeedback, generateTextEmbedding } from '@/lib/ai';

const simulatedChannelPulls: Record<string, Array<{ content: string; customerLabel: string }>> = {
  Zendesk: [
    { content: "Ticket #4092: Customer reporting 504 gateway timeout when uploading enterprise PDF attachments.", customerLabel: "Zendesk User #4092" },
    { content: "Ticket #4105: How do we transfer workspace ownership to a new billing contact?", customerLabel: "Zendesk User #4105" },
    { content: "Ticket #4118: Live chat support resolved our SSO configuration in under 5 minutes. Outstanding service!", customerLabel: "Zendesk User #4118" },
  ],
  'App Store': [
    { content: "★★★★☆ The new v2.4 dark mode update is gorgeous! Please add widgets for quick analytics view.", customerLabel: "AppStore Reviewer @alex_tech" },
    { content: "★☆☆☆☆ App crashes repeatedly on iOS 17.5 when switching tabs quickly.", customerLabel: "AppStore Reviewer @mobile_dev" },
  ],
  Twitter: [
    { content: "Shoutout to @ProjectLOOP for automating our weekly customer feedback digests! Massive time saver for product management.", customerLabel: "Twitter @product_lead" },
    { content: "Hey @ProjectLOOP team, any plans for Jira integration? We want feedback to automatically turn into engineering tickets.", customerLabel: "Twitter @dev_ops_guy" },
  ],
};

export async function POST(request: Request) {
  try {
    const user = await requireRole(['ADMIN', 'ANALYST']);
    const body = await request.json();
    const channelName = body.channel || 'Zendesk';

    const itemsToIngest = simulatedChannelPulls[channelName] || simulatedChannelPulls['Zendesk'];

    // Fetch existing themes for classification
    const existingThemes = await db.theme.findMany({
      where: { workspaceId: user.workspaceId },
      select: { name: true },
    });
    const themeNames = existingThemes.map((t) => t.name);

    const createdItems = [];

    for (const item of itemsToIngest) {
      const aiResult = await classifyFeedback(item.content, themeNames);

      const feedback = await db.feedback.create({
        data: {
          content: item.content,
          channel: channelName,
          sourceRef: `SIMULATED-${channelName.toUpperCase()}-${Date.now()}`,
          customerLabel: item.customerLabel,
          sentiment: aiResult.sentiment as any,
          sentimentScore: aiResult.sentimentScore,
          featureArea: aiResult.featureArea,
          rationale: aiResult.rationale,
          status: 'NEW',
          workspaceId: user.workspaceId,
        },
      });

      // Link Theme
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

      // Embedding
      const vector = await generateTextEmbedding(item.content);
      await db.embedding.create({
        data: {
          feedbackId: feedback.id,
          vector: JSON.stringify(vector),
        },
      });

      createdItems.push(feedback);
    }

    return NextResponse.json({
      success: true,
      channel: channelName,
      importedCount: createdItems.length,
      items: createdItems,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Simulated channel pull failed' },
      { status: error.status || 500 }
    );
  }
}
