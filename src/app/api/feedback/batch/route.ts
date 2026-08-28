import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { classifyFeedback, generateTextEmbedding } from '@/lib/ai';
import Papa from 'papaparse';

export async function POST(request: Request) {
  try {
    const user = await requireRole(['ADMIN', 'ANALYST']);
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No CSV file provided' }, { status: 400 });
    }

    const text = await file.text();
    const parsed = Papa.parse<any>(text, { header: true, skipEmptyLines: true });

    if (parsed.errors.length > 0 && parsed.data.length === 0) {
      return NextResponse.json({ error: 'Invalid CSV format' }, { status: 400 });
    }

    // Fetch existing themes for classification
    const existingThemes = await db.theme.findMany({
      where: { workspaceId: user.workspaceId },
      select: { name: true },
    });
    const themeNames = existingThemes.map((t) => t.name);

    let importedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < parsed.data.length; i++) {
      const row = parsed.data[i];
      const content = row.content || row.Content || row.text || row.Text;
      const channel = row.channel || row.Channel || 'CSV Upload';
      const customerLabel = row.customer_label || row.customerLabel || row.customer || 'Imported User';

      if (!content || typeof content !== 'string' || content.trim().length < 3) {
        failedCount++;
        errors.push(`Row ${i + 1}: Missing or invalid content text`);
        continue;
      }

      try {
        // AI Auto-Classification with Google Gemini
        const aiResult = await classifyFeedback(content.trim(), themeNames);

        const feedback = await db.feedback.create({
          data: {
            content: content.trim(),
            channel: channel.trim(),
            sourceRef: `CSV-ROW-${i + 1}-${Date.now()}`,
            customerLabel: customerLabel.trim(),
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
        const vector = await generateTextEmbedding(content.trim());
        await db.embedding.create({
          data: {
            feedbackId: feedback.id,
            vector: JSON.stringify(vector),
          },
        });

        importedCount++;
      } catch (err: any) {
        failedCount++;
        errors.push(`Row ${i + 1}: ${err.message || 'Ingestion error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      importedCount,
      failedCount,
      errors,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'CSV Ingestion failed' },
      { status: error.status || 500 }
    );
  }
}
