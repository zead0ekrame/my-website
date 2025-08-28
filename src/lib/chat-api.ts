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
  memory?: any;
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
      // محاولة الكشف عن النية مع استخدام الذاكرة
      const intentResult = this.intentDetector.detectIntent(
        message, 
        session.messages.map(msg => ({ role: msg.role, content: msg.content })), // استخدام تاريخ المحادثة
        session.id // sessionId للذاكرة
      );
      
      // إذا كانت النية واضحة وثقتها عالية، استخدم الرد السريع
      if (intentResult.confidence > 0.8 && intentResult.response) {
        return {
          message: intentResult.response,
          intent: intentResult.intent,
          confidence: intentResult.confidence,
          metadata: { 
            source: 'intent_detector',
            memory: this.intentDetector.getConversationMemory(session.id)
          }
        };
      }

      // إذا كان مطلوب استخدام Flowise
      if (options?.useFlowise && options.chatflowId) {
        return await this.processWithFlowise(message, session, options.chatflowId);
      }

      // إذا كان مطلوب استخدام LangChain
      if (intentResult.shouldUseLangChain) {
        return await this.processWithLangChain(message, session, intentResult);
      }

      // استخدام النية المكتشفة مع تحسين
      if (intentResult.confidence > 0.6 && intentResult.response) {
        return {
          message: intentResult.response,
          intent: intentResult.intent,
          confidence: intentResult.confidence,
          metadata: { 
            source: 'intent_detector_fallback',
            memory: this.intentDetector.getConversationMemory(session.id)
          }
        };
      }

      // رد عام مع معلومات الذاكرة
      const memory = this.intentDetector.getConversationMemory(session.id);
      let generalResponse = '';
      
      if (memory && memory.currentService && memory.messageCount > 1) {
        // إذا كان المستخدم يتحدث عن خدمة محددة، استخدم الذاكرة
        generalResponse = `أرى إنك مهتم بـ ${memory.currentService}! 🎯\n\nكيف أقدر أساعدك أكتر؟`;
      } else if (memory && memory.lastIntent) {
        // إذا كان هناك نية سابقة، استخدمها
        const lastIntentResponse = this.intentDetector.getResponseForIntent(memory.lastIntent);
        if (lastIntentResponse) {
          generalResponse = lastIntentResponse;
        } else {
          generalResponse = 'أهلاً! كيف أقدر أساعدك اليوم؟ يمكنك سؤالي عن خدماتنا أو أسعارنا.';
        }
      } else {
        // رد عام للمرة الأولى
        generalResponse = 'أهلاً! كيف أقدر أساعدك اليوم؟ يمكنك سؤالي عن خدماتنا أو أسعارنا.';
      }

      return {
        message: generalResponse,
        metadata: { 
          source: 'general_response',
          memory: memory
        }
      };

    } catch (error) {
      console.error('Error processing message:', error);
      return {
        message: 'عذراً، حدث خطأ في معالجة رسالتك. حاول مرة أخرى.',
        metadata: { 
          source: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
      };
    }
  }

  /**
   * معالجة الرسالة عبر LangChain
   */
  private async processWithLangChain(
    message: string, 
    session: ChatSession, 
    intentResult: any
  ): Promise<ChatResponse> {
    try {
      const memory = this.intentDetector.getConversationMemory(session.id);
      
      // بناء context من الذاكرة
      let context = '';
      if (memory) {
        if (memory.conversationSummary) {
          context = `ملخص المحادثة السابقة: ${memory.conversationSummary}\n\n`;
        }
        if (memory.currentService) {
          context += `الخدمة المطلوبة: ${memory.currentService}\n\n`;
        }
        if (memory.urgencyLevel !== 'low') {
          context += `مستوى الأولوية: ${memory.urgencyLevel}\n\n`;
        }
      }

      // استخدام LangChain للرد المعقد
      const enhancedMessage = context + `سؤال المستخدم: ${message}`;
      
      // هنا يمكن ربط LangChain API
      // للآن نستخدم رد محسن
      let response = '';
      
      if (intentResult.intent === 'website_improvement') {
        response = `بناءً على سؤالك عن تحسين الموقع، إليك خطة شاملة: 🚀\n\n` +
          `1. **تحليل الأداء الحالي** 📊\n` +
          `   - سرعة التحميل\n` +
          `   - تجربة المستخدم\n` +
          `   - معدلات التحويل\n\n` +
          `2. **التحسينات المقترحة** ⚡\n` +
          `   - تحسين SEO\n` +
          `   - تحسين التصميم\n` +
          `   - تحسين المحتوى\n\n` +
          `3. **الخطوات التالية** 🎯\n` +
          `   احجز استشارة مجانية: /book\n` +
          `   أو واتساب: +20 106 616 1454`;
      } else if (intentResult.intent === 'marketing_help') {
        response = `ممتاز! بناءً على اهتمامك بالتسويق، إليك استراتيجية شاملة: 📈\n\n` +
          `1. **تحليل السوق** 🔍\n` +
          `   - دراسة المنافسين\n` +
          `   - تحديد الجمهور المستهدف\n` +
          `   - تحليل السلوكيات\n\n` +
          `2. **استراتيجية التسويق** 🎯\n` +
          `   - حملات إعلانية مدفوعة\n` +
          `   - تسويق المحتوى\n` +
          `   - التسويق عبر السوشيال ميديا\n\n` +
          `3. **البدء** 🚀\n` +
          `   احجز استشارة: /book\n` +
          `   أو واتساب: +20 106 616 1454`;
      } else if (intentResult.intent === 'bot_inquiry') {
        response = `البوت الذكي من أقوى خدماتنا! 🤖\n\n**المميزات:**\n- فهم متقدم للغة العربية والإنجليزية\n- ذاكرة محادثة ذكية\n- دعم متعدد اللغات\n- تكامل مع جميع المنصات\n- ردود فورية ومخصصة\n\n**كيف يعمل:**\n1. يحلل رسالتك بدقة عالية\n2. يستخرج النوايا والكيانات\n3. يبني ذاكرة محادثة\n4. يقدم ردود مخصصة\n\n**المنصات المدعومة:**\n- ماسنجر 📱\n- واتساب 📲\n- الموقع الإلكتروني 🌐\n- تطبيقات الهاتف 📱\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454`;
      } else if (intentResult.intent === 'ai_solutions') {
        response = `حلول الذكاء الاصطناعي من مستقبلنا! 🧠\n\n` +
          `1. **الخدمات المتقدمة** 🚀\n` +
          `   - أتمتة المهام المتكررة\n` +
          `   - تحليلات ذكية للبيانات\n` +
          `   - دمج الأنظمة المختلفة\n` +
          `   - chatbots ذكية\n` +
          `   - معالجة اللغة الطبيعية\n\n` +
          `2. **التقنيات المستخدمة** ⚡\n` +
          `   - Machine Learning\n` +
          `   - Deep Learning\n` +
          `   - Natural Language Processing\n` +
          `   - Computer Vision\n\n` +
          `3. **البدء** 🎯\n` +
          `   احجز استشارة: /book\n` +
          `   أو واتساب: +20 106 616 1454`;
      } else {
        response = `أرى إن سؤالك يحتاج تحليل متعمق! 🧠\n\n` +
          `بناءً على محادثتنا السابقة، سأقدم لك إجابة شاملة ومخصصة.\n\n` +
          `للحصول على استشارة مفصلة:\n` +
          `📞 احجز استشارة: /book\n` +
          `📱 واتساب: +20 106 616 1454`;
      }

      return {
        message: response,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        metadata: { 
          source: 'langchain_enhanced',
          memory: memory,
          context: context
        }
      };

    } catch (error) {
      console.error('Error processing with LangChain:', error);
      return {
        message: 'عذراً، حدث خطأ في المعالجة المتقدمة. حاول مرة أخرى.',
        metadata: { 
          source: 'langchain_error', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }
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
        },
        body: JSON.stringify({
          question: message,
          sessionId: session.id,
          overrideConfig: {
            sessionId: session.id
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Flowise API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        message: data.text || 'عذراً، لم أستطع معالجة رسالتك عبر Flowise.',
        metadata: { 
          source: 'flowise',
          flowiseData: data
        }
      };

    } catch (error) {
      console.error('Error processing with Flowise:', error);
      return {
        message: 'عذراً، حدث خطأ في معالجة رسالتك عبر Flowise. حاول مرة أخرى.',
        metadata: { 
          source: 'flowise_error', 
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

  /**
   * الحصول على ذاكرة المحادثة
   */
  getConversationMemory(sessionId: string) {
    return this.intentDetector.getConversationMemory(sessionId);
  }

  /**
   * مسح ذاكرة المحادثة
   */
  clearConversationMemory(sessionId: string) {
    // يمكن إضافة منطق مسح الذاكرة هنا
    return true;
  }
}


