// ============================================================
// PAGE - 업로드 결과 (/upload/result)
// 업로드 성공 후 navigate({ state: { video } })로 이동
// ============================================================
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import QRCodeDisplay from "../components/QRCodeDisplay";

export default function UploadResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const video = state?.video;

  // 직접 URL 접근 시 업로드 페이지로 리다이렉트
  useEffect(() => {
    if (!video) navigate("/upload", { replace: true });
  }, [video, navigate]);

  if (!video) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* 성공 배너 */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">업로드 완료!</h1>
        <p className="text-gray-500 text-sm">동영상이 성공적으로 저장되었습니다.</p>
      </div>

      {/* 동영상 정보 */}
      <div className="bg-white rounded-xl shadow divide-y divide-gray-100">
        <div className="px-5 py-4 space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">동영상 정보</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">제목</span>
              <span className="font-medium text-gray-900 text-right max-w-xs truncate">{video.title}</span>
            </div>
            {video.description && (
              <div className="flex justify-between">
                <span className="text-gray-500">설명</span>
                <span className="text-gray-700 text-right max-w-xs">{video.description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">파일 크기</span>
              <span className="text-gray-700">{(video.fileSize / 1024 / 1024).toFixed(1)} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">공개 여부</span>
              <span className={video.isPublic ? "text-green-600" : "text-gray-500"}>
                {video.isPublic ? "공개" : "비공개"}
              </span>
            </div>
          </div>
        </div>

        {/* 접근 URL */}
        <div className="px-5 py-4 space-y-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">접근 URL</h2>
          <a
            href={video.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="block text-sm text-blue-600 underline break-all hover:text-blue-800"
          >
            {video.videoUrl}
          </a>
        </div>

        {/* QR 코드 + 고유번호 */}
        <div className="px-5 py-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">QR 코드 / 고유번호</h2>
          <QRCodeDisplay video={video} />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/upload")}
          className="bg-blue-600 text-white rounded-lg px-8 py-2.5 text-sm
            font-medium hover:bg-blue-700 transition"
        >
          다시 업로드
        </button>
      </div>
    </div>
  );
}
