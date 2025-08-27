import { NextRequest, NextResponse } from 'next/server';
import { defaultIntentDetector } from '@/lib/simple-intent-detector';

interface ChatRequest {
  message: string;
  sender_id?: string;
  session_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, sender_id, session_id } = body;

    if (!message) {
      return NextResponse.json({ error: 'الرسالة مطلوبة' }, { status: 400 });
    }

    // إعداد معرف المستخدم
    const userId = sender_id || `user_${Date.now()}`;

    // استخدام Intent Detector
    const intentResult = defaultIntentDetector.detectIntent(message);
    
    // الحصول على الرد المناسب
    let response: string;
    let shouldUseLangChain = false;

    if (intentResult.shouldUseLangChain) {
      // استخدام LangChain للأسئلة المعقدة
      response = `أرى إن سؤالك يحتاج تفصيل أكثر. سأستخدم الذكاء الاصطناعي لإعطائك إجابة شاملة...\n\nسؤالك: ${message}\n\nالنية المكتشفة: ${intentResult.intent} (ثقة: ${Math.round(intentResult.confidence * 100)}%)`;
      shouldUseLangChain = true;
    } else {
      // استخدام الرد المباشر
      response = defaultIntentDetector.getResponseForIntent(intentResult.intent, intentResult.entities);
      shouldUseLangChain = false;
    }

    return NextResponse.json({
      success: true,
      response: response,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      entities: intentResult.entities,
      shouldUseLangChain: shouldUseLangChain,
      sender_id: userId,
      session_id: session_id || `session_${Date.now()}`
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'حدث خطأ في معالجة الرسالة',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}
