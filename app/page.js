import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      );
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'Server configuration error. GITHUB_TOKEN not set.' },
        { status: 500 }
      );
    }

    const systemPrompt = {
      role: 'system',
      content: 'You are a helpful AI assistant for Lifespace Education, a comprehensive homeschooling framework. Keep responses short (2-3 paragraphs max). Do not use markdown formatting. Write in plain conversational prose.'
    };

    const messagesWithSystem = [systemPrompt, ...messages];

    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messagesWithSystem,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'GitHub API error', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to call AI model', message: error.message },
      { status: 500 }
    );
  }
}
