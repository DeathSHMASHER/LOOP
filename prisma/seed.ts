import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const Role = {
  ADMIN: 'ADMIN',
  ANALYST: 'ANALYST',
  VIEWER: 'VIEWER',
} as const;

const Sentiment = {
  POS: 'POS',
  NEU: 'NEU',
  NEG: 'NEG',
} as const;

const Status = {
  NEW: 'NEW',
  REVIEWED: 'REVIEWED',
  ACTIONED: 'ACTIONED',
} as const;

function generateVector(text: string): number[] {
  const hashText = text.toLowerCase();
  const vector = new Array(32).fill(0);
  for (let i = 0; i < hashText.length; i++) {
    const charCode = hashText.charCodeAt(i);
    vector[i % 32] = (vector[i % 32] + charCode / 255.0) % 1.0;
  }
  return vector;
}

const rawFeedbackSamples = [
  // Onboarding & UX
  { content: "Onboarding took forever — I couldn't figure out how to invite my team members.", channel: "Support Ticket", sentiment: Sentiment.NEG, score: -0.8, area: "User Onboarding", themeName: "Onboarding & UX", status: Status.NEW },
  { content: "The new user walkthrough is super clean and helpful! Got setup in 2 minutes.", channel: "App Store Review", sentiment: Sentiment.POS, score: 0.9, area: "User Onboarding", themeName: "Onboarding & UX", status: Status.REVIEWED },
  { content: "Where do I set up my workspace settings? The menu navigation is confusing.", channel: "NPS Survey", sentiment: Sentiment.NEU, score: -0.2, area: "Navigation", themeName: "Onboarding & UX", status: Status.NEW },
  { content: "Prospect mentioned that the initial configuration steps feel clunky compared to competitors.", channel: "Sales Call Note", sentiment: Sentiment.NEG, score: -0.6, area: "Setup Flow", themeName: "Onboarding & UX", status: Status.NEW },
  { content: "I love the clean dark mode interface! It looks super modern.", channel: "Community Post", sentiment: Sentiment.POS, score: 0.85, area: "UI Design", themeName: "Onboarding & UX", status: Status.ACTIONED },

  // Performance & Latency
  { content: "Dashboard loading is very slow when we filter across large date ranges.", channel: "Support Ticket", sentiment: Sentiment.NEG, score: -0.75, area: "Dashboard Engine", themeName: "Performance & Latency", status: Status.NEW },
  { content: "The app frequently times out during CSV imports over 500 rows.", channel: "Support Ticket", sentiment: Sentiment.NEG, score: -0.9, area: "CSV Importer", themeName: "Performance & Latency", status: Status.NEW },
  { content: "Noticeable speed improvements after the latest update! Page transitions are instant now.", channel: "App Store Review", sentiment: Sentiment.POS, score: 0.8, area: "Web Performance", themeName: "Performance & Latency", status: Status.ACTIONED },

  // Billing & Invoicing
  { content: "Billing page keeps timing out when I try to download an invoice PDF.", channel: "Support Ticket", sentiment: Sentiment.NEG, score: -0.85, area: "Billing System", themeName: "Billing & Invoicing", status: Status.NEW },
  { content: "We were double billed this month due to workspace user seat miscalculation.", channel: "Support Ticket", sentiment: Sentiment.NEG, score: -0.95, area: "Subscription Sync", themeName: "Billing & Invoicing", status: Status.NEW },

  // Integrations & API
  { content: "Prospect wants SSO (SAML/Okta) before they will sign — third time this month.", channel: "Sales Call Note", sentiment: Sentiment.NEG, score: -0.7, area: "Authentication", themeName: "Integrations & API", status: Status.NEW },
  { content: "Zendesk integration is smooth! All support tickets auto-sync into our inbox.", channel: "App Store Review", sentiment: Sentiment.POS, score: 0.9, area: "Zendesk Sync", themeName: "Integrations & API", status: Status.ACTIONED },

  // Mobile Experience & Feature Requests
  { content: "It does the job, but the mobile experience needs work. Tables overflow horizontally.", channel: "NPS Survey", sentiment: Sentiment.NEU, score: -0.3, area: "Mobile Responsive", themeName: "Mobile App Experience", status: Status.REVIEWED },
  { content: "Love the new export feature, saved me an hour today!", channel: "Community Post", sentiment: Sentiment.POS, score: 0.95, area: "Data Export", themeName: "Feature Requests", status: Status.ACTIONED }
];

