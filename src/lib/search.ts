import { db } from '@/lib/db';
import { generateTextEmbedding } from '@/lib/ai';

export interface VectorSearchResult {
  feedbackId: string;
  content: string;
  channel: string;
  sentiment: string;
  score: number;
  createdAt: Date;
  similarity: number;
}

// Compute cosine similarity between two vector arrays
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length || vecA.length === 0) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Retrieve top-K relevant feedback items for a query within a workspace
export async function searchRelevantFeedback(
  query: string,
  workspaceId: string,
  topK: number = 5
): Promise<VectorSearchResult[]> {
  // 1. Generate query embedding vector
  const queryVector = await generateTextEmbedding(query);

  // 2. Fetch all embeddings for feedback in the caller's workspace (Strict multi-tenant boundary)
  const embeddings = await db.embedding.findMany({
    where: {
      feedback: {
        workspaceId,
      },
    },
    include: {
      feedback: true,
    },
  });

  // 3. Compute similarity score for each item
  const results: VectorSearchResult[] = [];

  for (const item of embeddings) {
    try {
      const vec: number[] = JSON.parse(item.vector);
      const similarity = cosineSimilarity(queryVector, vec);
      results.push({
        feedbackId: item.feedback.id,
        content: item.feedback.content,
        channel: item.feedback.channel,
        sentiment: item.feedback.sentiment,
        score: item.feedback.sentimentScore,
        createdAt: item.feedback.createdAt,
        similarity,
      });
    } catch (e) {
      console.error('Error parsing vector for feedback item:', item.feedbackId);
    }
  }

  // 4. Sort by highest similarity and return top K
  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, topK);
}
