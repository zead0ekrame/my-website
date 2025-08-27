import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@/lib/webhook-verification';

interface WebhookMessage {
  sender: {
    id: string;
  };
  message: {
    text: string;
    timestamp: number;
  };
  postback?: {
    payload: string;
  };
}

interface WebhookRequest {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    messaging: WebhookMessage[];
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: WebhookRequest = await request.json();
    
    // التحقق من نوع Webhook
    if (body.object !== 'page' && body.object !== 'whatsapp_business_account') {
      return NextResponse.json({ error: 'نوع webhook غير مدعوم' }, { status: 400 });
    }

    // معالجة الرسائل
    for (const entry of body.entry) {
      for (const messaging of entry.messaging) {
        const { sender, message, postback } = messaging;
        
        if (message?.text || postback?.payload) {
          const text = message?.text || postback?.payload;
          
          // إرسال إلى Rasa
          try {
            const rasaResponse = await fetch(`${process.env.RASA_WEBHOOK_URL || 'http://localhost:5005/webhooks/rest/webhook'}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                sender_id: sender.id,
                message: text,
                timestamp: message?.timestamp || Date.now()
              }),
            });

            if (rasaResponse.ok) {
              const rasaData = await rasaResponse.json();
              
              // إرسال الرد إلى المستخدم عبر Facebook/WhatsApp API
              if (rasaData && rasaData.length > 0) {
                await sendResponseToUser(sender.id, rasaData[0].text, body.object);
              }
            }
          } catch (error) {
            console.error('Error processing message with Rasa:', error);
          }
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في معالجة Webhook' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Webhook verification for Facebook/WhatsApp
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge);
  }

  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

async function sendResponseToUser(userId: string, message: string, platform: string) {
  try {
    if (platform === 'page') {
      // Facebook Messenger
      await fetch(`https://graph.facebook.com/v18.0/me/messages?access_token=${process.env.FACEBOOK_PAGE_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: { id: userId },
          message: { text: message }
        }),
      });
    } else if (platform === 'whatsapp_business_account') {
      // WhatsApp Business
      await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages?access_token=${process.env.WHATSAPP_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: userId,
          type: 'text',
          text: { body: message }
        }),
      });
    }
  } catch (error) {
    console.error('Error sending response to user:', error);
  }
}
