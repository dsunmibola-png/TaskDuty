import express from "express";
import type { ErrorRequestHandler } from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskDuty API is running",
  });
});

app.use("/api/auth", authRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error.code === 11000) {
    res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
    return;
  }

  if (error.type === "entity.parse.failed") {
    res.status(400).json({
      success: false,
      message: "Request body must contain valid JSON.",
    });
    return;
  }

  if (error.type === "entity.too.large") {
    res.status(413).json({
      success: false,
      message: "Request body is too large.",
    });
    return;
  }

  if (error.name === "ValidationError") {
    res.status(400).json({
      success: false,
      message: "Some fields contain invalid values.",
    });
    return;
  }

  console.error("Request failed:", error.name);

  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again.",
  });
};

app.use(errorHandler);

export default app;