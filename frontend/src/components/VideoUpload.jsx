// ============================================================
// COMPONENT - 동영상 업로드 폼
// ============================================================
import { useState, useRef } from "react";
import { uploadVideo } from "../services/api";

export default function VideoUpload({ onSuccess }) {
  const [form, setForm] = useState({ title: "", description: "", isPublic: true });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 500 * 1024 * 1024) {
      setError("500MB 이하 파일만 업로드 가능합니다.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError("동영상 파일을 선택해 주세요.");
    if (!form.title.trim()) return setError("제목을 입력해 주세요.");

    const fd = new FormData();
    fd.append("video", file);
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("isPublic", form.isPublic);

    try {
      setLoading(true);
      setError("");
      // XMLHttpRequest로 진행률 표시
      const result = await uploadWithProgress(fd, setProgress);
      onSuccess?.(result.data);
      setForm({ title: "", description: "", isPublic: true });
      setFile(null);
      setProgress(0);
      fileRef.current.value = "";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800">동영상 업로드</h2>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">{error}</div>
      )}

      {/* 파일 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">동영상 파일 *</label>
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska"
          onChange={handleFile}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0 file:font-medium
            file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {file && (
          <p className="mt-1 text-xs text-gray-500">
            {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
          </p>
        )}
      </div>

      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="동영상 제목 입력"
          maxLength={100}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 설명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="동영상 설명 (선택)"
          rows={3}
          maxLength={500}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* 공개 여부 */}
      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isPublic}
          onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
          className="w-4 h-4 accent-blue-600"
        />
        공개 동영상
      </label>

      {/* 진행률 */}
      {loading && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>업로드 중...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
          hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "업로드 중..." : "업로드"}
      </button>
    </form>
  );
}

// XMLHttpRequest 기반 업로드 (진행률 추적)
function uploadWithProgress(formData, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/videos`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error || "업로드 실패"));
    };
    xhr.onerror = () => reject(new Error("네트워크 오류"));
    xhr.send(formData);
  });
}
