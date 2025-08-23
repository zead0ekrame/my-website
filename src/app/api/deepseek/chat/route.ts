import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, model, temperature, max_tokens, stream } = body;

    // DeepSeek API endpoint
    const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

    if (!DEEPSEEK_API_KEY) {
      console.error('DeepSeek API key not found');
      return NextResponse.json(
        { error: 'DeepSeek API key not configured' },
        { status: 500 }
      );
    }

    // إعداد الطلب لـ DeepSeek
    const deepseekRequest = {
      model: model || 'deepseek-chat',
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: temperature || 0.7,
      max_tokens: max_tokens || 1000,
      stream: stream || false
    };

    console.log('Sending request to DeepSeek:', deepseekRequest);

    // إرسال الطلب إلى DeepSeek
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deepseekRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error:', response.status, errorText);
      
      return NextResponse.json(
        { error: `DeepSeek API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('DeepSeek response received');

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in DeepSeek chat API:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
