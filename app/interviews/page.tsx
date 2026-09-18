"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import InterviewForm from "../../components/InterviewForm";
import InterviewList from "../../components/InterviewList";
import VibeSkillLogo from "../../components/VibeSkillLogo";

export default function InterviewPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const raw = localStorage.getItem("am_courses");
    if (raw) setCourses(JSON.parse(raw));
  }, []);

  function save(list: any[]) {
    setCourses(list);
    localStorage.setItem("am_courses", JSON.stringify(list));
  }

  async function createCourse(course: any) {
    setIsCreating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: course.title,
          skill: course.skill,
          count: course.count,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to generate questions");
      save([{ ...course, questions: result.questions }, ...courses]);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Unable to generate questions",
      );
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="courses-page">
      <header className="site-header">
        <VibeSkillLogo />
        <nav className="site-nav" aria-label="Course navigation">
          <span className="nav-current">Practice library</span>
          <Link className="nav-cta" href="/">
            Back home <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main>
        <section className="courses-intro">
          <div>
            <p className="eyebrow">
              <span className="eyebrow-dot" /> Your practice library
            </p>
            <h1>
              Build your
              <br />
              <em>edge.</em>
            </h1>
          </div>
          <p className="courses-intro-copy">
            Create focused interview rooms with questions shaped around the
            role, topic, and level you want to master.
          </p>
        </section>

        <section className="course-studio">
          <div className="studio-label">
            <span>01</span>
            <p>CREATE A ROOM</p>
            <div className="studio-line" />
          </div>
          <InterviewForm onCreate={createCourse} isCreating={isCreating} />
          <div className="studio-aside">
            <span className="aside-mark">✦</span>
            <p>
              Each room is generated around your goals by Gemini, then saved
              here for whenever you are ready to practice.
            </p>
          </div>
        </section>

        {error && (
          <div className="course-error" role="alert">
            {error}
          </div>
        )}

        <section className="library-section">
          <div className="library-heading">
            <div>
              <p className="eyebrow">Your rooms</p>
              <h2>
                Ready when
                <br />
                <em>you are.</em>
              </h2>
            </div>
            <div className="course-count">
              <strong>{String(courses.length).padStart(2, "0")}</strong>
              <span>
                rooms
                <br />
                created
              </span>
            </div>
          </div>
          <InterviewList
            courses={courses}
            onDelete={(id) => save(courses.filter((x) => x.id !== id))}
          />
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <span className="footer-note">
            A better conversation with your future.
          </span>
        </div>
        <span>© 2026 VibeSkill</span>
        <Link href="/">
          Home <span aria-hidden="true">↗</span>
        </Link>
      </footer>
    </div>
  );
}
