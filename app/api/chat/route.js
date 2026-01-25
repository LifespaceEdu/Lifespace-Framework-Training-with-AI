export async function POST(request) {
  try {
    // Read what the browser sent as raw text
    const bodyText = await request.text();

    if (!bodyText) {
      return NextResponse.json(
        { error: 'Request body was empty' },
        { status: 400 }
      );
    }

    let messages;
    try {
      const parsed = JSON.parse(bodyText);
      messages = parsed.messages;
    } catch (e) {
      return NextResponse.json(
        { error: 'Could not parse JSON body', details: bodyText },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      );
    }

    // Add a system message to guide the assistant
    const messagesWithSystem = [
      {
        role: 'system',
        content:
          'You are the Lifespace Education AI assistant. You help users understand and implement the Lifespace framework in clear, practical language.',
      },
      ...messages,
    ];

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'Missing GITHUB_TOKEN in environment' },
        { status: 500 }
      );
    }

    // Call GitHub Models (adjust URL/model only if you know the working ones)
    const response = await fetch(
      'https://models.inference.ai.azure.com/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: messagesWithSystem,
        }),
      }
    );

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

