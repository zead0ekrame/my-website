import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { chatSchema } from '../../../../lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = chatSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Invalid input', 
        details: validationResult.error.errors 
      }, { status: 400 });
    }
    
    const { messages, model, temperature, max_tokens, stream, system, clientId, sessionId } = validationResult.data;

    // OpenRouter API endpoint
    const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    if (!OPENROUTER_API_KEY) {
      console.error('OpenRouter API key not found');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // تحليل المحادثة والسياق
    const conversationHistory = messages.slice(-5); // آخر 5 رسائل
    const lastMessage = messages[messages.length - 1]?.content || '';
    const isFirstQuestion = messages.length <= 2;
    
    // تحليل نوع الرسالة
    const isGreeting = /^(أهلا|مرحبا|السلام عليكم|صباح الخير|مساء الخير|كيف الحال|إنت عامل إيه|إنت عاملين إيه)/i.test(lastMessage);
    const isAmbiguous = /^(مم|نن|خغ|اه|أه|ايه|إيه|مش فاهم|مش عارف)/i.test(lastMessage);
    const isPriceQuestion = /(كام|بكام|السعر|التكلفة|الحبة|يعملوا كام|بيكلف كام)/i.test(lastMessage);
    const isCasual = /(تمام|ماشي|أوكي|حلو|ممتاز|كويس|عظيم)/i.test(lastMessage);
    
    // إعدادات ذكية للتفاعل
    let computedSystemPrompt = '';
    let maxTokens = 120;
    
    if (isFirstQuestion) {
      if (isGreeting) {
        computedSystemPrompt = `أنت مساعد ودود ومحب من إيجي أفريكا. رد على التحية بلطف وود، استخدم رموز تعبيرية خفيفة 😊. اطرح سؤالاً ودوداً لمواصلة النقاش. لا تتجاوز 80 توكن.`;
        maxTokens = 80;
      } else {
        computedSystemPrompt = `أنت مساعد ودود ومحب من إيجي أفريكا. أجب على السؤال بإيجاز (2-3 جملة) واطرح سؤالاً واحداً لمواصلة النقاش. استخدم رموز تعبيرية خفيفة 😊. لا تتجاوز 100 توكن.`;
        maxTokens = 100;
      }
    } else {
      if (isAmbiguous) {
        computedSystemPrompt = `أنت مساعد ودود ومحب. العميل كتب نص غير واضح، رد عليه بلطف واطلب التوضيح بشكل ودود 😅. لا تتجاوز 60 توكن.`;
        maxTokens = 60;
      } else if (isPriceQuestion) {
        computedSystemPrompt = `أنت مساعد ودود ومحب. العميل يسأل عن السعر، فهم قصدك 👍 واشرح أن الأسعار تختلف حسب الخدمة. اطلب تفاصيل أكثر. لا تتجاوز 100 توكن.`;
        maxTokens = 100;
      } else if (isCasual) {
        computedSystemPrompt = `أنت مساعد ودود ومحب. العميل كتب رد عادي، رده عليه بنفس الأسلوب الودود 😊. لا تتجاوز 80 توكن.`;
        maxTokens = 80;
      } else {
        computedSystemPrompt = `أنت مساعد ودود ومحب من إيجي أفريكا. أجب على السؤال بإيجاز (3-4 جملة) واطرح سؤالاً آخر لتعميق النقاش. ركز على جانب واحد فقط. استخدم رموز تعبيرية خفيفة 😊. لا تتجاوز 120 توكن.`;
        maxTokens = 120;
      }
    }
    
    // إضافة سياق المحادثة
    if (conversationHistory.length > 1) {
      computedSystemPrompt += `\n\nتذكر: أنت في نقاش تفاعلي مستمر. لا تبدأ من جديد، ربط ردك بالسياق السابق.`;
    }

    // قراءة إعدادات العميل إن وُجد clientId
    const queryClientId = request.nextUrl.searchParams.get('clientId');
    const clientIdentifier = clientId || queryClientId || null;
    let client: any = null;
    if (clientIdentifier) {
      client = await prisma.tenant.findFirst({
        where: {
          OR: [
            { id: clientIdentifier },
            { email: clientIdentifier }
          ]
        }
      });
    }

    // إعداد الطلب لـ OpenRouter مع الإعدادات الذكية
          const fallbackModel = process.env.OPENROUTER_MODEL || 'qwen/qwen2.5-vl-32b-instruct:free';
      const selectedModel = model || fallbackModel;
      const finalTemperature = typeof temperature === 'number' ? temperature : 0.7;
      const finalSystemPrompt = typeof system === 'string' ? system : computedSystemPrompt;
    const openrouterRequest = {
      model: selectedModel,
      messages: [
        {
          role: 'system',
          content: finalSystemPrompt
        },
        ...conversationHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: finalTemperature, // زيادة العشوائية للود
      top_p: 0.9, // تنويع الإجابات
      max_tokens: maxTokens,
      stream: false,
      stop: ["\n\n", "1.", "2.", "3.", "4.", "5."],
      repetition_penalty: 1.2 // منع التكرار
    };

    console.log('Sending request to OpenRouter:', {
      model: openrouterRequest.model,
      max_tokens: openrouterRequest.max_tokens,
      temperature: openrouterRequest.temperature,
      messageType: { isGreeting, isAmbiguous, isPriceQuestion, isCasual }
    });

    // Token limit check - tokenLimitMonthly غير موجود في Tenant schema
    // يمكن إضافة هذا الحقل لاحقاً

    const callModel = async (modelName: string) => {
      return fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Egy Africa AI'
        },
        body: JSON.stringify({ ...openrouterRequest, model: modelName })
      });
    };

    let response = await callModel(selectedModel);
    if (!response.ok) {
      console.warn('Primary model failed, trying fallback model...');
      const fallbackResp = await callModel(fallbackModel);
      if (fallbackResp.ok) {
        response = fallbackResp;
      }
    }

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Persist conversation and usage
    try {
      const session = sessionId || request.nextUrl.searchParams.get('sessionId') || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);
      // conversation logging - conversation model يحتاج projectId
      // يمكن إضافة هذا لاحقاً
              // usage logging - usageLog model غير موجود
        // يمكن إضافة هذا model لاحقاً
        // await Promise.all(ops); // ops فارغ الآن
    } catch (persistErr) {
      console.warn('Persist error (non-fatal):', persistErr);
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in OpenRouter chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
