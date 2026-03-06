// ============================================================
// MIDDLEWARE - Multer 파일 업로드 설정 (메모리 버퍼 → Supabase Storage)
// ============================================================
import multer from "multer";

// 디스크에 저장하지 않고 메모리 버퍼로 유지
const storage = multer.memoryStorage();

// ─────────────────────────────────────────
// 파일 필터 (동영상만 허용)
// ─────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const ALLOWED_MIME = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
    "video/x-matroska",
  ];
  if (ALLOWED_MIME.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("동영상 파일만 업로드 가능합니다 (mp4, webm, ogg, mov, mkv)"), false);
  }
};

// ─────────────────────────────────────────
// Multer 인스턴스 (최대 500MB)
// ─────────────────────────────────────────
export const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 },
}).single("video");

// 미들웨어 래퍼 (에러를 next로 전달)
export const handleUpload = (req, res, next) => {
  uploadVideo(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE")
        return next({ status: 400, message: "파일 크기는 500MB를 초과할 수 없습니다." });
      return next({ status: 400, message: err.message });
    }
    if (err) return next({ status: 400, message: err.message });
    next();
  });
};
