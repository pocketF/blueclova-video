// ============================================================
// COMPONENT - 동영상 카드 (목록용)
// ============================================================
import { useState } from "react";
import { deleteVideo } from "../services/api";
import QRCodeDisplay from "./QRCodeDisplay";

export default function VideoCard({ video, onDelete, onPlay }) {
  const [showQR, setShowQR] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`"${video.title}" 을(를) 삭제하시겠습니까?`)) return;
    try {
      setDeleting(true);
      await deleteVideo(video.id);
      onDelete?.(video.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
      {/* 썸네일 영역 (클릭 → 재생) */}
      <button
        onClick={() => onPlay?.(video)}
        className="w-full bg-gray-900 aspect-video flex items-center justify-center
          hover:bg-gray-700 transition group"
      >
        <svg
          className="w-12 h-12 text-white opacity-60 group-hover:opacity-100 transition"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <div className="p-4 space-y-3">
        {/* 제목 */}
        <div>
          <h3
            className="font-semibold text-gray-900 text-sm truncate cursor-pointer hover:text-blue-600"
            onClick={() => onPlay?.(video)}
          >
            {video.title}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            조회수 {video.viewCount?.toLocaleString()}회 •{" "}
            {new Date(video.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>

        {/* 고유번호 */}
        <div className="font-mono text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded text-center tracking-widest">
          {video.uniqueCode}
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowQR((v) => !v)}
            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1
              hover:bg-gray-50 transition"
          >
            {showQR ? "QR 숨기기" : "QR 보기"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-red-500 border border-red-200 rounded px-2 py-1
              hover:bg-red-50 transition disabled:opacity-50"
          >
            {deleting ? "삭제 중" : "삭제"}
          </button>
        </div>

        {showQR && <QRCodeDisplay video={video} />}
      </div>
    </div>
  );
}
