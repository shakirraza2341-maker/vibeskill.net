import { NextResponse } from 'next/server'

type GeneratedQuestion = { id: string; text: string }

type RequestBody = {
  topic?: string
  skill?: string
  count?: number
}

function parseQuestions(text: string): GeneratedQuestion[] {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const parsed = JSON.parse(cleaned)
  const questions = Array.isArray(parsed) ? parsed : parsed.questions

  if (!Array.isArray(questions)) throw new Error('Gemini returned an invalid question list')

  return questions.map((question: unknown, index: number) => {
    const value = typeof question === 'string' ? question : (question as { text?: unknown })?.text
    if (typeof value !== 'string' || !value.trim()) throw new Error('Gemini returned an invalid question')
    return { id: String(index + 1), text: value.trim() }
  })
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
  }

  let body: RequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const topic = body.topic?.trim()
  const skill = body.skill?.trim()
  const count = body.count

  if (!topic || !skill || typeof count !== 'number' || !Number.isInteger(count) || count < 1 || count > 20) {
    return NextResponse.json({ error: 'Topic, skill, and a question count between 1 and 20 are required' }, { status: 400 })
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash'
  const prompt = [
    `Generate exactly ${count} mock interview questions about "${topic}".`,
    `Target skill level: ${skill}.`,
    'Return only a JSON array of objects in this exact shape: [{"text":"question"}].',
    'Do not include answers, markdown, numbering, or any text outside the JSON array.'
  ].join(' ')

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7
          }
        })
      }
    )

    if (!response.ok) {
      const details = await response.text()
      console.error('Gemini request failed:', response.status, details)
      let message = 'Gemini could not generate questions'
      try {
        const errorBody = JSON.parse(details)
        if (typeof errorBody.error?.message === 'string') message = errorBody.error.message
      } catch {
        // Keep the generic message when Gemini does not return JSON.
      }
      return NextResponse.json({ error: message }, { status: 502 })
    }

    const result = await response.json()
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (typeof text !== 'string') throw new Error('Gemini returned no question content')

    const questions = parseQuestions(text)
    if (questions.length !== count) throw new Error('Gemini returned the wrong number of questions')

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Question generation failed:', error)
    return NextResponse.json({ error: 'Unable to generate questions right now' }, { status: 502 })
  }
}
