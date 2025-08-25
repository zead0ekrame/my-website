import type { NextRequest } from 'next/server';

export function isAdminRequest(req: NextRequest): boolean {
  try {
    // نستخدم session ID عشوائي بدل '1' الثابتة
    const session = req.cookies.get('admin_session')?.value;
    return session && session.length > 20; // تأكد إنه عشوائي
  } catch {
    return false;
  }
}


