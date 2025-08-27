import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ChatAPI, ChatMessage, ChatSession } from '@/lib/chat-api';

const prisma = new PrismaClient();
const chatAPI = new ChatAPI();

// POST - معالجة رسالة جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      message, 
      tenantId, 
      projectId, 
      channel = 'web',
      sessionId,
      chatflowId 
    } = body;

    // التحقق من البيانات
    if (!message || !tenantId || !projectId) {
      return NextResponse.json(
        { success: false, error: 'الرسالة ومعرف العميل والمشروع مطلوبان' },
        { status: 400 }
      );
    }

    // البحث عن المشروع
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        chatflows: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'المشروع غير موجود' },
        { status: 404 }
      );
    }

    // البحث عن أو إنشاء محادثة
    let conversation;
    if (sessionId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: sessionId }
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          projectId,
          channel,
          status: 'active',
          chatflowId: chatflowId || project.chatflows[0]?.id
        }
      });
    }

    // إنشاء جلسة chat
    const chatSession: ChatSession = chatAPI.createSession(
      tenantId,
      projectId,
      channel as any,
      conversation.chatflowId || undefined
    );

    // إضافة رسالة المستخدم
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      metadata: { channel, sessionId: conversation.id }
    };

    chatAPI.addMessage(chatSession, userMessage);

    // حفظ رسالة المستخدم في قاعدة البيانات
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message,
        metadata: { channel }
      }
    });

    // معالجة الرسالة
    const response = await chatAPI.processMessage(message, chatSession, {
      useFlowise: !!conversation.chatflowId,
      chatflowId: conversation.chatflowId
    });

    // إضافة رد المساعد للجلسة
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: 'assistant',
      content: response.message,
      timestamp: new Date(),
      metadata: { 
        source: response.metadata?.source,
        intent: response.intent,
        confidence: response.confidence
      }
    };

    chatAPI.addMessage(chatSession, assistantMessage);

    // حفظ رد المساعد في قاعدة البيانات
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: response.message,
        metadata: { 
          source: response.metadata?.source,
          intent: response.intent,
          confidence: response.confidence
        }
      }
    });

    // تحديث المحادثة
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { 
        updatedAt: new Date(),
        messageCount: { increment: 2 }
      }
    });

    // تحديث إحصائيات الاستخدام
    await updateUsageStats(tenantId, response.metadata?.source);

    return NextResponse.json({
      success: true,
      data: {
        response: response.message,
        sessionId: conversation.id,
        intent: response.intent,
        confidence: response.confidence,
        metadata: response.metadata
      }
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في معالجة الرسالة' },
      { status: 500 }
    );
  }
}

// GET - جلب محادثات المشروع
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'معرف المشروع مطلوب' },
        { status: 400 }
      );
    }

    const conversations = await prisma.conversation.findMany({
      where: { projectId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    });

    return NextResponse.json({
      success: true,
      data: conversations.map(conv => ({
        ...conv,
        messageCount: conv.messages.length,
        lastMessage: conv.messages[conv.messages.length - 1]
      }))
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المحادثات' },
      { status: 500 }
    );
  }
}

// Helper function - تحديث إحصائيات الاستخدام
async function updateUsageStats(tenantId: string, source?: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.usageDaily.upsert({
      where: {
        tenantId_date: {
          tenantId,
          date: today
        }
      },
      update: {
        requests: { increment: 1 },
        tokensOut: { increment: 1 } // تقدير تقريبي
      },
      create: {
        tenantId,
        date: today,
        requests: 1,
        tokensOut: 1
      }
    });

    // تحديث الاستخدام الشهري
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        monthlyUsage: { increment: 1 }
      }
    });

  } catch (error) {
    console.error('Error updating usage stats:', error);
  }
}
