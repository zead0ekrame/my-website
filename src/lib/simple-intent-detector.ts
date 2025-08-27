import { OpenRouterMessage } from './chat-api';

export interface IntentResult {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
  shouldUseLangChain: boolean;
  response?: string;
}

export class SimpleIntentDetector {
  private intents = {
    greet: {
      patterns: ['مرحبا', 'أهلاً', 'السلام عليكم', 'سلام عليكم', 'أهلاً وسهلاً', 'مرحباً', 'اهلا', 'اهلا!', 'هلا', 'هلا والله'],
      confidence: 0.9,
      useLangChain: false
    },
    goodbye: {
      patterns: ['مع السلامة', 'وداعا', 'وداعاً', 'باي', 'سلام', 'في أمان الله', 'الله معاك', 'نشوفك'],
      confidence: 0.9,
      useLangChain: false
    },
    thanks: {
      patterns: ['شكرا', 'شكراً', 'مشكور', 'متشكر', 'متشكرة', 'thx', 'thanks', 'شكرا لك', 'شكراً لك'],
      confidence: 0.9,
      useLangChain: false
    },
    booking_request: {
      patterns: ['عايز أحجز', 'محتاج حجز', 'أريد حجز', 'احجز لي', 'احجز ليا', 'احجز موعد', 'احجز استشارة', 'احجز جلسة', 'احجز خدمة', 'احجز معكم'],
      confidence: 0.95,
      useLangChain: false
    },
    pricing_inquiry: {
      patterns: ['بكم', 'بكام', 'السعر', 'التكلفة', 'بيكلف كام', 'يعملوا كام', 'السعر كام', 'التكلفة كام', 'بكم الخدمة', 'بكم المشروع'],
      confidence: 0.9,
      useLangChain: false
    },
    service_inquiry: {
      patterns: ['إيه الخدمات', 'ما هي الخدمات', 'ايه الخدمات', 'الخدمات إيه', 'ما الخدمات', 'ايه بتعملوا', 'إيه بتعملوا', 'ما بتعملوا', 'الخدمات المتاحة', 'ايه متاح'],
      confidence: 0.9,
      useLangChain: false
    },
    urgent_support: {
      patterns: ['عاجل', 'ضروري', 'مهم', 'مشكلة', 'مشكله', 'مشكلة عاجلة', 'مشكله عاجله', 'عايز حل فوري', 'محتاج مساعدة عاجلة', 'مساعدة فورية'],
      confidence: 0.95,
      useLangChain: false
    },
    humor_response: {
      patterns: ['هزار', 'نكتة', 'نكت', 'بهزر', 'بهزار', 'هههه', 'lol', 'حلبؤه', 'حلبؤة', 'مزح', 'مزح'],
      confidence: 0.8,
      useLangChain: false
    },
    out_of_scope: {
      patterns: ['طيران', 'سفر', 'سياحة', 'مطعم', 'فندق', 'شراء', 'بيع', 'استثمار', 'عقارات', 'سيارات'],
      confidence: 0.9,
      useLangChain: false
    }
  };

  /**
   * كشف النية من الرسالة
   */
  detectIntent(message: string, conversationHistory: OpenRouterMessage[] = []): IntentResult {
    const normalizedMessage = message.trim().toLowerCase();
    
    // فحص الرسائل المبهمة
    if (this.isAmbiguousMessage(normalizedMessage)) {
      return {
        intent: 'ambiguous',
        confidence: 0.7,
        entities: {},
        shouldUseLangChain: true
      };
    }

    // فحص الرسائل المكررة
    if (this.isRepeatedMessage(normalizedMessage, conversationHistory)) {
      return {
        intent: 'repeated',
        confidence: 0.8,
        entities: {},
        shouldUseLangChain: false
      };
    }

    // البحث عن النية
    let bestMatch: IntentResult | null = null;
    let highestConfidence = 0;

    for (const [intentName, intentData] of Object.entries(this.intents)) {
      for (const pattern of intentData.patterns) {
        if (normalizedMessage.includes(pattern)) {
          if (intentData.confidence > highestConfidence) {
            highestConfidence = intentData.confidence;
            bestMatch = {
              intent: intentName,
              confidence: intentData.confidence,
              entities: this.extractEntities(normalizedMessage),
              shouldUseLangChain: intentData.useLangChain
            };
          }
        }
      }
    }

    // إذا لم نجد نية محددة، استخدم LangChain
    if (!bestMatch) {
      return {
        intent: 'general_question',
        confidence: 0.6,
        entities: {},
        shouldUseLangChain: true,
        response: this.getResponseForIntent('general_question')
      };
    }

    // إضافة response للنتيجة
    bestMatch.response = this.getResponseForIntent(bestMatch.intent, bestMatch.entities);
    return bestMatch;
  }

  /**
   * فحص الرسائل المبهمة
   */
  private isAmbiguousMessage(message: string): boolean {
    if (message.length <= 2) return true;
    
    const ambiguousPatterns = [
      /^(.)\1{2,}$/, // حروف متكررة
      /^[^\u0600-\u06FF\w\s]+$/, // رموز فقط
      /^(مم|نن|خغ|للل|سقلم)$/ // كلمات مبهمة
    ];
    
    return ambiguousPatterns.some(pattern => pattern.test(message));
  }

