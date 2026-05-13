// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // استخراج التوكن الخاص بـ Better Auth (أو الـ Auth اللي بتستخدمه)
  // ملحوظة: Better Auth غالباً بيستخدم اسم "better-auth.session-token"
  const session =
    request.cookies.get("better-auth.session-token") ||
    request.cookies.get("auth-token");

  // 1. حماية لوحة تحكم الأدمن فقط
  // لو المستخدم بيحاول يدخل أي مسار يبدأ بـ /admin وهو مش مسجل
  if (pathname.startsWith("/admin") && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. السماح لصفحة الـ orderForm بالمرور للجميع
  // مش هنكتب لها شرط هنا، فبالتالي هتعمل NextResponse.next() تلقائياً

  return NextResponse.next();
}

// الـ matcher هنا بيحدد Next.js يشغل الميدل وير ده فين بالظبط
export const config = {
  matcher: [
    /*
     * مراقبة كل المسارات ما عدا:
     * 1. api (المسارات البرمجية)
     * 2. _next/static (ملفات الاستايل والجافاسكريبت)
     * 3. _next/image (الصور المحسنة)
     * 4. favicon.ico (أيقونة الموقع)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
