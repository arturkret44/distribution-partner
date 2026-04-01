import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
// 🟢 allow public assets (images, etc.)
if (pathname.match(/\.(jpg|jpeg|png|svg|webp)$/)) {
  return response;
}

  // 🔓 public routes
if (
  pathname === '/' ||
  pathname.startsWith('/about') ||
  pathname.startsWith('/contact') ||
  pathname.startsWith('/announcements') ||
  pathname.startsWith('/for-') ||
  pathname.startsWith('/privacy') ||
  pathname.startsWith('/terms') ||
  pathname.startsWith('/login') ||
  pathname.startsWith('/register') ||
  pathname.startsWith('/waiting')
) {
  return response;
}

  // 🔒 brak sesji → login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ zalogowany → dalej NIC NIE SPRAWDZAMY
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
