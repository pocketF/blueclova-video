// ============================================================
// COMPONENT - 고유번호 입력으로 동영상 찾기
// ============================================================
import { useState } from "react";
import { getVideoByCode } from "../services/api";

export default function CodeInput({ onFound }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) return setError("고유번호는 6자리입니다.");

    try {
      setLoading(true);
      setError("");
      const res = await getVideoByCode(trimmed);
      onFound?.(res.data);
      setCode("");
    } catch (err) {
      setError("해당 번호의 동영상을 찾을 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    // 영숫자만, 최대 6자
    const val = e.target.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6);
    setCode(val);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
      <p className="text-sm text-gray-600">고유번호로 동영상 재생</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={handleChange}
          placeholder="예: AB3X9Z"
          maxLength={6}
          className="font-mono text-center text-xl tracking-[0.3em] uppercase
            w-44 border-2 border-gray-300 rounded-lg px-3 py-2
            focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium
            hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {loading ? "..." : "재생"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
