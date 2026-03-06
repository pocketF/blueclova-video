// ============================================================
// BACKEND ENTRY POINT - Express Application
// ============================================================
import express from "express";
import cors from "cors";
import videoRoutes from "./routes/videoRoutes.js";
import streamRoutes from "./routes/streamRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// ─────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://blueclova.com",
  "https://www.blueclova.com",
];
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
// Routes
// ─────────────────────────────────────────
app.use("/api/videos", videoRoutes);  // CRUD + QR 생성
app.use("/stream", streamRoutes);     // 동영상 스트리밍

// ─────────────────────────────────────────
// Health Check
// ─────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
