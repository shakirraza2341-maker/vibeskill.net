module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/generate-course/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const COURSE_PROMPT = `You are a senior curriculum designer. Create a practical self-paced course.
Return only valid JSON in this exact shape: {"lectures":[{"title":"string","bullets":[{"point":"string","explanation":"string","question":"string"}]}]}.
Create exactly {{DURATION}} lectures, one lecture for each hour of the course. Each lecture must contain exactly 5 concise, actionable bullet points.
For every bullet, write a clear 20-25 sentence explanation that teaches the idea, detailed explanation and examples and one open-ended question that tests practical understanding. The question must be answerable by the learner without seeing the answer.
The lectures must progress from foundations to applied practice for the requested skill level. Bullets must be independently teachable and must not contain numbering, markdown, or sub-bullets.
Course name: {{NAME}}
Learner level: {{SKILL}}`;
function parseCourse(text, durationHours) {
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed.lectures) || parsed.lectures.length !== durationHours) throw new Error('Gemini returned the wrong number of lectures');
    return parsed.lectures.map((lecture, index)=>{
        if (typeof lecture.title !== 'string' || !lecture.title.trim() || !Array.isArray(lecture.bullets) || lecture.bullets.length !== 5 || lecture.bullets.some((bullet)=>typeof bullet !== 'object' || !bullet || typeof bullet.point !== 'string' || !bullet.point.trim() || typeof bullet.explanation !== 'string' || !bullet.explanation.trim() || typeof bullet.question !== 'string' || !bullet.question.trim())) throw new Error('Gemini returned an invalid lecture');
        return {
            id: `lecture-${index + 1}`,
            title: lecture.title.trim(),
            bullets: lecture.bullets.map((bullet)=>({
                    point: bullet.point.trim(),
                    explanation: bullet.explanation.trim(),
                    question: bullet.question.trim()
                }))
        };
    });
}
async function POST(request) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'GEMINI_API_KEY is not configured'
    }, {
        status: 500
    });
    let body;
    try {
        body = await request.json();
    } catch  {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid request body'
        }, {
            status: 400
        });
    }
    const name = body.name?.trim();
    const durationHours = body.durationHours;
    const skill = body.skill?.trim();
    if (!name || typeof durationHours !== 'number' || !Number.isInteger(durationHours) || durationHours < 1 || durationHours > 24 || !skill) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        error: 'Course name, skill, and a duration between 1 and 24 hours are required'
    }, {
        status: 400
    });
    const prompt = COURSE_PROMPT.replace('{{DURATION}}', String(durationHours)).replace('{{NAME}}', name).replace('{{SKILL}}', skill);
    const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: 'application/json',
                    temperature: 0.35
                }
            })
        });
        if (!response.ok) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Gemini could not create this course'
        }, {
            status: 502
        });
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof text !== 'string') throw new Error('Gemini returned no course content');
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            id: `course-${Date.now()}`,
            name,
            durationHours,
            skill,
            lectures: parseCourse(text, durationHours),
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Course generation failed:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unable to create this course right now'
        }, {
            status: 502
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fc975514._.js.map