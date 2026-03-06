// ============================================================
// CONTROLLER - Video CRUD + QR 생성 (Supabase Storage)
// ============================================================
import { PrismaClient } from "@prisma/client";
import QRCode from "qrcode";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { supabase, BUCKET } from "../lib/supabase.js";
import { generateUniqueCode } from "../utils/codeGenerator.js";

const prisma = new PrismaClient();

// ─────────────────────────────────────────
// [POST] /api/videos  → 동영상 업로드
// ─────────────────────────────────────────
export const uploadVideo = async (req, res, next) => {
  try {
    const { title, description, isPublic } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "동영상 파일이 필요합니다." });
    if (!title) return res.status(400).json({ error: "제목이 필요합니다." });

    // 고유 코드 생성
    const uniqueCode = await generateUniqueCode();

    // Supabase Storage에 업로드
    const ext = path.extname(file.originalname);
    const storagePath = `${uuidv4()}${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, file.buffer, { contentType: file.mimetype });

    if (uploadError) throw new Error(`Storage 업로드 실패: ${uploadError.message}`);

    // 공개 URL 조회
    const { data: { publicUrl: storageUrl } } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath);

    // QR이 인코딩할 프론트엔드 watch 페이지 URL
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const videoUrl = `${FRONTEND_URL}/watch/${uniqueCode}`;

    // DB 저장
    const video = await prisma.video.create({
      data: {
        uniqueCode,
        title,
        description: description || null,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        storagePath,
        storageUrl,
        videoUrl,
        isPublic: isPublic !== "false",
      },
    });

    res.status(201).json({
      message: "업로드 성공",
      data: video,
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// [GET] /api/videos  → 전체 목록 조회
// ─────────────────────────────────────────
export const getVideos = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      isPublic: true,
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: Number(limit),
        select: {
          id: true,
          uniqueCode: true,
          title: true,
          description: true,
          originalName: true,
          fileSize: true,
          storageUrl: true,
          videoUrl: true,
          viewCount: true,
          createdAt: true,
        },
      }),
      prisma.video.count({ where }),
    ]);

    res.json({
      data: videos.map(serializeVideo),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// [GET] /api/videos/:id  → ID로 단건 조회
// ─────────────────────────────────────────
export const getVideoById = async (req, res, next) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
    });
    if (!video) return res.status(404).json({ error: "동영상을 찾을 수 없습니다." });
    res.json({ data: serializeVideo(video) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// [GET] /api/videos/code/:code  → 고유번호로 조회 + 조회수 증가
// ─────────────────────────────────────────
export const getVideoByCode = async (req, res, next) => {
  try {
    const video = await prisma.video.findUnique({
      where: { uniqueCode: req.params.code.toUpperCase() },
    });
    if (!video) return res.status(404).json({ error: "해당 코드의 동영상이 없습니다." });

    // 조회수 증가
    const updated = await prisma.video.update({
      where: { id: video.id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({ data: serializeVideo(updated) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// [PATCH] /api/videos/:id  → 메타데이터 수정
// ─────────────────────────────────────────
export const updateVideo = async (req, res, next) => {
  try {
    const { title, description, isPublic } = req.body;

    const exists = await prisma.video.findUnique({ where: { id: req.params.id } });
    if (!exists) return res.status(404).json({ error: "동영상을 찾을 수 없습니다." });

    const video = await prisma.video.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic: Boolean(isPublic) }),
      },
    });

    res.json({ message: "수정 완료", data: serializeVideo(video) });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// [DELETE] /api/videos/:id  → 동영상 삭제
// ─────────────────────────────────────────
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    if (!video) return res.status(404).json({ error: "동영상을 찾을 수 없습니다." });

    // Supabase Storage에서 파일 삭제
    await supabase.storage.from(BUCKET).remove([video.storagePath]);

    await prisma.video.delete({ where: { id: req.params.id } });

    res.json({ message: "삭제 완료" });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// [GET] /api/videos/:id/qr  → QR 코드 재생성/조회
// ─────────────────────────────────────────
export const getQRCode = async (req, res, next) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    if (!video) return res.status(404).json({ error: "동영상을 찾을 수 없습니다." });

    // QR을 base64 Data URL로 응답 (클라이언트 직접 렌더링용)
    const qrDataUrl = await QRCode.toDataURL(video.videoUrl, { width: 300, margin: 2 });

    res.json({
      data: {
        uniqueCode: video.uniqueCode,
        videoUrl: video.videoUrl,
        qrDataUrl,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────
// Helper: BigInt 직렬화
// ─────────────────────────────────────────
