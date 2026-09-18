module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/components/InterviewPage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InterviewPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function generateQuestions(topic, skill, count) {
    const qs = [];
    for(let i = 1; i <= count; i++)qs.push({
        id: i.toString(),
        text: `${topic} question ${i} (${skill})`
    });
    return qs;
}
function InterviewPage({ id }) {
    const [course, setCourse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [index, setIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [evaluation, setEvaluation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [evaluationError, setEvaluationError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Preparing interview...');
    const [sessionStarted, setSessionStarted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [liveMode, setLiveMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('ready');
    const [countdown, setCountdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(60);
    const recognitionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentAnswerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const phaseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('finished');
    const startedQuestionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const silenceTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const restartTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const resultsTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const indexRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const questionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const answersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    const courseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const introductionStartedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const closingStartedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    indexRef.current = index;
    questionsRef.current = questions;
    answersRef.current = answers;
    courseRef.current = course;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const raw = localStorage.getItem('am_courses');
        if (!raw) return;
        const arr = JSON.parse(raw);
        const found = arr.find((x)=>x.id === id);
        setCourse(found);
        if (found) setQuestions(found.questions || generateQuestions(found.title, found.skill, found.count));
    }, [
        id
    ]);
    function updateLiveMode(mode, nextStatus) {
        setLiveMode(mode);
        setStatus(nextStatus);
    }
    function clearSilenceTimer() {
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
    }
    function moveToNextQuestion() {
        clearSilenceTimer();
        phaseRef.current = 'speaking';
        recognitionRef.current?.abort?.();
        if (indexRef.current < questionsRef.current.length - 1) {
            setIndex(indexRef.current + 1);
        } else {
            finish();
        }
    }
    function startSilenceTimer() {
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(moveToNextQuestion, 5000);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const win = window;
        const SR = win.SpeechRecognition || win.webkitSpeechRecognition;
        if (!SR) {
            updateLiveMode('ready', 'Speech recognition is not supported in this browser. Type your answer below.');
            return;
        }
        const rec = new SR();
        rec.lang = 'en-US';
        rec.interimResults = true;
        rec.continuous = true;
        rec.onresult = (e)=>{
            startSilenceTimer();
            let requestedNext = false;
            for(let resultIndex = e.resultIndex; resultIndex < e.results.length; resultIndex++){
                if (!e.results[resultIndex].isFinal) continue;
                const transcript = e.results[resultIndex][0].transcript.trim();
                if (!transcript) continue;
                const commandMatch = transcript.match(/\b(next question|go to next|move on|next one)\b/i);
                if (commandMatch) {
                    const answerPart = transcript.replace(commandMatch[0], '').trim();
                    if (answerPart) currentAnswerRef.current = `${currentAnswerRef.current} ${answerPart}`.trim();
                    requestedNext = true;
                } else {
                    currentAnswerRef.current = `${currentAnswerRef.current} ${transcript}`.trim();
                }
            }
            const questionId = questionsRef.current[indexRef.current]?.id;
            if (questionId) {
                const nextAnswers = {
                    ...answersRef.current,
                    [questionId]: currentAnswerRef.current
                };
                answersRef.current = nextAnswers;
                setAnswers(nextAnswers);
            }
            if (requestedNext) moveToNextQuestion();
            else {
                updateLiveMode('listening', 'Listening...');
            }
        };
        rec.onerror = (e)=>{
            if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
                phaseRef.current = 'speaking';
                updateLiveMode('ready', 'Microphone permission is required. Type your answer below.');
            }
        };
        rec.onend = ()=>{
            if (phaseRef.current !== 'listening') return;
            if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
            restartTimerRef.current = setTimeout(()=>{
                if (phaseRef.current === 'listening') {
                    try {
                        rec.start();
                    } catch  {}
                }
            }, 100);
        };
        rec.onstart = ()=>{
            if (phaseRef.current === 'listening') {
                updateLiveMode('listening', 'Listening...');
            }
        };
        recognitionRef.current = rec;
        return ()=>{
            rec.onresult = null;
            rec.onend = null;
            rec.onerror = null;
            rec.onstart = null;
            clearSilenceTimer();
            if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
            if (resultsTimerRef.current) clearTimeout(resultsTimerRef.current);
            rec.abort();
        };
    }, []);
    function speak(text, onEnd) {
        const ut = new SpeechSynthesisUtterance(text);
        ut.onend = ()=>onEnd?.();
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(ut);
    }
    function startListening() {
        const rec = recognitionRef.current;
        if (!rec) {
            updateLiveMode('ready', 'Type your answer below.');
            return;
        }
        phaseRef.current = 'listening';
        updateLiveMode('listening', 'Listening... You can say "next question" when finished.');
        try {
            rec.start();
        } catch  {
            updateLiveMode('ready', 'Microphone permission is required. Type your answer below.');
        }
    }
    function finish() {
        if (closingStartedRef.current) return;
        closingStartedRef.current = true;
        clearSilenceTimer();
        recognitionRef.current?.abort?.();
        phaseRef.current = 'speaking';
        updateLiveMode('reviewing', 'Wrapping up the interview...');
        const showResults = ()=>{
            if (resultsTimerRef.current) clearTimeout(resultsTimerRef.current);
            void evaluateInterview();
        };
        speak('Thank you for completing this mock interview. You did a great job. Goodbye, and here are your results.', showResults);
        resultsTimerRef.current = setTimeout(showResults, 8000);
    }
    async function evaluateInterview() {
        phaseRef.current = 'finished';
        updateLiveMode('reviewing', 'Gemini is evaluating your interview...');
        setEvaluationError('');
        try {
            const response = await fetch('/api/evaluate-interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: courseRef.current?.title,
                    skill: courseRef.current?.skill,
                    items: questionsRef.current.map((question)=>({
                            question: question.text,
                            answer: answersRef.current[question.id] || ''
                        }))
                })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Unable to evaluate the interview');
            setEvaluation(result);
            setIndex(questionsRef.current.length);
            updateLiveMode('complete', 'Interview complete. Review your results below.');
        } catch (error) {
            setEvaluationError(error instanceof Error ? error.message : 'Unable to evaluate the interview');
            updateLiveMode('ready', 'Evaluation failed. Please try again.');
        }
    }
    function askQuestion(questionIndex) {
        const question = questionsRef.current[questionIndex];
        if (!question || closingStartedRef.current) return;
        startedQuestionRef.current = question.id;
        currentAnswerRef.current = answers[question.id] || '';
        phaseRef.current = 'speaking';
        updateLiveMode('speaking', 'Asking question...');
        speak(question.text, startListening);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const q = questions[index];
        if (!course || !q || startedQuestionRef.current === q.id || closingStartedRef.current) return;
        if (!introductionStartedRef.current) {
            introductionStartedRef.current = true;
            setSessionStarted(true);
            phaseRef.current = 'speaking';
            updateLiveMode('speaking', 'Welcome to your mock interview...');
            speak(`Welcome to your mock interview for ${course.title}. I will ask you ${questions.length} questions. Take your time, speak naturally, and say next question whenever you are ready to continue.`, ()=>askQuestion(0));
            return;
        }
        setSessionStarted(true);
        askQuestion(index);
    }, [
        course,
        questions,
        index
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!sessionStarted || index >= questions.length || evaluation) return;
        setCountdown(60);
        const timer = setInterval(()=>{
            setCountdown((current)=>{
                if (current <= 1) {
                    moveToNextQuestion();
                    return 0;
                }
                return current - 1;
            });
        }, 1000);
        return ()=>clearInterval(timer);
    }, [
        sessionStarted,
        index,
        questions.length,
        evaluation
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>()=>{
            window.speechSynthesis.cancel();
            if (resultsTimerRef.current) clearTimeout(resultsTimerRef.current);
            recognitionRef.current?.abort?.();
        }, []);
    const progressValue = questions.length ? (index + 1) / questions.length * 100 : 0;
    const currentQuestion = questions[index];
    if (!course) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.empty,
        children: "Course not found"
    }, void 0, false, {
        fileName: "[project]/components/InterviewPage.tsx",
        lineNumber: 283,
        columnNumber: 22
    }, this);
    if (index >= questions.length && evaluation) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: styles.pageShell,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.mainCard,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.headerRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.kicker,
                                        children: "Interview summary"
                                    }, void 0, false, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 291,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: styles.h2,
                                        children: course.title
                                    }, void 0, false, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 292,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/InterviewPage.tsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.scorePill,
                                children: [
                                    Math.round(evaluation.percentage),
                                    "% score"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/InterviewPage.tsx",
                                lineNumber: 294,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/InterviewPage.tsx",
                        lineNumber: 289,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.resultsHero,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.metricLabel,
                                        children: "Overall performance"
                                    }, void 0, false, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 299,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.metricValue,
                                        children: [
                                            Math.round(evaluation.percentage),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 300,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/InterviewPage.tsx",
                                lineNumber: 298,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.progressTrack,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                ...styles.progressFill,
                                                width: `${evaluation.percentage}%`
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/InterviewPage.tsx",
                                            lineNumber: 304,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.metricMeta,
                                        children: [
                                            "Total score: ",
                                            evaluation.total,
                                            " / ",
                                            questions.length * 10
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 306,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/InterviewPage.tsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/InterviewPage.tsx",
                        lineNumber: 297,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.summaryBox,
                        children: evaluation.summary
                    }, void 0, false, {
                        fileName: "[project]/components/InterviewPage.tsx",
                        lineNumber: 310,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.questionList,
                        children: evaluation.evaluations.map((result, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: styles.answerCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.questionHeading,
                                        children: [
                                            "Question ",
                                            i + 1
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 315,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.answerTitle,
                                        children: result.question || questions[i]?.text
                                    }, void 0, false, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 316,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.answerRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Answer:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/InterviewPage.tsx",
                                                lineNumber: 317,
                                                columnNumber: 47
                                            }, this),
                                            " ",
                                            result.answer || answers[questions[i]?.id] || 'No answer provided'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 317,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.answerRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Score:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/InterviewPage.tsx",
                                                lineNumber: 318,
                                                columnNumber: 47
                                            }, this),
                                            " ",
                                            result.score,
                                            " / 10"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 318,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: styles.answerRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Feedback:"
                                            }, void 0, false, {
                                                fileName: "[project]/components/InterviewPage.tsx",
                                                lineNumber: 319,
                                                columnNumber: 47
                                            }, this),
                                            " ",
                                            result.feedback
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/InterviewPage.tsx",
                                        lineNumber: 319,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/components/InterviewPage.tsx",
                                lineNumber: 314,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/InterviewPage.tsx",
                        lineNumber: 312,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/InterviewPage.tsx",
                lineNumber: 288,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/InterviewPage.tsx",
            lineNumber: 287,
            columnNumber: 7
        }, this);
    }
    if (index >= questions.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: styles.pageShell,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: styles.mainCard,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.kicker,
                        children: "Interview status"
                    }, void 0, false, {
                        fileName: "[project]/components/InterviewPage.tsx",
                        lineNumber: 332,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: styles.h2,
                        children: course.title
                    }, void 0, false, {
                        fileName: "[project]/components/InterviewPage.tsx",
                        lineNumber: 333,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: styles.loadingState,
                        children: evaluationError || 'Gemini is preparing your results...'
                    }, void 0, false, {
                        fileName: "[project]/components/InterviewPage.tsx",
                        lineNumber: 334,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/InterviewPage.tsx",
                lineNumber: 331,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/InterviewPage.tsx",
            lineNumber: 330,
            columnNumber: 7
        }, this);
    }
    const q = currentQuestion;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: styles.pageShell,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: styles.mainCard,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.headerRow,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.kicker,
                                    children: "Live mock interview"
                                }, void 0, false, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 347,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: styles.h2,
                                    children: course.title
                                }, void 0, false, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 348,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 346,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.statusBadge(liveMode),
                            children: liveMode === 'listening' ? 'Listening' : liveMode === 'speaking' ? 'Speaking' : liveMode === 'reviewing' ? 'Reviewing' : 'Ready'
                        }, void 0, false, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 350,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/InterviewPage.tsx",
                    lineNumber: 345,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.topMetaRow,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.metaCard,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.metaLabel,
                                    children: "Question"
                                }, void 0, false, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 355,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.metaValue,
                                    children: [
                                        index + 1,
                                        " / ",
                                        questions.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 356,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 354,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.metaCard,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.metaLabel,
                                    children: "Skill"
                                }, void 0, false, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 359,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.metaValue,
                                    children: course.skill || 'General'
                                }, void 0, false, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 360,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 358,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.metaCard,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.metaLabel,
                                    children: "Timer"
                                }, void 0, false, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 363,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: styles.metaValue,
                                    children: [
                                        countdown,
                                        "s"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 364,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 362,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/InterviewPage.tsx",
                    lineNumber: 353,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.progressTrack,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            ...styles.progressFill,
                            width: `${progressValue}%`
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/InterviewPage.tsx",
                        lineNumber: 369,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/InterviewPage.tsx",
                    lineNumber: 368,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.questionPanel,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.questionTag,
                            children: "Prompt"
                        }, void 0, false, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 373,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.questionText,
                            children: q.text
                        }, void 0, false, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 374,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.statusLine,
                            children: status
                        }, void 0, false, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 375,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/InterviewPage.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.answerPanel,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: styles.panelHeader,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Your answer"
                                }, void 0, false, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 380,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: styles.helperText,
                                    children: "Speak naturally or type here"
                                }, void 0, false, {
                                    fileName: "[project]/components/InterviewPage.tsx",
                                    lineNumber: 381,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 379,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            "aria-label": "Your answer",
                            value: answers[q.id] || '',
                            onChange: (e)=>{
                                const nextAnswers = {
                                    ...answersRef.current,
                                    [q.id]: e.target.value
                                };
                                answersRef.current = nextAnswers;
                                setAnswers(nextAnswers);
                            },
                            rows: 6,
                            style: styles.textarea,
                            placeholder: "Share your response here..."
                        }, void 0, false, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 383,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/InterviewPage.tsx",
                    lineNumber: 378,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: styles.actionRow,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            style: styles.secondaryButton,
                            onClick: ()=>{
                                if (!q) return;
                                speak(q.text, startListening);
                                updateLiveMode('speaking', 'Repeating question...');
                            },
                            children: "Repeat question"
                        }, void 0, false, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 398,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            style: styles.primaryButton,
                            onClick: ()=>{
                                if (index < questions.length - 1) setIndex(index + 1);
                                else finish();
                            },
                            children: index < questions.length - 1 ? 'Next question' : 'Finish interview'
                        }, void 0, false, {
                            fileName: "[project]/components/InterviewPage.tsx",
                            lineNumber: 405,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/InterviewPage.tsx",
                    lineNumber: 397,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/InterviewPage.tsx",
            lineNumber: 344,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/InterviewPage.tsx",
        lineNumber: 343,
        columnNumber: 5
    }, this);
}
const styles = {
    pageShell: {
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, rgba(87, 157, 255, 0.12), transparent 38%), linear-gradient(180deg, #f5f7fb 0%, #eef2f8 100%)',
        padding: '32px 20px',
        fontFamily: 'Inter, Segoe UI, sans-serif',
        color: '#0f172a'
    },
    mainCard: {
        maxWidth: 1100,
        margin: '0 auto',
        background: 'rgba(255,255,255,0.76)',
        border: '1px solid rgba(148,163,184,0.22)',
        boxShadow: '0 24px 70px rgba(15, 23, 42, 0.12)',
        backdropFilter: 'blur(16px)',
        borderRadius: 28,
        padding: '28px 28px 28px'
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        marginBottom: 18
    },
    kicker: {
        fontSize: 11,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: '#6366f1',
        fontWeight: 700,
        marginBottom: 8
    },
    h2: {
        margin: 0,
        fontSize: 'clamp(2rem, 3vw, 3rem)',
        lineHeight: 1.05,
        letterSpacing: '-0.04em'
    },
    statusBadge: (mode)=>({
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            borderRadius: 999,
            padding: '8px 12px',
            background: mode === 'listening' ? '#dcfce7' : mode === 'speaking' ? '#dbeafe' : mode === 'reviewing' ? '#fef3c7' : '#e2e8f0',
            color: mode === 'listening' ? '#166534' : mode === 'speaking' ? '#1d4ed8' : mode === 'reviewing' ? '#92400e' : '#334155'
        }),
    topMetaRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: 16,
        marginBottom: 18
    },
    metaCard: {
        background: '#f8fafc',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: 18,
        padding: '14px 16px'
    },
    metaLabel: {
        fontSize: 11,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: 8
    },
    metaValue: {
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '-0.03em'
    },
    progressTrack: {
        width: '100%',
        height: 12,
        background: '#e2e8f0',
        borderRadius: 999,
        overflow: 'hidden',
        marginBottom: 24
    },
    progressFill: {
        height: '100%',
        borderRadius: 999,
        background: 'linear-gradient(90deg, #4f46e5 0%, #14b8a6 100%)',
        transition: 'width 0.35s ease'
    },
    questionPanel: {
        background: 'linear-gradient(135deg, rgba(79,70,229,0.08), rgba(20,184,166,0.05))',
        border: '1px solid rgba(99,102,241,0.16)',
        borderRadius: 24,
        padding: '22px 20px 18px'
    },
    questionTag: {
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#4f46e5',
        fontWeight: 700,
        marginBottom: 12
    },
    questionText: {
        fontSize: 'clamp(1.35rem, 2vw, 2.1rem)',
        lineHeight: 1.35,
        letterSpacing: '-0.04em',
        fontWeight: 600,
        color: '#0f172a'
    },
    statusLine: {
        marginTop: 18,
        color: '#334155',
        fontSize: 15,
        fontWeight: 500
    },
    answerPanel: {
        marginTop: 22,
        border: '1px solid rgba(148,163,184,0.24)',
        borderRadius: 24,
        padding: 18,
        background: '#f8fafc'
    },
    panelHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        alignItems: 'center',
        marginBottom: 12,
        fontWeight: 700,
        color: '#0f172a'
    },
    helperText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: 500
    },
    textarea: {
        width: '100%',
        resize: 'vertical',
        minHeight: 170,
        border: '1px solid rgba(148,163,184,0.5)',
        borderRadius: 18,
        background: '#fff',
        padding: '18px 16px',
        fontSize: 16,
        lineHeight: 1.6,
        color: '#0f172a',
        boxSizing: 'border-box',
        outline: 'none'
    },
    actionRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 14,
        marginTop: 22,
        flexWrap: 'wrap'
    },
    primaryButton: {
        background: 'linear-gradient(135deg, #111827 0%, #334155 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 14,
        padding: '14px 20px',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer'
    },
    secondaryButton: {
        background: '#fff',
        color: '#0f172a',
        border: '1px solid rgba(148,163,184,0.5)',
        borderRadius: 14,
        padding: '14px 20px',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer'
    },
    empty: {
        maxWidth: 500,
        margin: '40px auto',
        padding: '32px 24px',
        textAlign: 'center',
        borderRadius: 20,
        background: '#fff',
        border: '1px solid rgba(148,163,184,0.18)',
        fontSize: 20,
        fontWeight: 600,
        color: '#0f172a'
    },
    resultsHero: {
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        background: '#f8fafc',
        borderRadius: 22,
        border: '1px solid rgba(148,163,184,0.2)',
        padding: '20px 18px',
        margin: '24px 0 18px'
    },
    metricLabel: {
        fontSize: 11,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#64748b',
        marginBottom: 8
    },
    metricValue: {
        fontSize: 44,
        letterSpacing: '-0.05em',
        fontWeight: 800,
        color: '#0f172a'
    },
    metricMeta: {
        marginTop: 8,
        fontSize: 14,
        color: '#475569',
        fontWeight: 600
    },
    scorePill: {
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 999,
        background: '#ecfeff',
        color: '#0f766e',
        fontWeight: 700,
        padding: '8px 12px',
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase'
    },
    summaryBox: {
        background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(59,130,246,0.08))',
        border: '1px solid rgba(20,184,166,0.15)',
        borderRadius: 18,
        padding: '16px 18px',
        color: '#0f172a',
        lineHeight: 1.65,
        marginBottom: 18
    },
    questionList: {
        display: 'grid',
        gap: 16
    },
    answerCard: {
        background: '#fff',
        border: '1px solid rgba(148,163,184,0.2)',
        borderRadius: 18,
        padding: '18px 18px 16px',
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.04)'
    },
    questionHeading: {
        fontSize: 11,
        color: '#4f46e5',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: 8
    },
    answerTitle: {
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: '-0.02em'
    },
    answerRow: {
        marginTop: 8,
        lineHeight: 1.6,
        color: '#1e293b'
    },
    loadingState: {
        marginTop: 18,
        padding: '16px 18px',
        borderRadius: 16,
        background: '#f8fafc',
        border: '1px solid rgba(148,163,184,0.2)',
        fontSize: 16,
        color: '#334155'
    }
};
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e1d6d7f3._.js.map