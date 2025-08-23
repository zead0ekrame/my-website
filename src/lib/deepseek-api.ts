// OpenRouter API Integration
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

// معلومات الموقع للبوت
const WEBSITE_CONTEXT: ChatbotContext = {
  websiteInfo: `
    نحن شركة "إيجي أفريكا للمقاولات" نقدم حلول الذكاء الاصطناعي في الوطن العربي.
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

/**
 * إنشاء رسالة النظام للبوت
 */
function createSystemMessage(): string {
  return `أنت مساعد ذكي لشركة "إيجي أفريكا للمقاولات". 

${WEBSITE_CONTEXT.websiteInfo}

${WEBSITE_CONTEXT.services}

${WEBSITE_CONTEXT.companyInfo}

تعليمات مهمة:
- ارد باللغة العربية دائماً
- كن ودوداً ومهنياً
- قدم معلومات دقيقة عن خدماتنا
- إذا لم تعرف إجابة، اقترح التواصل عبر واتساب
- ركز على مساعدة العميل في اختيار الخدمة المناسبة
- اذكر أننا نخدم مصر والسعودية والخليج
- اذكر أن البوت يلتزم بسياسات Meta`;
}

/**
 * إرسال رسالة إلى OpenRouter API
 */
export async function sendMessageToOpenRouter(
  userMessage: string,
  conversationHistory: OpenRouterMessage[] = []
): Promise<string> {
  try {
    // إعداد الرسائل
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: createSystemMessage()
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    // استدعاء OpenRouter API
    const response = await fetch('/api/openrouter/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: process.env.OPENROUTER_MODEL || 'deepseek/deepseek-r1-0528:free',
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
    } else {
      throw new Error('No response from OpenRouter');
    }

  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    
    // رد احتياطي في حالة فشل API
    return `عذراً، حدث خطأ في الاتصال. يمكنك التواصل معنا مباشرة عبر واتساب: +20 106 616 1454 أو عبر البريد الإلكتروني: ziad@ekramy-ai.online`;
  }
}

/**
 * معالجة رسالة المستخدم وإرجاع رد ذكي
 */
export async function processUserMessage(
  userMessage: string,
  conversationHistory: OpenRouterMessage[] = []
): Promise<{ response: string; shouldAddToHistory: boolean }> {
  try {
    // رسائل بسيطة لا تحتاج OpenRouter
    const simpleResponses: { [key: string]: string } = {
      'مرحبا': 'أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم؟',
      'السلام عليكم': 'وعليكم السلام ورحمة الله وبركاته! كيف يمكنني مساعدتك؟',
      'شكرا': 'العفو! هل هناك شيء آخر يمكنني مساعدتك به؟',
      'مع السلامة': 'مع السلامة! نتمنى لك يوماً سعيداً',
      'وداعا': 'وداعاً! نتمنى لك يوماً سعيداً'
    };

    // التحقق من الرسائل البسيطة
    const simpleResponse = simpleResponses[userMessage.trim()];
    if (simpleResponse) {
      return { response: simpleResponse, shouldAddToHistory: false };
    }

    // إرسال الرسالة إلى OpenRouter
    const aiResponse = await sendMessageToOpenRouter(userMessage, conversationHistory);
    
    return { response: aiResponse, shouldAddToHistory: true };

  } catch (error) {
    console.error('Error processing user message:', error);
    return {
      response: 'عذراً، حدث خطأ. يمكنك التواصل معنا عبر واتساب للحصول على مساعدة فورية.',
      shouldAddToHistory: false
    };
  }
}
