import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma.js";
import feedbackRouter from "./routes/feedback.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "LOOP Backend API is running 🚀",
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
      service: "LOOP Backend",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/feedback", feedbackRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(PORT, () => {
  console.log(`LOOP backend running on http://localhost:${PORT}`);
});