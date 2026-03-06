// ============================================================
// APP - 라우팅 + 레이아웃
// ============================================================
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import UploadResult from "./pages/UploadResult";
import Watch from "./pages/Watch";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to="/" className="text-lg font-bold text-blue-600 tracking-tight">
              Pocketflower Code
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
                }
              >
                목록
              </NavLink>
              <NavLink
                to="/upload"
                className={({ isActive }) =>
                  isActive
                    ? "bg-blue-600 text-white px-4 py-1.5 rounded-lg"
                    : "bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
                }
              >
                업로드
              </NavLink>
            </nav>
          </div>
        </header>

        {/* 본문 */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload/result" element={<UploadResult />} />
            <Route path="/watch/:code" element={<Watch />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
