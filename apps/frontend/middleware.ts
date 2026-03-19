import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('devnote_access_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Nếu người dùng ĐÃ đăng nhập (có token)
  if (token) {
    // Nếu vào các trang auth (/login, /register) hoặc trang chủ (/), đá về /notes
    if (pathname === '/login' || pathname === '/register' || pathname === '/') {
      return NextResponse.redirect(new URL('/notes', request.url));
    }
  } 
  
  // 2. Nếu người dùng CHƯA đăng nhập (không có token)
  if (!token) {
    // Các trang bảo mật cần đăng nhập mới vào được
    const protectedPaths = ['/notes', '/settings', '/profile'];
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

    // Nếu vào trang chủ (/) hoặc trang bảo mật thì đá ra trang /login
    if (isProtectedPath || pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}


// Cấu hình các đường dẫn mà Middleware sẽ chạy qua
export const config = {
  matcher: [
    /*
     * Khớp với tất cả các đường dẫn trừ:
     * - api (các tuyến API)
     * - _next/static (tệp tĩnh)
     * - _next/image (tối ưu hóa hình ảnh)
     * - favicon.ico (tệp favicon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
