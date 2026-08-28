import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { searchRelevantFeedback } from '@/lib/search';
import { answerAskLoopQuestion } from '@/lib/ai';
import { z } from 'zod';

const AskQuerySchema = z.object({
  question: z.string().min(3, 'Question must be at least 3 characters long'),
});

export async function POST(request: Request) {
  try {
    const user = await requireAuth();
    const body = await request.json();
    const { question } = AskQuerySchema.parse(body);

    // 1. Retrieve top-5 most relevant feedback items using vector similarity
    const retrievedItems = await searchRelevantFeedback(question, user.workspaceId, 5);

    // 2. Synthesize grounded answer using Google Gemini
    const { answer, citedIds } = await answerAskLoopQuestion(question, retrievedItems);

    return NextResponse.json({
      question,
      answer,
      retrievedSources: retrievedItems,
      citedIds,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Ask LOOP Q&A query failed' },
      { status: error.status || 500 }
    );
  }
}
