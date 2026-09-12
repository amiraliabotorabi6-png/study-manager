"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Pause,
  Play,
  RotateCcw,
  Square,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Subject = {
  id: string;
  name: string;
};

type Topic = {
  id: string;
  name: string;
  subject_id: string;
};

type Mode = "stopwatch" | "countdown" | "pomodoro";

export default function TimerPage() {
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("stopwatch");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const [countdownMinutes, setCountdownMinutes] =
    useState(45);

  const [subjects, setSubjects] = useState<Subject[]>(
    []
  );

  const [topics, setTopics] = useState<Topic[]>([]);

  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const [subjectsResult, topicsResult] =
        await Promise.all([
          supabase
            .from("subjects")
            .select("id, name")
            .eq("is_active", true)
            .order("sort_order"),

          supabase
            .from("topics")
            .select(
              "id, name, subject_id"
            )
            .eq("is_active", true)
            .order("sort_order"),
        ]);

      if (subjectsResult.data) {
        setSubjects(subjectsResult.data);
      }

      if (topicsResult.data) {
        setTopics(topicsResult.data);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!running) {
      return;
    }

    const interval = window.setInterval(() => {
      setSeconds((current) => {
        if (
          mode === "countdown" &&
          current >= countdownMinutes * 60
        ) {
          setRunning(false);
          return current;
        }

        if (
          mode === "pomodoro" &&
          current >= 25 * 60
        ) {
          setRunning(false);
          return current;
        }

        return current + 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    running,
    mode,
    countdownMinutes,
  ]);

  const filteredTopics = useMemo(() => {
    if (!subjectId) {
      return [];
    }

    return topics.filter(
      (topic) =>
        topic.subject_id === subjectId
    );
  }, [topics, subjectId]);

  const displaySeconds = useMemo(() => {
    if (
      mode === "countdown" ||
      mode === "pomodoro"
    ) {
      const target =
        mode === "countdown"
          ? countdownMinutes * 60
          : 25 * 60;

      return Math.max(
        target - seconds,
        0
      );
    }

    return seconds;
  }, [
    mode,
    seconds,
    countdownMinutes,
  ]);

  const hours = Math.floor(
    displaySeconds / 3600
  );

  const minutes = Math.floor(
    (displaySeconds % 3600) / 60
  );

  const secs = displaySeconds % 60;

  const formattedTime = [
    String(hours).padStart(2, "0"),
    String(minutes).padStart(2, "0"),
    String(secs).padStart(2, "0"),
  ].join(":");

  function resetTimer() {
    setRunning(false);
    setSeconds(0);
    setMessage("");
    setError("");
  }

  function changeMode(nextMode: Mode) {
    setMode(nextMode);
    setRunning(false);
    setSeconds(0);
    setMessage("");
    setError("");
  }

  async function saveSession() {
    setError("");
    setMessage("");

    if (seconds < 60) {
      setError(
        "برای ثبت جلسه، حداقل یک دقیقه مطالعه لازم است."
      );
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const endedAt = new Date();
      const startedAt = new Date(
        endedAt.getTime() -
          seconds * 1000
      );

      const { error: insertError } =
        await supabase
          .from("study_sessions")
          .insert({
            user_id: user.id,
            subject_id:
              subjectId || null,
            topic_id:
              topicId || null,
            started_at:
              startedAt.toISOString(),
            ended_at:
              endedAt.toISOString(),
            duration_minutes:
              Math.floor(seconds / 60),
            session_type:
              mode === "pomodoro"
                ? "pomodoro"
                : "study",
            is_completed: true,
          });

      if (insertError) {
        setError(
          "ثبت جلسه مطالعه انجام نشد."
        );
        return;
      }

      setMessage(
        "جلسه مطالعه با موفقیت ثبت شد."
      );

      setSeconds(0);
      setRunning(false);
    } catch {
      setError(
        "خطایی در ارتباط با سرور رخ داد."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="app-page">
        <div className="loading-state">
          <span className="auth-spinner" />

          <p>
            در حال بارگذاری تایمر...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page timer-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            STUDY TIMER
          </span>

          <h1>
            تایمر مطالعه
          </h1>

          <p>
            زمان مطالعه را دقیق ثبت و مدیریت کن.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="secondary-button"
        >
          <ArrowRight size={17} />
          داشبورد
        </Link>
      </div>

      <div className="timer-layout">
        <section className="dashboard-card timer-card">
          <div className="timer-modes">
            <button
              type="button"
              className={
                mode === "stopwatch"
                  ? "timer-mode active"
                  : "timer-mode"
              }
              onClick={() =>
                changeMode("stopwatch")
              }
            >
              کرنومتر
            </button>

            <button
              type="button"
              className={
                mode === "countdown"
                  ? "timer-mode active"
                  : "timer-mode"
              }
              onClick={() =>
                changeMode("countdown")
              }
            >
              شمارش معکوس
            </button>

            <button
              type="button"
              className={
                mode === "pomodoro"
                  ? "timer-mode active"
                  : "timer-mode"
              }
              onClick={() =>
                changeMode("pomodoro")
              }
            >
              پومودورو
            </button>
          </div>

          {mode === "countdown" && (
            <div className="timer-setting">
              <label>
                مدت شمارش معکوس
              </label>

              <select
                value={countdownMinutes}
                onChange={(event) => {
                  setCountdownMinutes(
                    Number(event.target.value)
                  );
                  setSeconds(0);
                }}
                disabled={running}
              >
                <option value={15}>
                  ۱۵ دقیقه
                </option>

                <option value={25}>
                  ۲۵ دقیقه
                </option>

                <option value={45}>
                  ۴۵ دقیقه
                </option>

                <option value={60}>
                  ۶۰ دقیقه
                </option>

                <option value={90}>
                  ۹۰ دقیقه
                </option>

                <option value={120}>
                  ۱۲۰ دقیقه
                </option>
              </select>
            </div>
          )}

          <div className="timer-display">
            <span dir="ltr">
              {formattedTime}
            </span>

            <small>
              {mode === "stopwatch"
                ? "زمان سپری‌شده"
                : mode === "pomodoro"
                ? "پومودورو ۲۵ دقیقه‌ای"
                : "زمان باقی‌مانده"}
            </small>
          </div>

          <div className="timer-controls">
            <button
              type="button"
              className="timer-main-button"
              onClick={() =>
                setRunning(
                  (current) => !current
                )
              }
            >
              {running ? (
                <>
                  <Pause size={21} />
                  توقف موقت
                </>
              ) : (
                <>
                  <Play size={21} />
                  شروع مطالعه
                </>
              )}
            </button>

            <button
              type="button"
              className="timer-reset-button"
              onClick={resetTimer}
              title="بازنشانی"
            >
              <RotateCcw size={20} />
            </button>

            <button
              type="button"
              className="timer-reset-button"
              onClick={saveSession}
              disabled={
                saving || seconds < 60
              }
              title="ثبت جلسه"
            >
              <Square size={18} />
            </button>
          </div>

          {message && (
            <div className="settings-message">
              {message}
            </div>
          )}

          {error && (
            <div className="auth-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}
        </section>

        <aside className="dashboard-card timer-sidebar">
          <div className="card-header">
            <div>
              <h2>
                مشخصات جلسه
              </h2>

              <p>
                درس و مبحث مطالعه را مشخص کن.
              </p>
            </div>
          </div>

          <div className="settings-form">
            <div className="auth-field">
              <label htmlFor="timer-subject">
                درس
              </label>

              <select
                id="timer-subject"
                value={subjectId}
                onChange={(event) => {
                  setSubjectId(
                    event.target.value
                  );
                  setTopicId("");
                }}
              >
                <option value="">
                  انتخاب درس
                </option>

                {subjects.map((subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="timer-topic">
                مبحث
              </label>

              <select
                id="timer-topic"
                value={topicId}
                onChange={(event) =>
                  setTopicId(
                    event.target.value
                  )
                }
                disabled={!subjectId}
              >
                <option value="">
                  {subjectId
                    ? "انتخاب مبحث"
                    : "ابتدا درس را انتخاب کن"}
                </option>

                {filteredTopics.map(
                  (topic) => (
                    <option
                      key={topic.id}
                      value={topic.id}
                    >
                      {topic.name}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="timer-info-box">
              <BookOpen size={19} />

              <div>
                <strong>
                  ثبت خودکار
                </strong>

                <span>
                  پس از پایان جلسه، زمان مطالعه
                  در سوابق ثبت می‌شود.
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
