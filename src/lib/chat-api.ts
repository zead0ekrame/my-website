import { SITE } from './constants';
// OpenRouter Chat API (neutral naming)
export interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage: {
    total_tokens: number;
    prompt_tokens: number;
    completion_tokens: number;
  };
}

export interface ChatbotContext {
  websiteInfo: string;
  services: string;
  companyInfo: string;
}

// Context used to guide the assistant tone and knowledge
const WEBSITE_CONTEXT: ChatbotContext = {
  websiteInfo: `
    نحن شركة "إيجي أفريكا" نقدم حلول الذكاء الاصطناعي في الوطن العربي.
    نخدم مصر والسعودية ودول الخليج.
    نقدم خدمات: بوت ماسنجر ذكي، تسويق إلكتروني، ميديا ومونتاج، تصميم جرافيك، تصوير فوتوغرافي، وحلول الذكاء الاصطناعي للأعمال.
  `,
  services: `
    خدماتنا الرئيسية:
    1. بوت ماسنجر بالذكاء الاصطناعي - يلتزم بسياسات Meta
    2. التسويق الإلكتروني - حملات مدفوعة وإدارة إعلانات
    3. ميديا ومونتاج - فيديوهات إعلانية قصيرة
    4. تصميم جرافيك - هويات بصرية ومواد حملات
    5. تصوير فوتوغرافي - محتوى مستخدمين أصلي
    6. حلول الذكاء الاصطناعي - أتمتة وتحليلات
  `,
  companyInfo: `
    معلومات الشركة:
    - المالك: EKRAMY FOUAAD
    - الهاتف: +20 106 616 1454
    - البريد الإلكتروني: ziad@ekramy-ai.online
    - العنوان: مصر – الإسكندرية – العامرية
    - نركز على: السعودية والخليج
  `
};

function createSystemMessage(): string {
  return `أنت مساعد ذكي لشركة "إيجي أفريكا". 

${WEBSITE_CONTEXT.websiteInfo}

${WEBSITE_CONTEXT.services}

${WEBSITE_CONTEXT.companyInfo}

تعليمات مهمة:
- ارد باللغة العربية دائماً
- كن ودوداً، بسيطاً، وبنبرة إنسانية مشجعة
- قدم معلومات دقيقة عن خدماتنا مع أمثلة قصيرة
- لو السؤال فيه هزار/دعابة، رد بخفة دم محترمة بدون إسهاب
- لو مش عارف الإجابة، اعتذر بلطف واقترح واتساب للمساعدة
- ساعد العميل يختار الخدمة المناسبة بناءً على هدفه باقتcisار
- اذكر أننا نخدم مصر والسعودية والخليج عند الحاجة
- أكّد أن البوت يلتزم بسياسات Meta ونطاق 24 ساعة عند ذكر ماسنجر
- لو رسالة المستخدم غير مفهومة أو هزار، رد بجملة واحدة لطيفة ثم ارجع فوراً للموضوع.
- لا تكرر نفس السؤال مرتين متتاليتين؛ بدّل الصياغة أو قدّم إجابة مباشرة.`;
}

