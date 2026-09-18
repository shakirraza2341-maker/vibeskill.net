"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import VibeSkillLogo from "../../../components/VibeSkillLogo";

type Question = { id: string; text: string };
type Interview = {
  id: string;
  title: string;
  skill: string;
  count: number;
  questions: Question[];
};
type AnswerItem = { question: string; answer: string };
type Evaluation = {
  question: string;
  answer: string;
  score: number;
  feedback: string;
};
type Report = {
  evaluations: Evaluation[];
  total: number;
  percentage: number;
  summary: string;
};

type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => Recognition;
    SpeechRecognition?: new () => Recognition;
  }
}

export default function CourseInterview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<
    "ready" | "active" | "evaluating" | "complete"
  >("ready");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const answerRef = useRef("");

  useEffect(() => {
    let mounted = true;
    params.then(({ id }) => {
      if (!mounted) return;
      try {
        const saved = JSON.parse(
          localStorage.getItem("am_courses") || "[]",
        ) as Interview[];
        const found = saved.find((item) => item.id === id);
        if (!found) setError("This interview room could not be found.");
        else setInterview(found);
      } catch {
        setError("Unable to load this interview room.");
      }
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [params]);

  useEffect(() => {
    answerRef.current = answer;
    if (status !== "active" || !answer.trim()) {
      setCountdown(null);
      return;
    }
    setCountdown(5);
    const interval = window.setInterval(
      () => setCountdown((value) => (value && value > 1 ? value - 1 : 0)),
      1000,
    );
    const timeout = window.setTimeout(() => advance(), 5000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [answer, status]);

  useEffect(
    () => () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    },
    [],
  );

  function speak(text: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setError(
        "Voice input is not supported in this browser. You can type your answer instead.",
      );
      return;
    }
    if (!recognitionRef.current) {
      const recognition = new Recognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        let transcript = "";
        for (let index = 0; index < event.results.length; index += 1)
          transcript += event.results[index][0].transcript;
        setAnswer(transcript.trim());
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        setError("Voice input stopped. You can continue by typing.");
      };
      recognitionRef.current = recognition;
    }
    setError("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setError(
        "Voice input is already starting. Please try again in a moment.",
      );
    }
  }

  function begin() {
    if (!interview?.questions.length) return;
    setStatus("active");
    speak(
      `Hello, and welcome to your ${interview.title} mock interview. Take your time, think clearly, and answer naturally. Here is your first question: ${interview.questions[0].text}`,
    );
    window.setTimeout(startListening, 500);
  }

  async function advance() {
    if (!interview || status !== "active") return;
    recognitionRef.current?.stop();
    const nextAnswers = [
      ...answers,
      {
        question: interview.questions[questionIndex].text,
        answer: answerRef.current.trim() || "No answer provided.",
      },
    ];
    setAnswers(nextAnswers);
    setAnswer("");
    if (questionIndex + 1 < interview.questions.length) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      speak(interview.questions[nextIndex].text);
      window.setTimeout(startListening, 500);
      return;
    }
    setStatus("evaluating");
    try {
      const response = await fetch("/api/evaluate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: interview.title,
          skill: interview.skill,
          items: nextAnswers,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to evaluate interview");
      setReport(result);
      setStatus("complete");
      speak(
        "Thank you for your thoughtful answers. Your interview is complete. Goodbye, and keep practicing.",
      );
    } catch (evaluationError) {
      setError(
        evaluationError instanceof Error
          ? evaluationError.message
          : "Unable to evaluate interview",
      );
      setStatus("active");
    }
  }

  if (isLoading)
    return (
      <div className="interview-shell">
        <p className="eyebrow">Loading practice room</p>
        <h1>
          Preparing your
          <br />
          <em>conversation.</em>
        </h1>
      </div>
    );
  if (error && !interview)
    return (
      <div className="interview-shell">
        <Link className="back-link" href="/interviews">
          ← Practice library
        </Link>
        <div className="interview-empty">
          <p className="eyebrow">Room unavailable</p>
          <h1>
            That room
            <br />
            <em>moved on.</em>
          </h1>
          <p>{error}</p>
        </div>
      </div>
    );
  if (!interview) return null;

  const currentQuestion = interview.questions[questionIndex];
  return (
    <div className="interview-shell">
      <header className="site-header">
        <VibeSkillLogo />
        <Link className="nav-cta" href="/interviews">
          Exit room <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main>
        <section className="interview-heading">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-dot" /> Live practice room
            </p>
            <h1>
              {interview.title}
              <br />
              <em>in conversation.</em>
            </h1>
          </div>
          <div className="interview-meta">
            <span>{interview.skill}</span>
            <strong>
              {String(interview.questions.length).padStart(2, "0")}
            </strong>
            <small>questions</small>
          </div>
        </section>
        {status === "ready" && (
          <section className="interview-start">
            <p className="eyebrow">A private voice-led session</p>
            <h2>
              Let’s make this
              <br />
              <em>feel familiar.</em>
            </h2>
            <p>
              Your interviewer will ask each question aloud. Answer naturally by
              voice or text, and the next question will arrive automatically
              after five seconds.
            </p>
            <button className="start-interview" onClick={begin}>
              Start interview <span>↗</span>
            </button>
          </section>
        )}
        {status === "active" && (
          <section className="conversation-panel">
            <div className="conversation-top">
              <span>
                Question {String(questionIndex + 1).padStart(2, "0")} /{" "}
                {String(interview.questions.length).padStart(2, "0")}
              </span>
              <span className={isListening ? "live-indicator" : ""}>
                {isListening ? "Listening" : "Voice ready"}
              </span>
            </div>
            <div className="question-block">
              <span className="question-mark">“</span>
              <h2>{currentQuestion.text}</h2>
            </div>
            <div className="answer-area">
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Your answer will appear here..."
                aria-label="Your interview answer"
              />
              <button
                className={isListening ? "mic-button listening" : "mic-button"}
                onClick={
                  isListening
                    ? () => recognitionRef.current?.stop()
                    : startListening
                }
                aria-label={
                  isListening ? "Stop listening" : "Start voice answer"
                }
              >
                {isListening ? "■" : "◉"}
              </button>
            </div>
            <div className="conversation-status">
              {countdown !== null ? (
                <span>
                  Next question in <strong>{countdown}s</strong>
                </span>
              ) : (
                <span>Speak or type your answer to continue</span>
              )}
              <span>Auto-advance enabled</span>
            </div>
            {error && (
              <p className="inline-error" role="alert">
                {error}
              </p>
            )}
          </section>
        )}
        {status === "evaluating" && (
          <section className="interview-start">
            <p className="eyebrow">Interview complete</p>
            <h2>
              Reading the
              <br />
              <em>room.</em>
            </h2>
            <p>
              We are reviewing your answers for clarity, relevance, and
              completeness.
            </p>
            <div className="report-loader" />
          </section>
        )}
        {status === "complete" && report && (
          <section className="report-section">
            <div className="report-hero">
              <div>
                <p className="eyebrow">Your interview report</p>
                <h2>
                  Strong conversations
                  <br />
                  <em>start here.</em>
                </h2>
                <p>{report.summary}</p>
              </div>
              <div className="score-ring">
                <strong>{Math.round(report.percentage)}%</strong>
                <span>overall score</span>
              </div>
            </div>
            <div className="report-list">
              {report.evaluations.map((evaluation, index) => (
                <article
                  className="report-item"
                  key={`${evaluation.question}-${index}`}
                >
                  <div className="report-item-top">
                    <span>0{index + 1}</span>
                    <strong>{evaluation.score}/10</strong>
                  </div>
                  <h3>{evaluation.question}</h3>
                  <p className="report-answer">“{evaluation.answer}”</p>
                  <p>{evaluation.feedback}</p>
                </article>
              ))}
            </div>
            <Link className="back-link report-back" href="/interviews">
              Return to practice library ↗
            </Link>
          </section>
        )}
      </main>
      <footer className="site-footer">
        <span>VibeSkill / Voice practice studio</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
