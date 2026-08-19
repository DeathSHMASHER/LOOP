import { Router } from "express";
import { prisma } from "../config/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const workspaceId = "demo-workspace";

    const [
      totalFeedback,
      positive,
      neutral,
      negative,
      recentFeedback,
      themeGroups,
      channelGroups,
      newCount,
      reviewedCount,
      actionedCount,
    ] = await Promise.all([
      // Total feedback
      prisma.feedback.count({
        where: { workspaceId },
      }),

      // Positive feedback
      prisma.feedback.count({
        where: {
          workspaceId,
          sentiment: "POS",
        },
      }),

      // Neutral feedback
      prisma.feedback.count({
        where: {
          workspaceId,
          sentiment: "NEU",
        },
      }),

      // Negative feedback
      prisma.feedback.count({
        where: {
          workspaceId,
          sentiment: "NEG",
        },
      }),

      // Recent feedback
      prisma.feedback.findMany({
        where: { workspaceId },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        include: {
          themes: {
            include: {
              theme: true,
            },
          },
        },
      }),

      // Theme analytics
      prisma.feedbackTheme.groupBy({
        by: ["themeId"],
        where: {
          feedback: {
            workspaceId,
          },
        },
        _count: {
          feedbackId: true,
        },
        _avg: {
          confidence: true,
        },
      }),

      // Channel analytics
      prisma.feedback.groupBy({
        by: ["channel"],
        where: {
          workspaceId,
        },
        _count: {
          id: true,
        },
      }),

      // NEW feedback
      prisma.feedback.count({
        where: {
          workspaceId,
          status: "NEW",
        },
      }),

      // REVIEWED feedback
      prisma.feedback.count({
        where: {
          workspaceId,
          status: "REVIEWED",
        },
      }),

      // ACTIONED feedback
      prisma.feedback.count({
        where: {
          workspaceId,
          status: "ACTIONED",
        },
      }),
    ]);

    // Get theme information
    const themeIds = themeGroups.map((group) => group.themeId);

    const themes = await prisma.theme.findMany({
      where: {
        id: {
          in: themeIds,
        },
      },
    });

    const topThemes = themeGroups
      .map((group) => {
        const theme = themes.find(
          (item) => item.id === group.themeId
        );

        return {
          id: group.themeId,
          name: theme?.name ?? "Unknown",
          count: group._count.feedbackId,
          confidence: group._avg.confidence,
        };
      })
      .sort((a, b) => b.count - a.count);

    // Convert channel groups into an object
    const channels = Object.fromEntries(
      channelGroups.map((group) => [
        group.channel,
        group._count.id,
      ])
    );

    res.json({
      totalFeedback,

      sentiment: {
        positive,
        neutral,
        negative,
      },

      topThemes,

      channels,

      status: {
        new: newCount,
        reviewed: reviewedCount,
        actioned: actionedCount,
      },

      recentFeedback,
    });
  } catch (error) {
    console.error("Failed to load dashboard:", error);

    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
});

export default router;