async function main() {
  console.log('🌱 Starting database seeding...');

  await prisma.embedding.deleteMany({});
  await prisma.feedbackTheme.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.theme.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.workspace.deleteMany({});

  const workspace = await prisma.workspace.create({
    data: { name: 'Acme Corp Intelligence' },
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Shahriyar',
      email: 'shahriyar@zidio-loop.com',
      passwordHash,
      role: Role.ADMIN,
      workspaceId: workspace.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Harish',
      email: 'harish@zidio-loop.com',
      passwordHash,
      role: Role.ANALYST,
      workspaceId: workspace.id,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Nandini',
      email: 'nandini@zidio-loop.com',
      passwordHash,
      role: Role.VIEWER,
      workspaceId: workspace.id,
    },
  });

  const themeDefs = [
    { name: 'Onboarding & UX', description: 'User setup and navigation feedback.', color: '#6366f1' },
    { name: 'Performance & Latency', description: 'Page load speed and API responsiveness.', color: '#ef4444' },
    { name: 'Billing & Invoicing', description: 'Subscriptions, invoices, and pricing.', color: '#f59e0b' },
    { name: 'Integrations & API', description: 'Third-party connectors and API access.', color: '#10b981' },
    { name: 'Mobile App Experience', description: 'Tablet and smartphone layouts.', color: '#8b5cf6' },
    { name: 'Feature Requests', description: 'New capability suggestions.', color: '#06b6d4' },
  ];

  const themeMap = new Map<string, string>();
  for (const def of themeDefs) {
    const createdTheme = await prisma.theme.create({
      data: {
        name: def.name,
        description: def.description,
        color: def.color,
        workspaceId: workspace.id,
      },
    });
    themeMap.set(def.name, createdTheme.id);
  }

  const customerLabels = ['Enterprise Client', 'Free Tier User', 'Pro Subscriber', 'VIP Account', 'App Store Reviewer', 'Lead Prospect'];
  const now = new Date();
  let count = 0;

  for (let i = 0; i < 125; i++) {
    const baseSample = rawFeedbackSamples[i % rawFeedbackSamples.length];
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const createdDate = new Date(now.getTime() - (daysAgo * 86400000 + hoursAgo * 3600000));

    const content = i >= rawFeedbackSamples.length 
      ? `[Batch #${Math.floor(i / rawFeedbackSamples.length)}] ${baseSample.content}`
      : baseSample.content;

    const feedback = await prisma.feedback.create({
      data: {
        content,
        channel: baseSample.channel,
        sourceRef: `REF-${1000 + i}`,
        customerLabel: customerLabels[i % customerLabels.length],
        sentiment: baseSample.sentiment,
        sentimentScore: baseSample.score,
        featureArea: baseSample.area,
        rationale: `AI identified topic: ${baseSample.area}`,
        status: baseSample.status,
        createdAt: createdDate,
        workspaceId: workspace.id,
      },
    });

    const themeId = themeMap.get(baseSample.themeName);
    if (themeId) {
      await prisma.feedbackTheme.create({
        data: {
          feedbackId: feedback.id,
          themeId: themeId,
          confidence: 0.85 + Math.random() * 0.14,
        },
      });
    }

    const vectorData = generateVector(feedback.content);
    await prisma.embedding.create({
      data: {
        feedbackId: feedback.id,
        vector: JSON.stringify(vectorData),
      },
    });

    count++;
  }

  const sampleVoC = {
    summary: "Customer sentiment over the past 30 days shows high approval for UI modernization and integrations (+85% POS), but highlights growing friction in initial onboarding checklists and large CSV import timeouts.",
    metrics: { totalCount: count, negativePct: "24%", topSpike: "Performance & Latency (+35% WoW)" },
    topThemes: [
      { name: "Onboarding & UX", count: 30, sentiment: "Mixed" },
      { name: "Performance & Latency", count: 25, sentiment: "Negative" },
      { name: "Integrations & API", count: 25, sentiment: "Positive" }
    ],
    recommendedActions: [
      "Implement background queueing & web workers for CSV uploads exceeding 100 rows.",
      "Add interactive guided onboarding checklist for new Workspace Admins.",
      "Accelerate SSO / SAML authentication support for enterprise sales leads."
    ]
  };

  await prisma.report.create({
    data: {
      title: "Voice of Customer Digest — Monthly Executive Report",
      periodStart: new Date(now.getTime() - 30 * 86400000),
      periodEnd: now,
      contentJson: JSON.stringify(sampleVoC),
      workspaceId: workspace.id,
      generatedBy: admin.id,
    },
  });

  console.log(`✅ Successfully seeded ${count} Feedback items, users, themes, and VoC report!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
