import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting بسيط
const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function middleware(request: NextRequest) {
  const isAdmin = request.cookies.get('admin_session')?.value;
  const url = new URL(request.url);
  const ip = request.ip || 'unknown';

  // Rate limiting للـ API
  if (url.pathname.startsWith('/api/')) {
    const now = Date.now();
    const limit = 100; // 100 طلب
    const windowMs = 60000; // في الدقيقة
    
    const record = rateLimit.get(ip);
    
    if (!record || now > record.resetTime) {
      rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    } else if (record.count >= limit) {
      console.warn(`[SECURITY] Rate limit exceeded from ${ip} on ${url.pathname}`);
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    } else {
      record.count++;
    }
  }

  // حماية صفحة الأدمن
  if (url.pathname.startsWith('/admin') && !isAdmin) {
    console.warn(`[SECURITY] Unauthorized access attempt to ${url.pathname} from ${ip}`);
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};


