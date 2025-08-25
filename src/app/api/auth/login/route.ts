import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { SecurityLogger } from '../../../../lib/security-logger';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const ip = req.ip || 'unknown';
    
    // تأكد من وجود المتغيرات البيئية
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;
    
    if (!ADMIN_EMAIL || !ADMIN_PASS) {
      SecurityLogger.logSuspiciousActivity(ip, 'Server configuration error', { email });
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      // إنشاء session ID عشوائي
      const sessionId = crypto.randomBytes(32).toString('hex');
      
      SecurityLogger.logAdminAction(email, 'login');
      
      const res = NextResponse.json({ ok: true });
      res.cookies.set('admin_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 8,
      });
      return res;
    }
    
    SecurityLogger.logFailedLogin(ip, email, 'Invalid credentials');
    return NextResponse.json({ error: 'بيانات الدخول غير صحيحة' }, { status: 401 });
  } catch (e) {
    const ip = req.ip || 'unknown';
    SecurityLogger.logSuspiciousActivity(ip, 'Login request error', { error: e });
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}