export async function sendMessageToOpenRouter(
  userMessage: string,
  conversationHistory: OpenRouterMessage[] = []
): Promise<string> {
  try {
    const messages: OpenRouterMessage[] = [
      { role: 'system', content: createSystemMessage() },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await fetch('/api/openrouter/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model: process.env.OPENROUTER_MODEL || 'qwen/qwen2.5-vl-32b-instruct:free',
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    }
    throw new Error('No response from OpenRouter');
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    return `عذراً، حدث خطأ في الاتصال. يمكنك التواصل معنا مباشرة عبر واتساب: +20 106 616 1454 أو عبر البريد الإلكتروني: ziad@ekramy-ai.online`;
  }
}

export async function processUserMessage(
  userMessage: string,
  conversationHistory: OpenRouterMessage[] = []
): Promise<{ response: string; shouldAddToHistory: boolean }> {
  try {
    const normalized = userMessage.trim().toLowerCase();
    const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

    const greetings = ['مرحبا', 'مرحبا!', 'أهلاً', 'اهلا', 'اهلا!', 'السلام عليكم', 'سلام عليكم'];
    const greetingReplies = [
      'يا هلا! نورتنا 👋 كيف أقدر أساعدك؟',
      'أهلاً بيك! تحب نبدأ بخدمة معينة؟',
      'وعليكم السلام ورحمة الله — تحت أمرك، تسأل عن إيه؟',
      'شرفتنا! خبرني هدفك، وأرشح لك الخدمة الأنسب 👌'
    ];
    if (greetings.some(g => normalized.includes(g))) {
      return { response: pick(greetingReplies), shouldAddToHistory: false };
    }

    // Price flow: structured questions + booking CTA
    const priceTriggers = ['كام', 'بكام', 'السعر', 'التكلفة', 'يعملوا كام', 'بيكلف كام'];
    if (priceTriggers.some(t => normalized.includes(t))) {
      const steps = [
        'نوع الذكاء: ردود ثابتة أم مدعومة بنموذج LLM؟',
        'عدد السيناريوهات/الردود الذكية المطلوبة تقريباً؟',
        'تكاملات إضافية: CRM / Google Sheets / WhatsApp…؟',
        'هل تحتاج دعم شهري ومتابعة؟'
      ];
      const booking = `لو حابب ننجزها بسرعة: احجز من ${SITE.calendlyUrl || '/book'} أو تواصل واتساب: ${SITE.whatsappUrl}.`;
      return { response: `بالنسبة للتكلفة، نحدد أولاً بعض النقاط:\n- ${steps.join('\n- ')}\n\n${booking}`, shouldAddToHistory: false };
    }

    const humorTriggers = ['هزار', 'نكتة', 'نكت', 'بهزر', 'بهزار', 'هههه', 'lol', 'حلبؤه', 'حلبؤة'];
    const offensiveTriggers = ['امك', 'أمك', 'ابوك', 'أبوك', 'كس', 'يلعن', 'قاحات', 'قحبة', 'متناك', 'نيك'];
    const isHumor = humorTriggers.some(t => normalized.includes(t));
    const isOffensive = offensiveTriggers.some(t => normalized.includes(t));

    const humorReplies = [
      'ضحكتني 😂 بس خلينا ننجز! تحب نبدأ بخدمة التسويق الإلكتروني ولا الذكاء الاصطناعي؟',
      'تمام الهزار! 😄 طيب قولي عايز توصل لإيه ونظبطها لك.',
      'هايل! نخلي الهزار فاصل لطيف ونكمل شغلنا 😉 محتاج إيه بالظبط؟'
    ];

    const wittyRedirect = [
      '😁 أنا بوت يا صديقي، معنديش عِشّة ولا طيران، بس أقدر أفيدك في التسويق الإلكتروني أو حلول الذكاء الاصطناعي. تحب نبدأ بإيه؟',
      '🙂 لول، فهمتها! نرجع للشغل: مهتم بالذكاء الاصطناعي ولا التسويق الإلكتروني؟',
      '😄 نجربني براحتك، وأنا أرجّعك للموضوع! تهمك الأسعار ولا تفاصيل الخدمة؟'
    ];

    const recentUserMsgs = conversationHistory.filter(m => m.role === 'user').slice(-6).map(m => m.content.toLowerCase());
    const recentHumorCount = recentUserMsgs.filter(m => humorTriggers.some(t => m.includes(t))).length;
    const recentOffensiveCount = recentUserMsgs.filter(m => offensiveTriggers.some(t => m.includes(t))).length;

    if (isOffensive) {
      if (recentOffensiveCount >= 1) {
        return { response: 'خلينا في المفيد يا بطل 🙏 لو مهتم بخدمة معينة قولي عليها، وأنا أساعدك فورًا.', shouldAddToHistory: false };
      }
      return { response: pick(wittyRedirect), shouldAddToHistory: false };
    }

    if (isHumor) {
      if (recentHumorCount >= 1) {
        return { response: '😂 لطيفة! نرجع لموضوعك؟ اختار: 1) الأسعار 2) طريقة التنفيذ 3) أمثلة سريعة', shouldAddToHistory: false };
      }
      return { response: pick(humorReplies), shouldAddToHistory: false };
    }

    const ambiguousTriggers = ['مش فاهم', 'مش واضح', 'ايه', 'إيه', 'يعني', 'ازاي', 'إزاي', 'مم', 'نن', 'خغ', 'للل', 'سقلم'];
    const isShort = normalized.length <= 2 || /^(.)\1{2,}$/.test(normalized);
    const clarifyPool = [
      'تمام 👌، ممكن توضّح أكتر؟ تحب تعرف الأسعار ولا التفاصيل الفنية؟',
      'حلو! قصدك على الخدمة نفسها ولا التكلفة والمدة؟',
      'خليني أفهمك صح، إنت عايز تعرف إيه بالضبط؟',
      'طيب، هل تركّز على التسويق الإلكتروني ولا الذكاء الاصطناعي؟',
      'علشان أفيدك بسرعة: تهمك الأسعار ولا طريقة التنفيذ؟'
    ];
    if (isShort || ambiguousTriggers.some(t => normalized.includes(t))) {
      return { response: pick(clarifyPool), shouldAddToHistory: false };
    }

    const thanksTriggers = ['شكرا', 'شكرًا', 'مشكور', 'thx', 'thanks'];
    const thanksReplies = [
      'العفو! لو حابب نكمل بخطوة عملية قولي 💬',
      'على الرحب! تحب أحجز لك استشارة سريعة؟',
      'تحت أمرك دائمًا — أي استفسار تاني؟'
    ];
    if (thanksTriggers.some(t => normalized.includes(t))) {
      return { response: pick(thanksReplies), shouldAddToHistory: false };
    }

    const byeTriggers = ['مع السلامة', 'وداعا', 'وداعًا', 'باي'];
    const byeReplies = [
      'في حفظ الله! موجود لو احتجت أي حاجة 🙏',
      'مع السلامة — بالتوفيق! 🌟',
      'سعيد بخدمتك! نشوفك على خير 👋'
    ];
    if (byeTriggers.some(t => normalized.includes(t))) {
      return { response: pick(byeReplies), shouldAddToHistory: false };
    }

    const aiResponse = await sendMessageToOpenRouter(userMessage, conversationHistory);
    return { response: aiResponse, shouldAddToHistory: true };
  } catch (error) {
    console.error('Error processing user message:', error);
    return { response: 'عذراً، حدث خطأ. يمكنك التواصل معنا عبر واتساب للحصول على مساعدة فورية.', shouldAddToHistory: false };
  }
}

/**
 * قياس سرعة نماذج Qwen المحددة من خلال مسار bench
 */
export async function benchmarkModels(prompt?: string, models?: string[]): Promise<
  { model: string; ok: boolean; latencyMs: number; preview?: string; error?: string }[]
> {
  try {
    const response = await fetch('/api/openrouter/bench', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: prompt || 'اختبار سرعة بسيط', models })
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Bench error: ${response.status} ${text}`);
    }
    const data = await response.json();
    return data.results as { model: string; ok: boolean; latencyMs: number; preview?: string; error?: string }[];
  } catch (error) {
    console.error('benchmarkModels error:', error);
    return [];
  }
}


