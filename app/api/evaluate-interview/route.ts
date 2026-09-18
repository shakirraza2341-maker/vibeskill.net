import { NextResponse } from 'next/server'

type InterviewItem = { question?: string; answer?: string }
type Evaluation = {
  score: number
  feedback: string
  question: string
  answer: string
}

type RequestBody = {
  topic?: string
  skill?: string
  items?: InterviewItem[]
}

function parseEvaluation(text: string): { evaluations: Evaluation[]; total: number; percentage: number; summary: string } {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const parsed = JSON.parse(cleaned)
  const evaluations = parsed.evaluations

  if (!Array.isArray(evaluations) || typeof parsed.total !== 'number' || typeof parsed.percentage !== 'number') {
    throw new Error('Gemini returned an invalid evaluation')
  }

  return {
    evaluations: evaluations.map((item: Evaluation) => ({
      score: Math.max(0, Math.min(10, Number(item.score) || 0)),
      feedback: String(item.feedback || 'No feedback provided.'),
      question: String(item.question || ''),
      answer: String(item.answer || '')
    })),
    total: Math.max(0, Number(parsed.total) || 0),
    percentage: Math.max(0, Math.min(100, Number(parsed.percentage) || 0)),
    summary: String(parsed.summary || '')
  }
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
  const items = body.items
  if (!topic || !skill || !Array.isArray(items) || items.length === 0 || items.length > 20) {
    return NextResponse.json({ error: 'Topic, skill, and interview answers are required' }, { status: 400 })
  }

  const prompt = [
    `Evaluate this ${skill}-level mock interview about "${topic}".`,
    'Score every answer from 0 to 10 for correctness, relevance, clarity, and completeness.',
    'Use 0 when no answer was provided. Return only valid JSON in this exact shape:',
    '{"evaluations":[{"question":"...","answer":"...","score":0,"feedback":"..."}],"total":0,"percentage":0,"summary":"..."}.',
    `There are exactly ${items.length} question-answer pairs. The total must equal the sum of scores and the percentage must be total / ${items.length * 10} * 100.`,
    JSON.stringify(items)
  ].join(' ')

  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash'

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
            temperature: 0.2
          }
        })
      }
    )

    if (!response.ok) {
      const details = await response.text()
      console.error('Gemini evaluation failed:', response.status, details)
      let message = 'Gemini could not evaluate the interview'
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
    if (typeof text !== 'string') throw new Error('Gemini returned no evaluation content')

    return NextResponse.json(parseEvaluation(text))
  } catch (error) {
    console.error('Interview evaluation failed:', error)
    return NextResponse.json({ error: 'Unable to evaluate the interview right now' }, { status: 502 })
  }
}
