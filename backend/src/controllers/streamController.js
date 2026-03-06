// ============================================================
// CONTROLLER - 스트리밍 (Supabase CDN으로 redirect)
// ============================================================
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// [GET] /stream/:code  → Supabase Storage 공개 URL로 redirect
export const streamByCode = async (req, res, next) => {
  try {
    const video = await prisma.video.findUnique({
      where: { uniqueCode: req.params.code.toUpperCase() },
    });
    if (!video) return res.status(404).json({ error: "동영상을 찾을 수 없습니다." });

    // 조회수 증가 (비동기)
    prisma.video.update({
      where: { id: video.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    res.redirect(301, video.storageUrl);
  } catch (err) {
    next(err);
  }
};
