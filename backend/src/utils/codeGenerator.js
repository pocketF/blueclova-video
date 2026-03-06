// ============================================================
// UTIL - 고유 코드 생성기
// ============================================================
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 6자리 영숫자 대문자 코드 생성
const generateCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 혼동 문자(0,O,1,I) 제외
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

// DB 중복 체크 후 유니크한 코드 반환
export const generateUniqueCode = async () => {
  let code;
  let exists = true;
  while (exists) {
    code = generateCode();
    const found = await prisma.video.findUnique({ where: { uniqueCode: code } });
    exists = !!found;
  }
  return code;
};
