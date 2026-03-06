// ============================================================
// COMPONENT - QR 코드 + 고유번호 표시
// ============================================================
import { useState } from "react";
import { getQRCode } from "../services/api";

export default function QRCodeDisplay({ video }) {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadQR = async () => {
    if (qrData) return;
    try {
      setLoading(true);
      const res = await getQRCode(video.id);
      setQrData(res.data);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(video.uniqueCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const a = document.createElement("a");
    a.href = qrData.qrDataUrl;
    a.download = `qr_${video.uniqueCode}.png`;
    a.click();
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 text-center space-y-3">
      {/* 고유번호 */}
      <div>
        <p className="text-xs text-gray-500 mb-1">고유번호</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl font-mono font-bold tracking-widest text-blue-700">
            {video.uniqueCode}
          </span>
          <button
            onClick={copyCode}
            className="text-xs text-gray-400 hover:text-blue-600 border border-gray-300
              rounded px-2 py-0.5 transition"
          >
            {copied ? "복사됨!" : "복사"}
          </button>
        </div>
      </div>

      {/* QR 코드 */}
      {!qrData ? (
        <button
          onClick={loadQR}
          disabled={loading}
          className="text-sm text-blue-600 underline hover:text-blue-800 disabled:opacity-50"
        >
          {loading ? "QR 로딩 중..." : "QR 코드 보기"}
        </button>
      ) : (
        <div className="space-y-2">
          <img
            src={qrData.qrDataUrl}
            alt={`QR Code for ${video.uniqueCode}`}
            className="mx-auto w-36 h-36 rounded"
          />
          <p className="text-xs text-gray-400 break-all">{qrData.videoUrl}</p>
          <button
            onClick={downloadQR}
            className="text-xs text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded"
          >
            QR 다운로드
          </button>
        </div>
      )}
    </div>
  );
}
