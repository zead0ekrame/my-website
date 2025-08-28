import { NextRequest } from 'next/server';
import { prisma } from '../../../../../lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model, temperature, system, clientId, sessionId } = body || {};

    const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      return new Response('OpenRouter API key not configured', { status: 500 });
    }

    const conversationHistory = (messages || []).slice(-5);
    const lastMessage = (messages || [])[messages.length - 1]?.content || '';
    const isFirstQuestion = (messages || []).length <= 2;

    const isGreeting = /^(أهلا|مرحبا|السلام عليكم|صباح الخير|مساء الخير|كيف الحال|إنت عامل إيه|إنت عاملين إيه)/i.test(lastMessage);
    const isAmbiguous = /^(مم|نن|خغ|اه|أه|ايه|إيه|مش فاهم|مش عارف)/i.test(lastMessage);
    const isPriceQuestion = /(كام|بكام|السعر|التكلفة|الحبة|يعملوا كام|بيكلف كام)/i.test(lastMessage);
    const isCasual = /(تمام|ماشي|أوكي|حلو|ممتاز|كويس|عظيم)/i.test(lastMessage);

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

    if (conversationHistory.length > 1) {
      computedSystemPrompt += `\n\nتذكر: أنت في نقاش تفاعلي مستمر. لا تبدأ من جديد، ربط ردك بالسياق السابق.`;
    }

    const queryClientId = request.nextUrl.searchParams.get('clientId');
    const clientIdentifier = clientId || queryClientId || null;
    let client: any = null;
    if (clientIdentifier) {
      client = await (prisma as any).client.findFirst({
        where: { OR: [{ id: clientIdentifier }, { email: clientIdentifier }] }
      });
    }

          const fallbackModel = process.env.OPENROUTER_MODEL || 'qwen/qwen2.5-vl-32b-instruct:free';
      const selectedModel = model || fallbackModel;
      const finalTemperature = typeof temperature === 'number' ? temperature : 0.7;
      const finalSystemPrompt = typeof system === 'string' ? system : computedSystemPrompt;

    const requestBody = {
      model: selectedModel,
      messages: [
        { role: 'system', content: finalSystemPrompt },
        ...conversationHistory.map((m: any) => ({ role: m.role, content: m.content }))
      ],
      temperature: finalTemperature,
      top_p: 0.9,
      max_tokens: maxTokens,
      stream: true,
      stop: ['\n\n', '1.', '2.', '3.', '4.', '5.'],
      repetition_penalty: 1.2,
    } as any;

    const callModel = async (modelName: string) => {
      return fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Egy Africa AI'
        },
        body: JSON.stringify({ ...requestBody, model: modelName })
      });
    };

    let upstream = await callModel(selectedModel);
    if (!upstream.ok) {
      const backup = await callModel(fallbackModel);
      if (backup.ok) upstream = backup;
    }
    if (!upstream.ok || !upstream.body) {
      return new Response(`OpenRouter error: ${upstream.status}`, { status: upstream.status || 500 });
    }

    const [toClient, toParse] = (upstream.body as ReadableStream<Uint8Array>).tee();

    // Parse SSE to accumulate assistant content and persist after end
    (async () => {
      try {
        const reader = toParse.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let assistant = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';
          for (const part of parts) {
            if (!part.startsWith('data:')) continue;
            const json = part.slice(5).trim();
            if (json === '[DONE]') continue;
            try {
              const evt = JSON.parse(json);
              const delta = evt?.choices?.[0]?.delta?.content || '';
              const messageContent = evt?.choices?.[0]?.message?.content || '';
              assistant += delta || messageContent || '';
            } catch {}
          }
        }

        const session = sessionId || request.nextUrl.searchParams.get('sessionId') || (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`);
        let conversation = await (prisma as any).conversation.findFirst({ where: { sessionId: session, clientId: client?.id ?? null } });
        if (!conversation) {
          conversation = await (prisma as any).conversation.create({ data: { sessionId: session, clientId: client?.id ?? null } });
        }
        if (lastMessage) {
          await (prisma as any).message.create({ data: { conversationId: conversation.id, role: 'user', content: lastMessage } });
        }
        if (assistant) {
          await (prisma as any).message.create({ data: { conversationId: conversation.id, role: 'assistant', content: assistant } });
        }
      } catch (e) {
        console.warn('stream persist error:', e);
      }
    })();

    return new Response(toClient, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'Transfer-Encoding': 'chunked',
        'X-Accel-Buffering': 'no'
      }
    });
  } catch (e: any) {
    return new Response('Internal server error', { status: 500 });
  }
}


