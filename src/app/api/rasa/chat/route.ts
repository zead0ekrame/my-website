import { NextRequest, NextResponse } from 'next/server';
import { ChatAPI, ChatSession } from '@/lib/chat-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // إنشاء جلسة محادثة أو استخدام الموجودة
    let chatSession: ChatSession = {
      id: sessionId || `session_${Date.now()}`,
      tenantId: 'default',
      projectId: 'default',
      channel: 'web',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // إضافة رسالة المستخدم للجلسة
    chatSession.messages.push({
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      metadata: {}
    });

    // معالجة الرسالة
    const chatAPI = new ChatAPI();
    const result = await chatAPI.processMessage(message, chatSession);

    // إضافة رد البوت للجلسة
    chatSession.messages.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: result.message,
      timestamp: new Date(),
      metadata: {
        intent: result.intent,
        confidence: result.confidence,
        source: result.metadata?.source
      }
    });

    // تحديث وقت الجلسة
    chatSession.updatedAt = new Date();

    // الحصول على الذاكرة
    const memory = chatAPI.getConversationMemory(chatSession.id);

    return NextResponse.json({
      success: true,
      response: result.message,
      intent: result.intent,
      confidence: result.confidence,
      entities: result.metadata?.entities || {},
      shouldUseLangChain: result.metadata?.source === 'langchain_enhanced',
      sender_id: `user_${Date.now()}`,
      session_id: chatSession.id,
      memory: memory,
      session: {
        id: chatSession.id,
        messageCount: chatSession.messages.length,
        lastMessage: chatSession.messages[chatSession.messages.length - 1]
      }
    });

  } catch (error) {
    console.error('Error in Rasa chat API:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
