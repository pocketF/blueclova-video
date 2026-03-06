// ============================================================
// COMPONENT - 동영상 플레이어
// ============================================================
import { useRef, useState } from "react";
import QRCodeDisplay from "./QRCodeDisplay";

export default function VideoPlayer({ video }) {
  const videoRef = useRef();
  const [error, setError] = useState(false);

  if (!video) return null;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* 플레이어 */}
      <div className="bg-black aspect-video">
        {error ? (
          <div className="flex items-center justify-center h-full text-white text-sm">
            동영상을 불러올 수 없습니다.
          </div>
        ) : (
          <video
            ref={videoRef}
            src={video.storageUrl}
            controls
            controlsList="nodownload"
            className="w-full h-full"
            onError={() => setError(true)}
          >
            브라우저가 동영상을 지원하지 않습니다.
          </video>
        )}
      </div>

      {/* 정보 */}
      <div className="p-5 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{video.title}</h1>
          <p className="text-sm text-gray-400 mt-1">
            조회수 {video.viewCount?.toLocaleString()}회 •{" "}
            {new Date(video.createdAt).toLocaleDateString("ko-KR")}
          </p>
        </div>

        {video.description && (
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{video.description}</p>
        )}

        <hr className="border-gray-100" />

        {/* QR 코드 + 고유번호 */}
        <QRCodeDisplay video={video} />
      </div>
    </div>
  );
}
