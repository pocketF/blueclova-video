// ============================================================
// PAGE - 업로드
// ============================================================
import { useNavigate } from "react-router-dom";
import VideoUpload from "../components/VideoUpload";

export default function Upload() {
  const navigate = useNavigate();

  const handleSuccess = (video) => {
    navigate("/upload/result", { state: { video } });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">동영상 업로드</h1>
      <VideoUpload onSuccess={handleSuccess} />
    </div>
  );
}
