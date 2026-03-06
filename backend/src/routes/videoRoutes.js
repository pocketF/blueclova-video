// ============================================================
// ROUTES - /api/videos
// ============================================================
//  POST   /api/videos              동영상 업로드 + QR 생성
//  GET    /api/videos              전체 목록 (페이징, 검색)
//  GET    /api/videos/code/:code   고유번호로 조회
//  GET    /api/videos/:id          ID로 단건 조회
//  GET    /api/videos/:id/qr       QR 코드 조회 (base64)
//  PATCH  /api/videos/:id          메타데이터 수정
//  DELETE /api/videos/:id          삭제
// ============================================================
import { Router } from "express";
import { handleUpload } from "../middleware/upload.js";
import {
  uploadVideo,
  getVideos,
  getVideoById,
  getVideoByCode,
  updateVideo,
  deleteVideo,
  getQRCode,
} from "../controllers/videoController.js";

const router = Router();

router.post("/", handleUpload, uploadVideo);
router.get("/", getVideos);
router.get("/code/:code", getVideoByCode);   // ← :code 먼저 (/:id보다 앞에 위치)
router.get("/:id", getVideoById);
router.get("/:id/qr", getQRCode);
router.patch("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;
