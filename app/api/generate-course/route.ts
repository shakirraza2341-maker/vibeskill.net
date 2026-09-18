import { NextResponse } from 'next/server'

type RequestBody = { name?: string; durationHours?: number; skill?: string }
type Lecture = { id: string; title: string; bullets: { point: string; explanation: string; question: string }[] }

const COURSE_PROMPT = `You are a senior curriculum designer. Create a practical self-paced course.
Return only valid JSON in this exact shape: {"lectures":[{"title":"string","bullets":[{"point":"string","explanation":"string","question":"string"}]}]}.
Create exactly {{DURATION}} lectures, one lecture for each hour of the course. Each lecture must contain exactly 5 concise, actionable bullet points.
For every bullet, write a clear 20-25 sentence explanation that teaches the idea, detailed explanation and examples and one open-ended question that tests practical understanding. The question must be answerable by the learner without seeing the answer.
The lectures must progress from foundations to applied practice for the requested skill level. Bullets must be independently teachable and must not contain numbering, markdown, or sub-bullets.
Course name: {{NAME}}
Learner level: {{SKILL}}`

function parseCourse(text: string, durationHours: number): Lecture[] {
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const parsed = JSON.parse(cleaned)
  if (!Array.isArray(parsed.lectures) || parsed.lectures.length !== durationHours) throw new Error('Gemini returned the wrong number of lectures')
  return parsed.lectures.map((lecture: { title?: unknown; bullets?: unknown }, index: number) => {
    if (typeof lecture.title !== 'string' || !lecture.title.trim() || !Array.isArray(lecture.bullets) || lecture.bullets.length !== 5 || lecture.bullets.some((bullet) => typeof bullet !== 'object' || !bullet || typeof bullet.point !== 'string' || !bullet.point.trim() || typeof bullet.explanation !== 'string' || !bullet.explanation.trim() || typeof bullet.question !== 'string' || !bullet.question.trim())) throw new Error('Gemini returned an invalid lecture')
    return { id: `lecture-${index + 1}`, title: lecture.title.trim(), bullets: lecture.bullets.map((bullet) => ({ point: bullet.point.trim(), explanation: bullet.explanation.trim(), question: bullet.question.trim() })) }
  })
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })

  let body: RequestBody
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Invalid request body' }, { status: 400 }) }
  const name = body.name?.trim()
  const durationHours = body.durationHours
  const skill = body.skill?.trim()
  if (!name || typeof durationHours !== 'number' || !Number.isInteger(durationHours) || durationHours < 1 || durationHours > 24 || !skill) return NextResponse.json({ error: 'Course name, skill, and a duration between 1 and 24 hours are required' }, { status: 400 })

  const prompt = COURSE_PROMPT.replace('{{DURATION}}', String(durationHours)).replace('{{NAME}}', name).replace('{{SKILL}}', skill)
  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash'
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.35 } })
    })
    if (!response.ok) return NextResponse.json({ error: 'Gemini could not create this course' }, { status: 502 })
    const result = await response.json()
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text
    if (typeof text !== 'string') throw new Error('Gemini returned no course content')
    return NextResponse.json({ id: `course-${Date.now()}`, name, durationHours, skill, lectures: parseCourse(text, durationHours), createdAt: new Date().toISOString() })
  } catch (error) {
    console.error('Course generation failed:', error)
    return NextResponse.json({ error: 'Unable to create this course right now' }, { status: 502 })
  }
}
