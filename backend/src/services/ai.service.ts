export type SentimentResult = {
  sentiment: "POS" | "NEU" | "NEG";
  sentimentScore: number;
  themes: {
    name: string;
    confidence: number;
  }[];
};

type AIProvider = "mock" | "openai";

const provider: AIProvider =
  process.env.AI_PROVIDER === "openai"
    ? "openai"
    : "mock";

export async function analyzeFeedback(
  content: string
): Promise<SentimentResult> {
  switch (provider) {
    case "openai":
      return analyzeWithOpenAI(content);

    case "mock":
    default:
      return analyzeWithMock(content);
  }
}

/**
 * Temporary mock analyzer.
 * Used while we don't have an AI API key.
 */
function analyzeWithMock(content: string): SentimentResult {
  const text = content.toLowerCase();

  if (
    text.includes("slow") ||
    text.includes("bad") ||
    text.includes("problem") ||
    text.includes("error") ||
    text.includes("hate")
  ) {
    return {
      sentiment: "NEG",
      sentimentScore: 0.91,
      themes: [
        {
          name: "Performance",
          confidence: 0.88,
        },
      ],
    };
  }

  if (
    text.includes("great") ||
    text.includes("good") ||
    text.includes("love") ||
    text.includes("excellent")
  ) {
    return {
      sentiment: "POS",
      sentimentScore: 0.91,
      themes: [
        {
          name: "Positive Experience",
          confidence: 0.87,
        },
      ],
    };
  }

  return {
    sentiment: "NEU",
    sentimentScore: 0.65,
    themes: [
      {
        name: "General Feedback",
        confidence: 0.60,
      },
    ],
  };
}

/**
 * Real AI provider.
 *
 * We will implement this once you have
 * an API key.
 */
async function analyzeWithOpenAI(
  _content: string
): Promise<SentimentResult> {
  throw new Error(
    "OpenAI provider is not configured yet. Set AI_PROVIDER=mock until an API key is available."
  );
}