  /**
   * فحص الرسائل المكررة
   */
  private isRepeatedMessage(message: string, history: OpenRouterMessage[]): boolean {
    if (history.length === 0) return false;
    
    const recentMessages = history
      .filter(msg => msg.role === 'user')
      .slice(-3)
      .map(msg => msg.content.trim().toLowerCase());
    
    return recentMessages.some(recent => 
      recent === message || 
      this.calculateSimilarity(message, recent) > 0.8
    );
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
   * استخراج الكيانات من الرسالة
   */
  private extractEntities(message: string): Record<string, string> {
    const entities: Record<string, string> = {};
    
    // استخراج نوع الخدمة
    const servicePatterns = {
      'messenger_bot': /(ماسنجر|ماسنجر|messenger|بوت)/,
      'whatsapp_bot': /(واتساب|whatsapp|بوت)/,
      'marketing': /(تسويق|إعلانات|marketing|ads)/,
      'design': /(تصميم|جرافيك|design|graphic)/,
      'video': /(فيديو|مونتاج|video|editing)/,
      'photography': /(تصوير|فوتوغرافي|photography|photo)/
    };

    for (const [entityType, pattern] of Object.entries(servicePatterns)) {
      if (pattern.test(message)) {
        entities.service_type = entityType;
        break;
      }
    }

    // استخراج مستوى الأولوية
    if (/(عاجل|ضروري|مهم|urgent|important)/.test(message)) {
      entities.urgency_level = 'high';
    }

    // استخراج الموقع
    const locationPattern = /(مصر|السعودية|الخليج|egypt|saudi|gulf)/;
    const locationMatch = message.match(locationPattern);
    if (locationMatch) {
      entities.location = locationMatch[0];
    }

    return entities;
  }

  /**
   * الحصول على رد مناسب للنية
   */
  getResponseForIntent(intent: string, entities: Record<string, string> = {}): string {
    const responses: Record<string, string> = {
      greet: this.getRandomResponse([
        'أهلاً وسهلاً! كيف أقدر أساعدك اليوم؟ 😊',
        'مرحباً! نورتنا، إيه اللي محتاجه؟ 👋',
        'أهلاً بيك! تحت أمرك، تسأل عن إيه؟ 🌟'
      ]),
      goodbye: this.getRandomResponse([
        'في حفظ الله! موجود لو احتجت أي حاجة 🙏',
        'مع السلامة — بالتوفيق! 🌟',
        'سعيد بخدمتك! نشوفك على خير 👋'
      ]),
      thanks: this.getRandomResponse([
        'العفو! لو حابب نكمل بخطوة عملية قولي 💬',
        'على الرحب! تحب أحجز لك استشارة سريعة؟',
        'تحت أمرك دائمًا — أي استفسار تاني؟'
      ]),
      booking_request: 'ممتاز! سجلت طلبك للحجز. فريقنا هيوصل لك خلال ساعة 👨‍💼\n\nتواصل معنا عبر واتساب: +20 106 616 1454',
      pricing_inquiry: 'بالنسبة للتكلفة، نحدد أولاً:\n- نوع الذكاء المطلوب\n- عدد السيناريوهات\n- التكاملات الإضافية\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454',
      service_inquiry: 'خدماتنا الرئيسية:\n🤖 بوت ماسنجر ذكي\n📱 تسويق إلكتروني\n🎬 ميديا ومونتاج\n🎨 تصميم جرافيك\n📸 تصوير فوتوغرافي\n🧠 حلول الذكاء الاصطناعي',
      urgent_support: 'فهمت إن الموضوع عاجل! هتواصل معاك فوراً عبر واتساب: +20 106 616 1454 🚨',
      humor_response: this.getRandomResponse([
        'ضحكتني 😂 بس خلينا ننجز! تحب نبدأ بخدمة معينة؟',
        'تمام الهزار! 😄 طيب قولي عايز توصل لإيه ونظبطها لك.',
        'هايل! نخلي الهزار فاصل لطيف ونكمل شغلنا 😉 محتاج إيه بالظبط؟'
      ]),
      out_of_scope: 'عذراً، هذا خارج نطاق خدماتنا. لكن أقدر أساعدك في:\n- حلول الذكاء الاصطناعي\n- التسويق الإلكتروني\n- التصميم والمونتاج',
      ambiguous: this.getRandomResponse([
        'تمام 👌، ممكن توضّح أكتر؟ تحب تعرف الأسعار ولا التفاصيل الفنية؟',
        'حلو! قصدك على الخدمة نفسها ولا التكلفة والمدة؟',
        'خليني أفهمك صح، إنت عايز تعرف إيه بالضبط؟'
      ]),
      repeated: 'خلينا في المفيد يا بطل 🙏 لو مهتم بخدمة معينة قولي عليها، وأنا أساعدك فورًا.',
      general_question: 'أرى إن سؤالك يحتاج تفصيل أكثر. سأستخدم الذكاء الاصطناعي لإعطائك إجابة شاملة...'
    };

    return responses[intent] || 'عذراً، لم أفهم طلبك. هل يمكنك إعادة صياغته؟';
  }

  /**
   * اختيار رد عشوائي من قائمة
   */
  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

// Detector افتراضي
export const defaultIntentDetector = new SimpleIntentDetector();
