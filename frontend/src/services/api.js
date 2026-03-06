// ============================================================
// API SERVICE - 백엔드 통신 레이어
// ============================================================
const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const request = async (method, path, options = {}) => {
  const { body, params, isFormData } = options;

  let url = `${BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const headers = isFormData ? {} : { "Content-Type": "application/json" };
  const res = await fetch(url, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "요청 실패");
  return data;
};

// ─────────────────────────────────────────
// Video API
// ─────────────────────────────────────────

// 동영상 업로드 (FormData)
export const uploadVideo = (formData) =>
  request("POST", "/api/videos", { body: formData, isFormData: true });

// 목록 조회
export const getVideos = (params) =>
  request("GET", "/api/videos", { params });

// ID로 조회
export const getVideoById = (id) =>
  request("GET", `/api/videos/${id}`);

// 고유코드로 조회
export const getVideoByCode = (code) =>
  request("GET", `/api/videos/code/${code}`);

// QR 코드 조회
export const getQRCode = (id) =>
  request("GET", `/api/videos/${id}/qr`);

// 메타데이터 수정
export const updateVideo = (id, body) =>
  request("PATCH", `/api/videos/${id}`, { body });

// 삭제
export const deleteVideo = (id) =>
  request("DELETE", `/api/videos/${id}`);

