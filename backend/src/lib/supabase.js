// ============================================================
// Supabase 클라이언트 (서버용 - service_role key 사용)
// ============================================================
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL 또는 SUPABASE_SERVICE_KEY 환경변수가 설정되지 않았습니다.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// 버킷명 상수
export const BUCKET = "videos";
