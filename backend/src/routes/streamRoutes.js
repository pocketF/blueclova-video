// ============================================================
// ROUTES - /stream  (동영상 스트리밍)
// ============================================================
//  GET /stream/:code   고유코드로 동영상 스트리밍
// ============================================================
import { Router } from "express";
import { streamByCode } from "../controllers/streamController.js";

const router = Router();

router.get("/:code", streamByCode);

export default router;
