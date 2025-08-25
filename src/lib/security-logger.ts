export class SecurityLogger {
  static logFailedLogin(ip: string, email: string, reason: string) {
    console.warn(`[SECURITY] Failed login attempt from ${ip} for ${email}: ${reason}`);
    // هنا يمكن إضافة إرسال للـ admin أو حفظ في قاعدة البيانات
  }

  static logSuspiciousActivity(ip: string, action: string, details: any) {
    console.warn(`[SECURITY] Suspicious activity from ${ip}: ${action}`, details);
  }

  static logRateLimitExceeded(ip: string, endpoint: string) {
    console.warn(`[SECURITY] Rate limit exceeded from ${ip} on ${endpoint}`);
  }

  static logAdminAction(adminEmail: string, action: string, target?: string) {
    console.info(`[ADMIN] ${adminEmail} performed ${action}${target ? ` on ${target}` : ''}`);
  }
}
