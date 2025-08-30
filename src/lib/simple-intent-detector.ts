import { OpenRouterMessage } from './chat-api';

export interface IntentResult {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
  shouldUseLangChain: boolean;
  response?: string;
}

export interface ConversationMemory {
  sessionId: string;
  messages: OpenRouterMessage[];
  userPreferences: Record<string, any>;
  currentService: string | null;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  lastIntent: string | null;
  conversationSummary: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
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
    website_improvement: {
      patterns: ['تحسين موقع', 'تطوير موقع', 'موقعي', 'موقع', 'مبيعات', 'زيادة المبيعات', 'تحسين المبيعات', 'تطوير المبيعات', 'تصميم موقع', 'موقع جديد'],
      confidence: 0.9,
      useLangChain: true
    },
    marketing_help: {
      patterns: ['تسويق', 'إعلانات', 'حملات', 'marketing', 'ads', 'promotion', 'ترويج', 'بيع', 'مبيعات', 'تسويق إلكتروني'],
      confidence: 0.9,
      useLangChain: true
    },
    bot_inquiry: {
      patterns: ['بوت ذكي', 'بوت ماسنجر', 'بوت واتساب', 'chatbot', 'chat bot', 'كيف يعمل البوت', 'مميزات البوت', 'تجربة البوت', 'البوت يعمل', 'عمل البوت', 'كيف يعمل البوت', 'مميزات البوت', 'تجربة البوت'],
      confidence: 0.9,
      useLangChain: true
    },
    video_production: {
      patterns: ['فيديو', 'مونتاج', 'video', 'editing', 'فيديو إعلاني', 'مونتاج فيديو', 'تصوير فيديو'],
      confidence: 0.9,
      useLangChain: false
    },
    photography: {
      patterns: ['تصوير', 'فوتوغرافي', 'photography', 'photo', 'تصوير منتجات', 'صور احترافية', 'تصوير فوتوغرافي'],
      confidence: 0.9,
      useLangChain: false
    },
    design_services: {
      patterns: ['تصميم', 'جرافيك', 'design', 'graphic', 'هوية بصرية', 'لوجو', 'logo', 'تصميم جرافيك'],
      confidence: 0.9,
      useLangChain: false
    },
    ai_solutions: {
      patterns: ['ذكاء اصطناعي', 'ai', 'artificial intelligence', 'أتمتة', 'تحليلات ذكية', 'دمج أنظمة', 'machine learning'],
      confidence: 0.9,
      useLangChain: true
    },
    team_info: {
      patterns: ['فريق', 'خبرة', 'مشاريع سابقة', 'أراء العملاء', 'الخبرة', 'الفريق', 'المشاريع'],
      confidence: 0.8,
      useLangChain: false
    },
    support_info: {
      patterns: ['ضمانات', 'دعم فني', 'تدريب', 'تحديثات', 'ضمان', 'دعم', 'تدريب', 'تحديث'],
      confidence: 0.8,
      useLangChain: false
    },
    humor_response: {
      patterns: ['هزار', 'نكتة', 'نكت', 'بهزر', 'بهزار', 'هههه', 'lol', 'حلبؤه', 'حلبؤة', 'مزح', 'مزح'],
      confidence: 0.8,
      useLangChain: false
    },
    out_of_scope: {
      patterns: ['طيران', 'سفر', 'سياحة', 'مطعم', 'فندق', 'شراء سيارات', 'بيع عقارات', 'استثمار في البورصة', 'تأمين', 'قروض'],
      confidence: 0.9,
      useLangChain: false
    }
  };

  private conversationMemories: Map<string, ConversationMemory> = new Map();
  private readonly MAX_MESSAGES_BEFORE_SUMMARY = 10;
  private readonly MAX_MEMORY_AGE_HOURS = 24;

  /**
   * كشف النية من الرسالة مع مراعاة الذاكرة
   */
  detectIntent(message: string, conversationHistory: OpenRouterMessage[] = [], sessionId?: string): IntentResult {
    const normalizedMessage = message.trim().toLowerCase();
    
    // تحديث الذاكرة
    if (sessionId) {
      this.updateConversationMemory(sessionId, message, conversationHistory);
    }
    
    // البحث عن النية أولاً
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

    // إذا كانت النية واضحة وثقتها عالية، استخدم الرد السريع
    if (bestMatch && bestMatch.confidence > 0.8) {
      const response = this.getResponseForIntent(bestMatch.intent, bestMatch.entities, sessionId);
      return {
        ...bestMatch,
        response
      };
    }

    // إذا كان مطلوب استخدام LangChain
    if (bestMatch && bestMatch.shouldUseLangChain) {
      return {
        ...bestMatch,
        shouldUseLangChain: true
      };
    }

    // إذا كانت النية واضحة مع ثقة متوسطة
    if (bestMatch && bestMatch.confidence > 0.6) {
      const response = this.getResponseForIntent(bestMatch.intent, bestMatch.entities, sessionId);
      return {
        ...bestMatch,
        response
      };
    }

    // فحص الرسائل المبهمة فقط إذا لم نجد نية محددة
    if (!bestMatch && this.isAmbiguousMessage(normalizedMessage)) {
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

    // إذا لم يتم العثور على نية واضحة، استخدم الذاكرة
    if (!bestMatch && sessionId) {
      const memory = this.conversationMemories.get(sessionId);
      if (memory && memory.lastIntent) {
        return {
          intent: 'context_followup',
          confidence: 0.7,
          entities: {},
          shouldUseLangChain: true
        };
      }
    }

    // رد عام مع مراعاة الذاكرة
    return {
      intent: 'general_question',
      confidence: 0.5,
      entities: {},
      shouldUseLangChain: true
    };
  }



  /**
   * تحديث ذاكرة المحادثة
   */
  private updateConversationMemory(sessionId: string, message: string, history: OpenRouterMessage[]): void {
    let memory = this.conversationMemories.get(sessionId);
    
    if (!memory) {
      memory = {
        sessionId,
        messages: [],
        userPreferences: {},
        currentService: null,
        urgencyLevel: 'low',
        lastIntent: null,
        conversationSummary: '',
        messageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    // إضافة الرسالة الجديدة
    memory.messages.push({
      role: 'user',
      content: message
    });
    memory.messageCount = memory.messages.length;
    memory.updatedAt = new Date();

    // تحديث التفضيلات والكيانات
    const entities = this.extractEntities(message);
    if (entities.service_type) {
      memory.currentService = entities.service_type;
    }
    if (entities.urgency_level) {
      memory.urgencyLevel = entities.urgency_level as any;
    }

    // إنشاء ملخص بعد 10 رسائل
    if (memory.messageCount >= this.MAX_MESSAGES_BEFORE_SUMMARY && !memory.conversationSummary) {
      memory.conversationSummary = this.generateConversationSummary(memory);
    }

    // تنظيف الذاكرة القديمة
    this.cleanupOldMemories();

    this.conversationMemories.set(sessionId, memory);
  }

  /**
   * إنشاء ملخص للمحادثة
   */
  private generateConversationSummary(memory: ConversationMemory): string {
    const services = memory.currentService ? `مهتم بـ: ${memory.currentService}` : '';
    const urgency = memory.urgencyLevel !== 'low' ? `مستوى أولوية: ${memory.urgencyLevel}` : '';
    const preferences = Object.keys(memory.userPreferences).length > 0 ? 
      `تفضيلات: ${Object.keys(memory.userPreferences).join(', ')}` : '';

    const summary = [services, urgency, preferences]
      .filter(Boolean)
      .join(' | ');

    return summary || 'محادثة عامة';
  }

  /**
   * تنظيف الذكريات القديمة
   */
  private cleanupOldMemories(): void {
    const now = new Date();
    const maxAge = this.MAX_MEMORY_AGE_HOURS * 60 * 60 * 1000;

    for (const [sessionId, memory] of Array.from(this.conversationMemories.entries())) {
      if (now.getTime() - memory.updatedAt.getTime() > maxAge) {
        this.conversationMemories.delete(sessionId);
      }
    }
  }

  /**
   * الحصول على ذاكرة المحادثة
   */
  getConversationMemory(sessionId: string): ConversationMemory | null {
    return this.conversationMemories.get(sessionId) || null;
  }

  /**
   * فحص الرسائل المبهمة
   */
  private isAmbiguousMessage(message: string): boolean {
    // فحص إذا كانت الرسالة تحتوي على كلمات محددة
    const hasSpecificWords = message.includes('بوت') || 
                           message.includes('موقع') || 
                           message.includes('تسويق') || 
                           message.includes('فيديو') || 
                           message.includes('تصوير') || 
                           message.includes('تصميم') || 
                           message.includes('ذكاء') ||
                           message.includes('خدمات');
    
    // إذا كانت الرسالة تحتوي على كلمات محددة، فهي ليست مبهمة
    if (hasSpecificWords) {
      return false;
    }
    
    // فحص الأنماط المبهمة فقط للرسائل القصيرة
    const ambiguousPatterns = [
      /^كيف$/,
      /^ازاي$/,
      /^إزاي$/,
      /^how$/,
      /^لماذا$/,
      /^ليه$/,
      /^why$/,
      /^متى$/,
      /^امتى$/,
      /^when$/,
      /^أين$/,
      /^فين$/,
      /^where$/,
      /^ما هو$/,
      /^إيه$/,
      /^what is$/,
      /^شرح$/,
      /^توضيح$/,
      /^explain$/
    ];
    
    return ambiguousPatterns.some(pattern => pattern.test(message));
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
   * حساب التشابه بين رسالتين
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));
    
    const intersection = new Set(Array.from(words1).filter(x => words2.has(x)));
    const union = new Set([...Array.from(words1), ...Array.from(words2)]);
    
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
      'photography': /(تصوير|فوتوغرافي|photography|photo)/,
      'website': /(موقع|website|web|موقعي|تحسين موقع|تطوير موقع)/
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
   * الحصول على رد مناسب للنية مع مراعاة الذاكرة
   */
  getResponseForIntent(intent: string, entities: Record<string, string> = {}, sessionId?: string): string {
    const memory = sessionId ? this.conversationMemories.get(sessionId) : null;
    
    const responses: Record<string, string> = {
      greet: this.getRandomResponse([
        'أهلاً! كيف أقدر أساعدك؟',
        'مرحباً! إيه اللي محتاجه؟'
      ]),
      goodbye: this.getRandomResponse([
        'في حفظ الله!',
        'مع السلامة!'
      ]),
      thanks: this.getRandomResponse([
        'العفو!',
        'تحت أمرك!'
      ]),
      booking_request: 'ممتاز! سجلت طلبك للحجز. فريقنا هيوصل لك خلال ساعة 👨‍💼\n\nتواصل معنا عبر واتساب: +20 106 616 1454',
      pricing_inquiry: 'بالنسبة للتكلفة، نحدد أولاً:\n- نوع الذكاء المطلوب\n- عدد السيناريوهات\n- التكاملات الإضافية\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454',
      service_inquiry: 'خدماتنا الرئيسية:\n🤖 بوت ماسنجر ذكي\n📱 تسويق إلكتروني\n🎬 ميديا ومونتاج\n🎨 تصميم جرافيك\n📸 تصوير فوتوغرافي\n🧠 حلول الذكاء الاصطناعي',
      urgent_support: 'فهمت إن الموضوع عاجل! هتواصل معاك فوراً عبر واتساب: +20 106 616 1454 🚨',
      website_improvement: 'ممتاز! تحسين المواقع من تخصصاتنا! 🚀\n\nنقدم:\n- تحسين تجربة المستخدم\n- تحسين SEO\n- تحسين سرعة الموقع\n- تحسين معدلات التحويل\n\nاحجز استشارة: /book',
      marketing_help: 'التسويق الإلكتروني من أقوى خدماتنا! 📈\n\nنقدم:\n- حملات إعلانية مدفوعة\n- إدارة حسابات الإعلانات\n- تحسين معدلات التحويل\n- استراتيجيات تسويقية\n\nاحجز استشارة: /book',
      bot_inquiry: `البوت الذكي من أقوى خدماتنا! 🤖\n\n**المميزات:**\n- فهم متقدم للغة العربية والإنجليزية\n- ذاكرة محادثة ذكية\n- دعم متعدد اللغات\n- تكامل مع جميع المنصات\n- ردود فورية ومخصصة\n\n**كيف يعمل:**\n1. يحلل رسالتك بدقة عالية\n2. يستخرج النوايا والكيانات\n3. يبني ذاكرة محادثة\n4. يقدم ردود مخصصة\n\n**المنصات المدعومة:**\n- ماسنجر 📱\n- واتساب 📲\n- الموقع الإلكتروني 🌐\n- تطبيقات الهاتف 📱\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454`,
      video_production: `إنتاج الفيديو من تخصصاتنا! 🎬\n\n**الخدمات:**\n- فيديوهات إعلانية احترافية\n- مونتاج فيديو متقدم\n- تصوير فيديو عالي الجودة\n- رسوم متحركة 2D/3D\n- تأثيرات بصرية\n\n**المميزات:**\n- فريق محترف من المصورين والمحررين\n- أحدث التقنيات والمعدات\n- جودة عالية HD/4K\n- تسليم سريع\n\n**الأسعار:**\nتبدأ من 500 جنيه مصري\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454`,
      photography: `التصوير الفوتوغرافي من خدماتنا المميزة! 📸\n\n**الخدمات:**\n- تصوير منتجات احترافي\n- صور شخصية عالية الجودة\n- تصوير الأحداث والمناسبات\n- صور تجارية وإعلانية\n- معالجة وتعديل الصور\n\n**المميزات:**\n- كاميرات احترافية عالية الدقة\n- إضاءة احترافية\n- خلفيات متنوعة\n- معالجة احترافية للصور\n\n**الأسعار:**\nتبدأ من 300 جنيه مصري\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454`,
      design_services: `التصميم الجرافيكي من تخصصاتنا! 🎨\n\n**الخدمات:**\n- تصميم هوية بصرية كاملة\n- تصميم شعارات احترافية\nn- تصميم بطاقات أعمال\n- تصميم منشورات إعلانية\n- تصميم أغلفة الكتب\n\n**المميزات:**\n- تصميمات عصرية وجذابة\n- ألوان متناسقة\n- خطوط احترافية\n- ملفات عالية الجودة\n\n**الأسعار:**\nتبدأ من 400 جنيه مصري\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454`,
      ai_solutions: `حلول الذكاء الاصطناعي من مستقبلنا! 🧠\n\n**الخدمات:**\n- أتمتة المهام المتكررة\n- تحليلات ذكية للبيانات\n- دمج الأنظمة المختلفة\n- chatbots ذكية\n- معالجة اللغة الطبيعية\n\n**المميزات:**\n- تقنيات حديثة ومتطورة\n- حلول مخصصة\n- دعم فني متواصل\n- تحديثات دورية\n\n**الأسعار:**\nتبدأ من 1000 جنيه مصري\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454`,
      team_info: `فريقنا من أفضل المحترفين! 👥\n\n**الخبرة:**\n- أكثر من 5 سنوات في المجال\n- مشاريع ناجحة مع عملاء كبرى\n- شهادات معتمدة\n- تدريب مستمر\n\n**المشاريع السابقة:**\n- تطوير مواقع لشركات كبرى\n- تصميم هويات بصرية\n- إنتاج فيديوهات إعلانية\n- حلول ذكاء اصطناعي\n\n**آراء العملاء:**\n- تقييم 4.9/5 ⭐\n- عملاء راضون 100%\n- توصيات عديدة\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454`,
      support_info: `دعمنا الفني متواصل 24/7! 🛠️\n\n**الضمانات:**\n- ضمان 6 أشهر على جميع الخدمات\n- دعم فني مجاني\n- تحديثات دورية\n- صيانة مجانية\n\n**الدعم الفني:**\n- فريق دعم محترف\n- رد فوري على الاستفسارات\n- حل المشاكل بسرعة\n- تدريب مجاني\n\n**التدريب:**\n- دورات تدريبية\n- ورش عمل\n- شهادات معتمدة\n\nاحجز استشارة: /book أو واتساب: +20 106 616 1454`,
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
      general_question: 'أرى إن سؤالك يحتاج تفصيل أكثر. سأستخدم الذكاء الاصطناعي لإعطائك إجابة شاملة...',
      context_followup: memory ? 
        `أرى إنك مهتم بـ ${memory.currentService || 'خدماتنا'}! كيف أقدر أساعدك أكتر؟` :
        'أرى إنك مهتم بخدماتنا! كيف أقدر أساعدك أكتر؟',
      joke_request: this.getRandomResponse([
        'أنا بوت ذكي بس مش بقدر أضحك على نفسي 😄',
        'في واحد قال لصديقه: "إيه رأيك في الذكاء الاصطناعي؟" قال: "مش عارف، بس أنا طبيعي" 😂'
      ]),
      compliment: this.getRandomResponse([
        'شكراً لك!',
        'أهلاً بيك!'
      ]),
      casual_chat: this.getRandomResponse([
        'إيه الأخبار؟',
        'إيه رأيك في التكنولوجيا؟'
      ])
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
