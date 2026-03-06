// ============================================================
// PAGE - /watch/:code  (QR 코드 스캔 시 랜딩 페이지)
// ============================================================
// QR 코드 → 이 URL로 접속 → 자동으로 동영상 로드 후 재생
// ============================================================
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideoByCode } from "../services/api";
import VideoPlayer from "../components/VideoPlayer";

export default function Watch() {
  const { code } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getVideoByCode(code);
        setVideo(res.data);
      } catch {
        setError("해당 코드의 동영상을 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
        불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-5xl">🎬</div>
        <h2 className="text-xl font-bold text-gray-800">동영상을 찾을 수 없습니다</h2>
        <p className="text-gray-500 text-sm">{error}</p>
        <p className="font-mono bg-gray-100 rounded px-3 py-1 inline-block text-sm">{code}</p>
        <a href="/" className="block text-blue-600 underline text-sm">홈으로 돌아가기</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <VideoPlayer video={video} />
    </div>
  );
}
