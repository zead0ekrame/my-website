import { SimpleIntentDetector } from './simple-intent-detector';

export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatResponse {
  message: string;
  intent?: string;
  confidence?: number;
  sources?: string[];
  metadata?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  tenantId: string;
  projectId: string;
  chatflowId?: string;
  channel: 'web' | 'whatsapp' | 'messenger' | 'instagram';
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export class ChatAPI {
  private intentDetector: SimpleIntentDetector;
  private flowiseBaseUrl: string;

  constructor() {
    this.intentDetector = new SimpleIntentDetector();
    this.flowiseBaseUrl = process.env.FLOWISE_URL || 'http://localhost:3001';
  }

  /**
   * معالجة رسالة المستخدم
   */
  async processMessage(
    message: string,
    session: ChatSession,
    options?: {
      useFlowise?: boolean;
      chatflowId?: string;
    }
  ): Promise<ChatResponse> {
    try {
      // محاولة الكشف عن النية
      const intentResult = this.intentDetector.detectIntent(message);
      
      // إذا كانت النية واضحة وثقتها عالية، استخدم الرد السريع
      if (intentResult.confidence > 0.8) {
        return {
          message: intentResult.response || 'أهلاً وسهلاً! كيف أقدر أساعدك؟',
          intent: intentResult.intent,
          confidence: intentResult.confidence,
          metadata: { source: 'intent_detector' }
        };
      }

      // إذا كان مطلوب استخدام Flowise
      if (options?.useFlowise && options.chatflowId) {
        return await this.processWithFlowise(message, session, options.chatflowId);
      }

      // استخدام النية المكتشفة مع تحسين
      if (intentResult.confidence > 0.6) {
        return {
          message: intentResult.response || 'أفهم سؤالك! دعني أساعدك...',
          intent: intentResult.intent,
          confidence: intentResult.confidence,
          metadata: { source: 'intent_detector_fallback' }
        };
      }

      // رد عام
      return {
        message: 'أهلاً! كيف أقدر أساعدك اليوم؟ يمكنك سؤالي عن خدماتنا أو أسعارنا.',
        metadata: { source: 'general_response' }
      };

          } catch (error) {
        console.error('Error processing message:', error);
        return {
          message: 'عذراً، حدث خطأ في معالجة رسالتك. حاول مرة أخرى.',
          metadata: { source: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
        };
      }
  }

  /**
   * معالجة الرسالة عبر Flowise
   */
  private async processWithFlowise(
    message: string,
    session: ChatSession,
    chatflowId: string
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.flowiseBaseUrl}/api/v1/prediction/${chatflowId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.FLOWISE_API_KEY || ''}`
        },
        body: JSON.stringify({
          question: message,
          overrideConfig: {
            sessionId: session.id,
            tenantId: session.tenantId,
            projectId: session.projectId,
            channel: session.channel
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Flowise API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        message: data.text || 'أهلاً! كيف أقدر أساعدك؟',
        metadata: {
          source: 'flowise',
          chatflowId,
          flowiseResponse: data
        }
      };

          } catch (error) {
        console.error('Flowise API error:', error);
        
        // Fallback للكشف عن النية
        const intentResult = this.intentDetector.detectIntent(message);
        return {
          message: intentResult.response || 'أهلاً! كيف أقدر أساعدك؟',
          intent: intentResult.intent,
          confidence: intentResult.confidence,
          metadata: { 
            source: 'flowise_fallback',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        };
      }
  }

  /**
   * إنشاء جلسة محادثة جديدة
   */
  createSession(
    tenantId: string,
    projectId: string,
    channel: 'web' | 'whatsapp' | 'messenger' | 'instagram',
    chatflowId?: string
  ): ChatSession {
    return {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenantId,
      projectId,
      chatflowId,
      channel,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * إضافة رسالة للجلسة
   */
  addMessage(session: ChatSession, message: ChatMessage): void {
    session.messages.push(message);
    session.updatedAt = new Date();
  }

  /**
   * الحصول على إحصائيات الجلسة
   */
  getSessionStats(session: ChatSession) {
    return {
      messageCount: session.messages.length,
      userMessages: session.messages.filter(m => m.role === 'user').length,
      assistantMessages: session.messages.filter(m => m.role === 'assistant').length,
      duration: Date.now() - session.createdAt.getTime(),
      channel: session.channel
    };
  }
}


