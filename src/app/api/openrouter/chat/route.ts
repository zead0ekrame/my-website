import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model, temperature, max_tokens, stream } = body;

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

    // إعداد الطلب لـ OpenRouter
    const openrouterRequest = {
      model: model || 'deepseek/deepseek-r1-0528:free',
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000,
      stream: stream || false
    };

    console.log('Sending request to OpenRouter:', openrouterRequest);

    // إرسال الطلب إلى OpenRouter
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'إيجي أفريكا للمقاولات'
      },
      body: JSON.stringify(openrouterRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenRouter response received');

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in OpenRouter chat API:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
