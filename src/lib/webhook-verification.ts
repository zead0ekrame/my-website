import crypto from 'crypto';

export function verifyWebhook(body: string, signature: string, appSecret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', appSecret)
      .update(body, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('Webhook verification error:', error);
    return false;
  }
}

export function verifyWhatsAppWebhook(body: string, signature: string): boolean {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  if (!appSecret) {
    console.error('WHATSAPP_APP_SECRET not configured');
    return false;
  }
  
  return verifyWebhook(body, signature, appSecret);
}

export function verifyFacebookWebhook(body: string, signature: string): boolean {
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  if (!appSecret) {
    console.error('FACEBOOK_APP_SECRET not configured');
    return false;
  }
  
  return verifyWebhook(body, signature, appSecret);
}
