"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Play,
  Plus,
  Target,
  Timer,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Task = {
  id: string;
  title: string;
  due_date: string | null;
  status: string;
};

type Exam = {
  id: string;
  title: string;
  exam_date: string;
  subject_id: string | null;
};

type StudySession = {
  id: string;
  subject_id: string | null;
  duration_minutes: number | null;
  started_at: string;
};

type Subject = {
  id: string;
  name: string;
};

export default function TodayPage() {
  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTask, setNewTask] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadToday() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [tasksResult, examsResult, sessionsResult, subjectsResult] =
        await Promise.all([
          supabase
            .from("tasks")
            .select("id, title, due_date, status")
            .neq("status", "completed")
            .or(
              `due_date.is.null,due_date.gte.${today.toISOString()},due_date.lt.${tomorrow.toISOString()}`
            )
            .order("due_date", { ascending: true }),

          supabase
            .from("exams")
            .select("id, title, exam_date, subject_id")
            .gte("exam_date", today.toISOString())
            .lt("exam_date", tomorrow.toISOString())
            .order("exam_date", { ascending: true }),

          supabase
            .from("study_sessions")
            .select(
              "id, subject_id, duration_minutes, started_at"
            )
            .gte("started_at", today.toISOString())
            .lt("started_at", tomorrow.toISOString())
            .order("started_at", { ascending: false }),

          supabase
            .from("subjects")
            .select("id, name")
            .eq("is_active", true)
            .order("sort_order", { ascending: true }),
        ]);

      if (tasksResult.data) {
        setTasks(tasksResult.data);
      }

      if (examsResult.data) {
        setExams(examsResult.data);
      }

      if (sessionsResult.data) {
        setSessions(sessionsResult.data);
      }

      if (subjectsResult.data) {
        setSubjects(subjectsResult.data);
      }

      setLoading(false);
    }

    loadToday();
  }, []);

  const todayMinutes = useMemo(() => {
    return sessions.reduce(
      (total, session) =>
        total + (session.duration_minutes || 0),
      0
    );
  }, [sessions]);

  const subjectTotals = useMemo(() => {
    const result: Record<string, number> = {};

    sessions.forEach((session) => {
      if (!session.subject_id) {
        return;
      }

      result[session.subject_id] =
        (result[session.subject_id] || 0) +
        (session.duration_minutes || 0);
    });

    return result;
  }, [sessions]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;

    if (hours === 0) {
      return `${remaining} دقیقه`;
    }

    if (remaining === 0) {
      return `${hours} ساعت`;
    }

    return `${hours} ساعت و ${remaining} دقیقه`;
  };

  const getSubjectName = (id: string | null) => {
    if (!id) {
      return "بدون درس";
    }

    return (
      subjects.find((subject) => subject.id === id)
        ?.name || "درس"
    );
  };

  async function addTask() {
    const title = newTask.trim();

    if (!title) {
      return;
    }

    setAddingTask(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error: insertError } =
        await supabase
          .from("tasks")
          .insert({
            user_id: user.id,
            title,
            status: "pending",
            due_date: new Date().toISOString(),
          })
          .select(
            "id, title, due_date, status"
          )
          .single();

      if (insertError) {
        setError(
          "افزودن کار انجام نشد."
        );
        return;
      }

      if (data) {
        setTasks((current) => [
          data,
          ...current,
        ]);
      }

      setNewTask("");
    } catch {
      setError(
        "خطایی در ارتباط با سرور رخ داد."
      );
    } finally {
      setAddingTask(false);
    }
  }

  async function completeTask(id: string) {
    setError("");

    const { error: updateError } =
      await supabase
        .from("tasks")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (updateError) {
      setError(
        "تکمیل کار انجام نشد."
      );
      return;
    }

    setTasks((current) =>
      current.filter(
        (task) => task.id !== id
      )
    );
  }

  if (loading) {
    return (
      <main className="app-page">
        <div className="loading-state">
          <span className="auth-spinner" />
          <p>
            در حال بارگذاری برنامه امروز...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <section className="dashboard-welcome">
        <div>
          <span className="page-eyebrow">
            TODAY
          </span>

          <h1>
            برنامه امروز
          </h1>

          <p>
            وضعیت امروزت را یک‌جا ببین و اجرای
            برنامه را مدیریت کن.
          </p>
        </div>

        <Link
          href="/timer"
          className="primary-button"
        >
          <Play size={18} />
          شروع مطالعه
        </Link>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>
              مطالعه امروز
            </span>

            <strong>
              {formatDuration(todayMinutes)}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>
              کارهای باقی‌مانده
            </span>

            <strong>
              {tasks.length}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>
              آزمون امروز
            </span>

            <strong>
              {exams.length}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={21} />
          </div>

          <div>
            <span>
              جلسات مطالعه
            </span>

            <strong>
              {sessions.length}
            </strong>
          </div>
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                کارهای امروز
              </h2>

              <p>
                کارهایی که باید امروز انجام شوند.
              </p>
            </div>

            <Link href="/tasks">
              مدیریت کارها
            </Link>
          </div>

          <div className="quick-add-task">
            <input
              type="text"
              placeholder="یک کار جدید برای امروز..."
              value={newTask}
              onChange={(event) =>
                setNewTask(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addTask();
                }
              }}
            />

            <button
              type="button"
              className="primary-button"
              onClick={addTask}
              disabled={addingTask}
            >
              <Plus size={18} />
              افزودن
            </button>
          </div>

          {error && (
            <div className="auth-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={30} />

              <p>
                برای امروز کاری باقی نمانده است.
              </p>
            </div>
          ) : (
            <div className="dashboard-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="dashboard-list-item"
                >
                  <div className="task-item-content">
                    <button
                      type="button"
                      className="task-check"
                      onClick={() =>
                        completeTask(task.id)
                      }
                      aria-label="تکمیل کار"
                    >
                      <CheckCircle2 size={20} />
                    </button>

                    <div>
                      <strong>
                        {task.title}
                      </strong>

                      <span>
                        {task.due_date
                          ? `سررسید: ${new Date(
                              task.due_date
                            ).toLocaleTimeString(
                              "fa-IR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}`
                          : "بدون زمان مشخص"}
                      </span>
                    </div>
                  </div>

                  <span className="status-badge">
                    در انتظار
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                آزمون‌های امروز
              </h2>

              <p>
                رویدادهای مهم امروز
              </p>
            </div>

            <Link href="/exams">
              همه آزمون‌ها
            </Link>
          </div>

          {exams.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={30} />

              <p>
                امروز آزمونی ثبت نشده است.
              </p>
            </div>
          ) : (
            <div className="dashboard-list">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="dashboard-list-item"
                >
                  <div>
                    <strong>
                      {exam.title}
                    </strong>

                    <span>
                      {getSubjectName(
                        exam.subject_id
                      )}
                    </span>
                  </div>

                  <time dir="ltr">
                    {new Date(
                      exam.exam_date
                    ).toLocaleTimeString(
                      "fa-IR",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </time>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h2>
              مطالعه امروز بر اساس درس
            </h2>

            <p>
              زمان ثبت‌شده برای هر درس
            </p>
          </div>

          <Link href="/subjects">
            مدیریت درس‌ها
          </Link>
        </div>

        {Object.keys(subjectTotals).length === 0 ? (
          <div className="empty-state">
            <BookOpenIcon />

            <p>
              هنوز مطالعه‌ای برای امروز ثبت نشده
              است.
            </p>

            <Link href="/timer">
              شروع مطالعه
            </Link>
          </div>
        ) : (
          <div className="subject-progress-list">
            {Object.entries(subjectTotals).map(
              ([subjectId, minutes]) => {
                const percentage =
                  todayMinutes > 0
                    ? Math.round(
                        (minutes /
                          todayMinutes) *
                          100
                      )
                    : 0;

                return (
                  <div
                    key={subjectId}
                    className="subject-progress-item"
                  >
                    <div className="subject-progress-header">
                      <strong>
                        {getSubjectName(
                          subjectId
                        )}
                      </strong>

                      <span>
                        {formatDuration(
                          minutes
                        )}
                      </span>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h2>
              آخرین جلسات مطالعه
            </h2>

            <p>
              فعالیت‌های ثبت‌شده امروز
            </p>
          </div>

          <Link href="/timer">
            تایمر
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className="empty-state">
            <Timer size={30} />

            <p>
              هنوز جلسه مطالعه‌ای ثبت نشده است.
            </p>
          </div>
        ) : (
          <div className="dashboard-list">
            {sessions
              .slice(0, 8)
              .map((session) => (
                <div
                  key={session.id}
                  className="dashboard-list-item"
                >
                  <div>
                    <strong>
                      {getSubjectName(
                        session.subject_id
                      )}
                    </strong>

                    <span>
                      شروع:{" "}
                      {new Date(
                        session.started_at
                      ).toLocaleTimeString(
                        "fa-IR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>

                  <strong>
                    {formatDuration(
                      session.duration_minutes ||
                        0
                    )}
                  </strong>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}

function BookOpenIcon() {
  return (
    <BookOpenIconInner />
  );
}

function BookOpenIconInner() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 4.5A2.5 2.5 0 0 1 4.5 2H9a3 3 0 0 1 3 3v17a3 3 0 0 0-3-3H4.5A2.5 2.5 0 0 0 2 21.5z" />
      <path d="M22 4.5A2.5 2.5 0 0 0 19.5 2H15a3 3 0 0 0-3 3v17a3 3 0 0 1 3-3h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
    </svg>
  );
}
