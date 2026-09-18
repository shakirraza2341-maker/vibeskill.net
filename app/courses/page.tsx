"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import VibeSkillLogo from "../../components/VibeSkillLogo";
import {
  LearningCourse,
  loadLearningCourses,
  saveLearningCourses,
} from "../../lib/storage";

export default function CoursesPage() {
  const [courses, setCourses] = useState<LearningCourse[]>([]);
  const [name, setName] = useState("");
  const [durationHours, setDurationHours] = useState(4);
  const [skill, setSkill] = useState("Beginner");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setCourses(loadLearningCourses()), []);

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreating(true);
    setError("");
    try {
      const response = await fetch("/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, durationHours, skill }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to create course");
      const nextCourses = [result as LearningCourse, ...courses];
      saveLearningCourses(nextCourses);
      setCourses(nextCourses);
      setName("");
    } catch (creationError) {
      setError(
        creationError instanceof Error
          ? creationError.message
          : "Unable to create course",
      );
    } finally {
      setIsCreating(false);
    }
  }

  function deleteCourse(id: string) {
    const nextCourses = courses.filter((course) => course.id !== id);
    saveLearningCourses(nextCourses);
    localStorage.removeItem(`am_course_progress_${id}`);
    setCourses(nextCourses);
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex h-20 max-w-[1440px] items-center justify-between border-b border-white/15 px-5 sm:h-24 sm:px-8 lg:px-14">
        <VibeSkillLogo />
        <nav className="flex items-center gap-3 sm:gap-8">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-muted sm:inline">
            Learning studio
          </span>
          <Link
            className="border border-white/30 px-3 py-2 text-[11px] font-bold transition-colors hover:bg-ink hover:text-paper sm:px-4 sm:py-2.5 sm:text-[12px]"
            href="/interviews"
          >
            Mock interviews{" "}
            <span className="ml-2 text-base" aria-hidden="true">
              ↗
            </span>
          </Link>
        </nav>
      </header>
      <main className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <section className="grid gap-10 border-b border-white/15 py-12 sm:py-16 lg:grid-cols-[150px_minmax(0,620px)_1fr] lg:gap-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-coral">
            <span>01</span>
            <p className="my-3 text-ink">Create a course</p>
            <span className="block h-px w-14 bg-coral" />
          </div>
          <form
            className="relative overflow-hidden bg-cream p-6 shadow-[10px_10px_0_var(--color-teal)] sm:p-10"
            onSubmit={createCourse}
          >
            <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full border-[18px] border-coral/20" />
            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-coral">
                AI curriculum designer
              </p>
              <h2 className="mt-3 font-display text-4xl font-medium leading-[0.92] tracking-[-0.055em] sm:text-5xl">
                What do you want
                <br />
                <em className="text-coral">to master?</em>
              </h2>
            </div>
            <div className="relative mt-9 grid gap-6">
              <div>
                <label
                  className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                  htmlFor="course-name"
                >
                  Course name
                </label>
                <input
                  className="w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted/60 focus:border-coral"
                  id="course-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Product design fundamentals"
                  required
                />
              </div>
              <div className="grid grid-cols-[1fr_110px] gap-4">
                <div>
                  <label
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                    htmlFor="course-skill"
                  >
                    Experience
                  </label>
                  <select
                    className="w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-sm outline-none focus:border-coral"
                    id="course-skill"
                    value={skill}
                    onChange={(event) => setSkill(event.target.value)}
                  >
                    <option>Beginner</option>
                    <option>Experienced</option>
                  </select>
                </div>
                <div>
                  <label
                    className="mb-2 block font-mono text-[10px] uppercase tracking-[0.1em] text-muted"
                    htmlFor="course-duration"
                  >
                    Hours
                  </label>
                  <input
                    className="w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-sm outline-none focus:border-coral"
                    id="course-duration"
                    type="number"
                    min="1"
                    max="24"
                    value={durationHours}
                    onChange={(event) =>
                      setDurationHours(Number(event.target.value))
                    }
                    required
                  />
                </div>
              </div>
              {error && (
                <p
                  className="border-l-2 border-coral bg-coral/10 px-3 py-2 text-sm text-coral"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <button
                className="flex w-full items-center justify-between bg-ink px-5 py-4 text-left text-sm font-bold text-paper transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
                disabled={isCreating}
              >
                {isCreating ? "Designing your course..." : "Generate course"}
                <strong className="text-xl font-normal">
                  {isCreating ? "..." : "↗"}
                </strong>
              </button>
            </div>
          </form>
          <div className="flex max-w-xs items-start gap-4 self-end text-sm leading-6 text-muted lg:pb-2">
            <span className="text-2xl text-coral">✦</span>
            <p>
              Every hour becomes one lecture. Every lecture becomes four clear
              moments to understand, question, and practice.
            </p>
          </div>
        </section>
        <section className="py-16 sm:py-24">
          <div className="mb-10 flex items-end justify-between gap-6 sm:mb-14">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.13em] text-muted">
                Your curriculum
              </p>
              <h2 className="font-display text-5xl font-medium leading-[0.9] tracking-[-0.06em] sm:text-7xl">
                Keep going,
                <br />
                <em className="text-coral">one hour at a time.</em>
              </h2>
            </div>
            <div className="flex items-end gap-3">
              <strong className="font-display text-5xl font-medium leading-none text-coral sm:text-7xl">
                {String(courses.length).padStart(2, "0")}
              </strong>
              <span className="mb-1 font-mono text-[10px] uppercase leading-4 tracking-[0.1em] text-muted">
                courses
                <br />
                created
              </span>
            </div>
          </div>
          {courses.length === 0 ? (
            <div className="flex items-center gap-5 border-y border-white/15 py-10 text-muted">
              <span className="text-3xl text-coral">✦</span>
              <div>
                <h3 className="font-display text-3xl text-ink">
                  Your curriculum is waiting.
                </h3>
                <p className="mt-2 text-sm">
                  Create a course above and your learning path will live here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {courses.map((course, index) => (
                <article
                  className="group border border-white/15 bg-cream p-5 transition-all duration-300 hover:-translate-y-1 hover:border-coral hover:shadow-[8px_8px_0_var(--color-teal)] sm:p-7"
                  key={course.id}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
                    <span className="text-coral">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <i className="mr-2 inline-block size-2 rounded-full bg-teal" />{" "}
                      {course.durationHours} hour path
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-6 py-7">
                    <div>
                      <h3 className="font-display text-3xl font-medium tracking-[-0.045em] sm:text-4xl">
                        {course.name}
                      </h3>
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                        <span>{course.skill}</span>
                        <span>{course.lectures.length} lectures</span>
                        <span>Gemini designed</span>
                      </div>
                    </div>
                    <span
                      className="text-3xl text-coral transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-5">
                    <Link
                      className="text-sm font-bold hover:text-coral"
                      href={`/courses/${course.id}`}
                    >
                      Open course <span className="ml-3">→</span>
                    </Link>
                    <button
                      className="text-xs text-muted underline decoration-muted/40 underline-offset-4 hover:text-coral"
                      onClick={() => deleteCourse(course.id)}
                    >
                      Delete course
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <footer className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-white/15 px-5 py-8 font-mono text-[10px] uppercase tracking-[0.08em] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-14">
        <div>
          <span className="font-sans text-base font-bold normal-case tracking-[-0.03em] text-ink">
            VibeSkill
          </span>
          <span className="ml-3 normal-case tracking-normal">
            A better conversation with your future.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span>© 2026</span>
          <Link className="text-ink hover:text-coral" href="/">
            Home ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
