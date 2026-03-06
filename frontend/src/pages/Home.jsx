// ============================================================
// PAGE - 홈 (목록 + 검색 + 코드 입력)
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { getVideos } from "../services/api";
import VideoCard from "../components/VideoCard";
import CodeInput from "../components/CodeInput";
import VideoPlayer from "../components/VideoPlayer";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null); // 현재 재생 중인 영상

  const fetchVideos = useCallback(async (page = 1, q = search) => {
    try {
      setLoading(true);
      const res = await getVideos({ page, limit: 12, search: q || undefined });
      setVideos(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchVideos(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    fetchVideos(1, searchInput);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* 코드 입력 */}
      <section className="bg-white rounded-xl shadow p-6 text-center">
        <CodeInput onFound={setActiveVideo} />
      </section>

      {/* 재생 중인 동영상 */}
      {activeVideo && (
        <section>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">지금 재생 중</h2>
            <button
              onClick={() => setActiveVideo(null)}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              닫기
            </button>
          </div>
          <VideoPlayer video={activeVideo} />
        </section>
      )}

      {/* 검색 */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="동영상 제목 검색..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-gray-800 text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
        >
          검색
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearchInput(""); setSearch(""); fetchVideos(1, ""); }}
            className="text-sm text-gray-400 hover:text-gray-600 px-2"
          >
            초기화
          </button>
        )}
      </form>

      {/* 목록 */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">불러오는 중...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 text-gray-400">동영상이 없습니다.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {videos.map((v) => (
              <VideoCard
                key={v.id}
                video={v}
                onPlay={setActiveVideo}
                onDelete={(id) => setVideos((prev) => prev.filter((x) => x.id !== id))}
              />
            ))}
          </div>

          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchVideos(p)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition
                    ${p === pagination.page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
