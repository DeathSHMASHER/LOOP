import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { analyzeFeedback } from "../services/ai.service.js";

const router = Router();

// GET /api/feedback
router.get("/", async (req, res) => {
  try {
    const { channel, status, sentiment } = req.query;

    const feedback = await prisma.feedback.findMany({
      where: {
        workspaceId: "demo-workspace",

        ...(channel
          ? { channel: String(channel) }
          : {}),

        ...(status
          ? { status: status as "NEW" | "REVIEWED" | "ACTIONED" }
          : {}),

        ...(sentiment
          ? { sentiment: sentiment as "POS" | "NEU" | "NEG" }
          : {}),
      },

      include: {
        themes: {
          include: {
            theme: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(feedback);
  } catch (error) {
    console.error("Failed to fetch feedback:", error);

    res.status(500).json({
      error: "Failed to fetch feedback",
    });
  }
});

// POST /api/feedback
router.post("/", async (req, res) => {
  try {
    const { content, channel, sourceRef, customerLabel } = req.body;

    if (!content || !channel) {
      return res.status(400).json({
        error: "content and channel are required",
      });
    }

    const analysis = await analyzeFeedback(content);

    const feedback = await prisma.feedback.create({
      data: {
        content,
        channel,
        sourceRef,
        customerLabel,
        sentiment: analysis.sentiment,
        sentimentScore: analysis.sentimentScore,
        status: "NEW",
        workspaceId: "demo-workspace",
      },
    });

    for (const themeData of analysis.themes) {
      const theme = await prisma.theme.upsert({
        where: {
          workspaceId_name: {
            workspaceId: "demo-workspace",
            name: themeData.name,
          },
        },
        update: {},
        create: {
          name: themeData.name,
          workspaceId: "demo-workspace",
        },
      });

      await prisma.feedbackTheme.create({
        data: {
          feedbackId: feedback.id,
          themeId: theme.id,
          confidence: themeData.confidence,
        },
      });
    }

    const result = await prisma.feedback.findUnique({
      where: {
        id: feedback.id,
      },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Failed to create feedback:", error);

    res.status(500).json({
      error: "Failed to create feedback",
    });
  }
});

// POST /api/feedback/:id/analyze
router.post("/:id/analyze", async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await prisma.feedback.findFirst({
      where: {
        id,
        workspaceId: "demo-workspace",
      },
    });

    if (!feedback) {
      return res.status(404).json({
        error: "Feedback not found",
      });
    }

    const analysis = await analyzeFeedback(feedback.content);

    const updatedFeedback = await prisma.feedback.update({
      where: {
        id: feedback.id,
      },
      data: {
        sentiment: analysis.sentiment,
        sentimentScore: analysis.sentimentScore,
      },
    });

    // Remove old theme relationships before adding fresh analysis
    await prisma.feedbackTheme.deleteMany({
      where: {
        feedbackId: feedback.id,
      },
    });

    for (const themeData of analysis.themes) {
      const theme = await prisma.theme.upsert({
        where: {
          workspaceId_name: {
            workspaceId: "demo-workspace",
            name: themeData.name,
          },
        },
        update: {},
        create: {
          name: themeData.name,
          workspaceId: "demo-workspace",
        },
      });

      await prisma.feedbackTheme.create({
        data: {
          feedbackId: feedback.id,
          themeId: theme.id,
          confidence: themeData.confidence,
        },
      });
    }

    const result = await prisma.feedback.findUnique({
      where: {
        id: updatedFeedback.id,
      },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    res.json(result);
  } catch (error) {
    console.error("Failed to analyze feedback:", error);

    res.status(500).json({
      error: "Failed to analyze feedback",
    });
  }
});
// PATCH /api/feedback/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["NEW", "REVIEWED", "ACTIONED"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid status",
        allowedStatuses: validStatuses,
      });
    }

    const feedback = await prisma.feedback.findFirst({
      where: {
        id,
        workspaceId: "demo-workspace",
      },
    });

    if (!feedback) {
      return res.status(404).json({
        error: "Feedback not found",
      });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: {
        id,
      },
      data: {
        status: status as "NEW" | "REVIEWED" | "ACTIONED",
      },
      include: {
        themes: {
          include: {
            theme: true,
          },
        },
      },
    });

    res.json(updatedFeedback);
  } catch (error) {
    console.error("Failed to update feedback status:", error);

    res.status(500).json({
      error: "Failed to update feedback status",
    });
  }
});

export default router;