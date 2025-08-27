import { OpenRouterMessage } from './chat-api';

export interface ChatRouterConfig {
  rasaConfidenceThreshold: number;
  fallbackToLangChain: boolean;
  enableIntentDetection: boolean;
}

export interface IntentResult {
  intent: string;
  confidence: number;
  shouldUseRasa: boolean;
}

export class ChatRouter {
  private config: ChatRouterConfig;

  constructor(config: Partial<ChatRouterConfig> = {}) {
    this.config = {
      rasaConfidenceThreshold: 0.7,
      fallbackToLangChain: true,
      enableIntentDetection: true,
      ...config
    };
  }

  /**
   * تقليل حجم البيانات المرسلة للنموذج
   */
  private optimizeContext(
    conversationHistory: OpenRouterMessage[],
    maxTokens: number = 1000
  ): OpenRouterMessage[] {
    // 1. أخذ آخر 3 رسائل فقط
    const recentMessages = conversationHistory.slice(-3);
    
    // 2. تقصير الرسائل الطويلة
    const optimizedMessages = recentMessages.map(msg => ({
      ...msg,
      content: msg.content.length > 200 
        ? msg.content.substring(0, 200) + '...' 
        : msg.content
    }));
    
    // 3. حساب الـ tokens
    const totalTokens = this.calculateTokens(optimizedMessages);
    
    return totalTokens > maxTokens 
      ? optimizedMessages.slice(-2) 
      : optimizedMessages;
  }

  /**
   * حساب عدد الـ tokens في الرسائل
   */
  private calculateTokens(messages: OpenRouterMessage[]): number {
    // تقريب بسيط: 1 token = 4 characters
    return messages.reduce((total, msg) => {
      return total + Math.ceil(msg.content.length / 4);
    }, 0);
  }

  /**
   * Router ذكي يختار بين Rasa و LangChain
   */
  async routeMessage(
    message: string,
    conversationHistory: OpenRouterMessage[] = [],
    sessionId?: string
  ): Promise<{ useRasa: boolean; reason: string; confidence?: number }> {
    
    // تحسين السياق قبل التوجيه
    const optimizedHistory = this.optimizeContext(conversationHistory);
    
    // 1. فحص الرسائل القصيرة/المبهمة
    if (this.isAmbiguousMessage(message)) {
      return {
        useRasa: true,
        reason: 'رسالة مبهمة - استخدام Rasa للتوضيح',
        confidence: 0.9
      };
    }

    // 2. فحص الرسائل الحرجة (حجز، دفع، دعم عاجل)
    if (this.isCriticalIntent(message)) {
      return {
        useRasa: true,
        reason: 'نية حرجة - استخدام Rasa للثبات',
        confidence: 0.95
      };
    }

    // 3. فحص الرسائل المكررة
    if (this.isRepeatedMessage(message, optimizedHistory)) {
      return {
        useRasa: true,
        reason: 'رسالة مكررة - استخدام Rasa للتوضيح',
        confidence: 0.8
      };
    }

    // 4. فحص الرسائل الطويلة/المعقدة
    if (this.isComplexQuestion(message)) {
      return {
        useRasa: false,
        reason: 'سؤال معقد - استخدام LangChain للرد المفصل',
        confidence: 0.6
      };
    }

    // 5. فحص الرسائل العامة
    if (this.isGeneralQuestion(message)) {
      return {
        useRasa: false,
        reason: 'سؤال عام - استخدام LangChain للرد الشامل',
        confidence: 0.7
      };
    }

    // 6. افتراضي - استخدام Rasa
    return {
      useRasa: true,
      reason: 'افتراضي - استخدام Rasa',
      confidence: 0.6
    };
  }

  /**
   * فحص الرسائل المبهمة
   */
  private isAmbiguousMessage(message: string): boolean {
    const normalized = message.trim().toLowerCase();
    
    // رسائل قصيرة جداً
    if (normalized.length <= 2) return true;
    
    // رسائل غير مفهومة
    const ambiguousPatterns = [
      /^(.)\1{2,}$/, // حروف متكررة
      /^[^\u0600-\u06FF\w\s]+$/, // رموز فقط
      /^(مم|نن|خغ|للل|سقلم)$/ // كلمات مبهمة
    ];
    
    return ambiguousPatterns.some(pattern => pattern.test(normalized));
  }

  /**
   * فحص النوايا الحرجة
   */
  private isCriticalIntent(message: string): boolean {
    const normalized = message.trim().toLowerCase();
    
    const criticalPatterns = [
      /(حجز|احجز|حجز|booking|book)/,
      /(دفع|سداد|payment|pay)/,
      /(عاجل|ضروري|مشكلة|urgent|problem)/,
      /(سعر|تكلفة|بكم|pricing|cost)/,
      /(واتساب|whatsapp|ماسنجر|messenger)/
    ];
    
    return criticalPatterns.some(pattern => pattern.test(normalized));
  }

  /**
   * فحص الرسائل المكررة
   */
  private isRepeatedMessage(message: string, history: OpenRouterMessage[]): boolean {
    if (history.length === 0) return false;
    
    const normalizedMessage = message.trim().toLowerCase();
    const recentMessages = history
      .filter(msg => msg.role === 'user')
      .slice(-3)
      .map(msg => msg.content.trim().toLowerCase());
    
    return recentMessages.some(recent => 
      recent === normalizedMessage || 
      this.calculateSimilarity(normalizedMessage, recent) > 0.8
    );
  }

  /**
   * فحص الأسئلة المعقدة
   */
  private isComplexQuestion(message: string): boolean {
    const normalized = message.trim();
    
    // أسئلة طويلة
    if (normalized.length > 100) return true;
    
    // أسئلة معقدة
    const complexPatterns = [
      /كيف|ازاي|إزاي|how/,
      /لماذا|ليه|why/,
      /متى|امتى|when/,
      /أين|فين|where/,
      /ما هو|إيه|what is/,
      /شرح|توضيح|explain/
    ];
    
    return complexPatterns.some(pattern => pattern.test(normalized));
  }

  /**
   * فحص الأسئلة العامة
   */
  private isGeneralQuestion(message: string): boolean {
    const normalized = message.trim().toLowerCase();
    
    const generalPatterns = [
      /(خدمات|services)/,
      /(معلومات|information)/,
      /(تفاصيل|details)/,
      /(أمثلة|examples)/,
      /(نصائح|tips)/,
      /(أفضل|best)/
    ];
    
    return generalPatterns.some(pattern => pattern.test(normalized));
  }

  /**
   * حساب التشابه بين رسالتين
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * تحديث إعدادات Router
   */
  updateConfig(newConfig: Partial<ChatRouterConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * الحصول على الإعدادات الحالية
   */
  getConfig(): ChatRouterConfig {
    return { ...this.config };
  }
}

// Router افتراضي
export const defaultChatRouter = new ChatRouter();
