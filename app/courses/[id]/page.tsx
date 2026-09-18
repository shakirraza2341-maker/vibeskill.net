"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import VibeSkillLogo from "../../../components/VibeSkillLogo";
import { LearningCourse, loadLearningCourses } from "../../../lib/storage";

type Progress = {
  lectureIndex: number;
  bulletIndex: number;
  completed: string[];
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

export default function CourseDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [course, setCourse] = useState<LearningCourse | null>(null);
  const [progress, setProgress] = useState<Progress>({
    lectureIndex: 0,
    bulletIndex: 0,
    completed: [],
  });
  const [question, setQuestion] = useState("");
  const [hasQuestion, setHasQuestion] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [checkAnswer, setCheckAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [hasExplained, setHasExplained] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef<Recognition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      const found = loadLearningCourses().find((item) => item.id === id);
      if (found) {
        setCourse(found);
        try {
          setProgress(
            JSON.parse(
              localStorage.getItem(`am_course_progress_${id}`) ||
                '{"lectureIndex":0,"bulletIndex":0,"completed":[]}',
            ),
          );
        } catch {
          /* Start fresh when progress is malformed. */
        }
      }
      setLoading(false);
    });
  }, [params]);

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

  function exportCoursePdf() {
    window.print();
  }

  function startListening() {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceError(
        "Voice input is not supported in this browser. Type your answer instead.",
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
        setCheckAnswer(transcript.trim());
      };
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        setVoiceError("Voice input stopped. You can continue by typing.");
      };
      recognitionRef.current = recognition;
    }
    setVoiceError("");
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setVoiceError("Voice input is already starting. Please try again.");
    }
  }

  useEffect(() => {
    if (!course) return;
    const current =
      course.lectures[progress.lectureIndex]?.bullets[progress.bulletIndex];
    const currentBullet =
      typeof current === "string"
        ? {
            point: current,
            explanation: current,
            question: "How would you apply this idea in practice?",
          }
        : current;
    if (
      !currentBullet ||
      progress.completed.includes(
        `${course.lectures[progress.lectureIndex].id}-${progress.bulletIndex}`,
      )
    )
      return;
    setIsChecking(true);
    speak(
      `${currentBullet.point}. ${currentBullet.explanation}. Now answer this question: ${currentBullet.question}`,
    );
    const timer = window.setTimeout(startListening, 900);
    return () => {
      window.clearTimeout(timer);
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, [course, progress.lectureIndex, progress.bulletIndex, progress.completed]);

  function persist(next: Progress) {
    if (!course) return;
    setProgress(next);
    localStorage.setItem(
      `am_course_progress_${course.id}`,
      JSON.stringify(next),
    );
  }

  function completeBullet() {
    if (!course) return;
    const lecture = course.lectures[progress.lectureIndex];
    const bulletId = `${lecture.id}-${progress.bulletIndex}`;
    const completed = progress.completed.includes(bulletId)
      ? progress.completed
      : [...progress.completed, bulletId];
    const isLastBullet = progress.bulletIndex === lecture.bullets.length - 1;
    const isLastLecture = progress.lectureIndex === course.lectures.length - 1;
    if (!isLastBullet)
      persist({
        ...progress,
        bulletIndex: progress.bulletIndex + 1,
        completed,
      });
    else if (!isLastLecture)
      persist({
        ...progress,
        lectureIndex: progress.lectureIndex + 1,
        bulletIndex: 0,
        completed,
      });
    else persist({ ...progress, completed });
    setHasQuestion(false);
    setQuestionAnswered(false);
    setQuestion("");
    setIsChecking(false);
    setCheckAnswer("");
    setHasExplained(false);
    setVoiceError("");
    recognitionRef.current?.stop();
  }

  function askQuestion(event: React.FormEvent) {
    event.preventDefault();
    if (!question.trim()) return;
    setQuestionAnswered(true);
  }

  function submitUnderstanding(event: React.FormEvent) {
    event.preventDefault();
    if (!checkAnswer.trim()) return;
    setQuestionAnswered(true);
    recognitionRef.current?.stop();
  }

  function repeatPoint() {
    setQuestionAnswered(false);
    setHasQuestion(false);
    setCheckAnswer("");
    setIsChecking(true);
    recognitionRef.current?.stop();
    speak(
      `${bulletData.point}. ${bulletData.explanation}. Now answer this question: ${bulletData.question}`,
    );
    window.setTimeout(startListening, 900);
  }

  if (loading)
    return (
      <div className="course-detail-page">
        <p className="eyebrow">Loading course</p>
        <h1>
          Opening your
          <br />
          <em>curriculum.</em>
        </h1>
      </div>
    );
  if (!course)
    return (
      <div className="course-detail-page">
        <Link className="back-link" href="/courses">
          ← All courses
        </Link>
        <div className="course-not-found">
          <p className="eyebrow">Course unavailable</p>
          <h1>
            This path
            <br />
            <em>is missing.</em>
          </h1>
          <p>Return to your course library to create a new learning path.</p>
        </div>
      </div>
    );

  const lecture = course.lectures[progress.lectureIndex];
  const rawBullet = lecture.bullets[progress.bulletIndex];
  const bulletData =
    typeof rawBullet === "string"
      ? {
          point: rawBullet,
          explanation: rawBullet,
          question: "How would you apply this idea in practice?",
        }
      : rawBullet;
  const bullet = bulletData.point;
  const bulletId = `${lecture.id}-${progress.bulletIndex}`;
  const isComplete = progress.completed.includes(bulletId);
  const totalBullets = course.lectures.reduce(
    (total, item) => total + item.bullets.length,
    0,
  );
  const completedCount = progress.completed.length;
  const finished = completedCount >= totalBullets;

  return (
    <div className="course-detail-page">
      <header className="site-header">
        <VibeSkillLogo />
        <Link className="nav-cta" href="/courses">
          Course library <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <main>
        <section className="course-detail-heading">
          <div>
            <Link className="back-link" href="/courses">
              ← All courses
            </Link>
            <p className="eyebrow course-detail-kicker">Your learning path</p>
            <h1>
              {course.name}
              <br />
              <em>in practice.</em>
            </h1>
          </div>
          <div className="course-detail-stats">
            <strong>{course.durationHours}</strong>
            <span>
              hours
              <br />
              to explore
            </span>
          </div>
          <button className="course-export-button" onClick={exportCoursePdf}>
            Export PDF <span aria-hidden="true">↓</span>
          </button>
        </section>
        <section className="course-progress">
          <div>
            <span>Progress</span>
            <strong>
              {Math.round((completedCount / totalBullets) * 100)}%
            </strong>
          </div>
          <div className="progress-track">
            <span
              style={{ width: `${(completedCount / totalBullets) * 100}%` }}
            />
          </div>
          <small>
            {completedCount} of {totalBullets} learning points complete
          </small>
        </section>
        {finished ? (
          <section className="course-complete">
            <p className="eyebrow">Path complete</p>
            <h2>
              You built a new
              <br />
              <em>way forward.</em>
            </h2>
            <p>
              You worked through every lecture and learning point in this
              course. Return whenever you want to revisit the ideas.
            </p>
            <Link className="start-link" href="/courses">
              Back to courses <span>→</span>
            </Link>
          </section>
        ) : (
          <section className="lesson-layout">
            <aside className="lecture-rail">
              <div className="lecture-rail-header">
                <div>
                  <span className="eyebrow">Course outline</span>
                  <p>Follow the path hour by hour.</p>
                </div>
                <span className="lecture-rail-count">
                  {completedCount}/{totalBullets}
                  <small>points</small>
                </span>
              </div>
              <div className="lecture-status-key" aria-label="Outline status">
                <span>
                  <i className="status-dot current-dot" /> Discussing
                </span>
                <span>
                  <i className="status-dot discussed-dot" /> Discussed
                </span>
              </div>
              {course.lectures.map((item, index) => (
                <div
                  className={
                    index === progress.lectureIndex
                      ? "lecture-nav active"
                      : "lecture-nav"
                  }
                  key={item.id}
                >
                  <div className="lecture-heading">
                    <span className="lecture-hour">
                      Hour {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <small className="lecture-nav-meta">
                        {
                          item.bullets.filter((_, bulletIndex) =>
                            progress.completed.includes(
                              `${item.id}-${bulletIndex}`,
                            ),
                          ).length
                        }
                        /{item.bullets.length} points discussed
                      </small>
                    </div>
                    {index === progress.lectureIndex && (
                      <small className="lecture-active-label">
                        Current hour
                      </small>
                    )}
                  </div>
                  <ol className="lecture-points">
                    {item.bullets.map((rawPoint, bulletIndex) => {
                      const point =
                        typeof rawPoint === "string"
                          ? rawPoint
                          : rawPoint.point;
                      const isCurrent =
                        index === progress.lectureIndex &&
                        bulletIndex === progress.bulletIndex;
                      const isDiscussed = progress.completed.includes(
                        `${item.id}-${bulletIndex}`,
                      );
                      return (
                        <li
                          className={
                            isCurrent
                              ? "lecture-point current"
                              : isDiscussed
                                ? "lecture-point discussed"
                                : "lecture-point"
                          }
                          key={`${item.id}-${bulletIndex}`}
                        >
                          <span className="point-index">
                            {String(bulletIndex + 1).padStart(2, "0")}
                          </span>
                          <span className="point-copy">{point}</span>
                          {isCurrent && (
                            <small
                              className="point-status"
                              aria-label="Currently discussed"
                            >
                              Discussing now
                            </small>
                          )}
                          {!isCurrent && isDiscussed && (
                            <small className="point-status discussed-status">
                              Discussed
                            </small>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              ))}
            </aside>
            <article className="lesson-card">
              <div className="lesson-top">
                <span>
                  Lecture {String(progress.lectureIndex + 1).padStart(2, "0")} /{" "}
                  {String(course.lectures.length).padStart(2, "0")}
                </span>
                <span>{course.skill}</span>
              </div>
              <h2>{lecture.title}</h2>
              <div className="bullet-context">
                <span>
                  Learning point {progress.bulletIndex + 1} of{" "}
                  {lecture.bullets.length}
                </span>
                <div className="bullet-dots">
                  {lecture.bullets.map((_, index) => (
                    <i
                      className={index <= progress.bulletIndex ? "current" : ""}
                      key={index}
                    />
                  ))}
                </div>
              </div>
              <div
                className={
                  isComplete ? "bullet-focus complete" : "bullet-focus"
                }
              >
                <span className="bullet-number">
                  0{progress.bulletIndex + 1}
                </span>
                <div>
                  <span className="discussion-status">Discussing now</span>
                  <p>{bullet}</p>
                </div>
              </div>
              {!hasQuestion && !questionAnswered && !isChecking && (
                <div className="lesson-actions">
                  <button
                    onClick={() => setIsChecking(true)}
                    disabled={isComplete}
                  >
                    I understand <span>↗</span>
                  </button>
                  <button
                    className="quiet-action"
                    onClick={() => setHasQuestion(true)}
                  >
                    I have a question <span>?</span>
                  </button>
                </div>
              )}
              {isChecking && !questionAnswered && (
                <form className="question-form" onSubmit={submitUnderstanding}>
                  <label htmlFor="understanding-check">
                    Show your understanding in your own words
                  </label>
                  <p className="check-prompt">
                    How would you use this idea in practice?
                  </p>
                  <textarea
                    id="understanding-check"
                    value={checkAnswer}
                    onChange={(event) => setCheckAnswer(event.target.value)}
                    placeholder="Describe your understanding..."
                    autoFocus
                    required
                  />
                  <button type="submit">
                    Check my understanding <span>↗</span>
                  </button>
                  <button
                    type="button"
                    className="quiet-action"
                    onClick={repeatPoint}
                  >
                    Repeat this point <span>↺</span>
                  </button>
                </form>
              )}
              {hasQuestion && !questionAnswered && (
                <form className="question-form" onSubmit={askQuestion}>
                  <label htmlFor="bullet-question">
                    What would you like to understand?
                  </label>
                  <textarea
                    id="bullet-question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask about this learning point..."
                    autoFocus
                    required
                  />
                  <button type="submit">
                    Submit question <span>↗</span>
                  </button>
                </form>
              )}
              {questionAnswered && (
                <div className="question-response">
                  <span className="eyebrow">Ready for your next point?</span>
                  <p>
                    {isChecking
                      ? "You explained the idea in your own words. Continue when it feels clear, or repeat this point for another pass."
                      : "Your question is captured. Continue when you feel satisfied, or repeat this point for another pass."}
                  </p>
                  <button onClick={completeBullet}>
                    Continue to next point <span>→</span>
                  </button>
                </div>
              )}
            </article>
          </section>
        )}
      </main>
      <section className="pdf-export-document" aria-label="Printable course">
        <div className="pdf-export-header">
          <span>VibeSkill / Guided learning studio</span>
          <span>{course.skill}</span>
        </div>
        <p className="eyebrow">Complete learning path</p>
        <h1>{course.name}</h1>
        <p className="pdf-export-meta">
          {course.durationHours} hours to explore · {totalBullets} learning
          points
        </p>
        {course.lectures.map((item, lectureIndex) => (
          <article className="pdf-export-lecture" key={item.id}>
            <p className="eyebrow">
              Lecture {String(lectureIndex + 1).padStart(2, "0")}
            </p>
            <h2>{item.title}</h2>
            <ol>
              {item.bullets.map((rawPoint, bulletIndex) => {
                const point =
                  typeof rawPoint === "string"
                    ? {
                        point: rawPoint,
                        explanation: rawPoint,
                        question:
                          "How would you apply this idea in practice?",
                      }
                    : rawPoint;
                return (
                  <li key={`${item.id}-${bulletIndex}`}>
                    <h3>{point.point}</h3>
                    <p>{point.explanation}</p>
                    <p className="pdf-export-question">
                      Reflect: {point.question}
                    </p>
                  </li>
                );
              })}
            </ol>
          </article>
        ))}
      </section>
      <footer className="site-footer">
        <span>VibeSkill / Guided learning studio</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}
