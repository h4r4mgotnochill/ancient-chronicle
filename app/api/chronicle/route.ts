import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json()

    if (!messages || !system) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (messages.length > 40) {
      return NextResponse.json({ error: 'Too many messages' }, { status: 429 })
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'The Ancient Chronicle',
      },
      body: JSON.stringify({
        model: 'inclusionai/ring-2.6-1t:free',
        messages: [
          { role: 'system', content: system },
          ...messages
        ],
        max_tokens: 1024,
        temperature: 0.9,
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenRouter error:', data)
      return NextResponse.json({ error: 'AI unavailable' }, { status: 500 })
    }

    const text = data.choices?.[0]?.message?.content || 'The Chronicler falls silent...'

    // Return in same format the frontend expects
    return NextResponse.json({
      content: [{ type: 'text', text }]
    })

  } catch (error) {
    console.error('Chronicle API error:', error)
    return NextResponse.json({ error: 'Chronicle unavailable' }, { status: 500 })
  }
}