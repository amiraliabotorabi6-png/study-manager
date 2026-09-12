"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type StudySession = {
  id: string;
  subject_id: string | null;
  topic_id: string | null;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  is_completed: boolean;
};

type Subject = {
  id: string;
  name: string;
};

type Exam = {
  id: string;
  title: string;
  exam_date: string;
  subject_id: string | null;
};

type Task = {
  id: string;
  title: string;
  due_date: string | null;
  status: string;
};

export default function DashboardPage() {
  const supabase = createClient();

  const [name, setName] = useState("دانش‌آموز");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setName(
        user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "دانش‌آموز"
      );

      const [
        sessionsResult,
        subjectsResult,
        examsResult,
        tasksResult,
      ] = await Promise.all([
        supabase
          .from("study_sessions")
          .select(
            "id, subject_id, topic_id, started_at, ended_at, duration_minutes, is_completed"
          )
          .order("started_at", {
            ascending: false,
          })
          .limit(100),

        supabase
          .from("subjects")
          .select("id, name")
          .eq("is_active", true)
          .order("sort_order", {
            ascending: true,
          }),

        supabase
          .from("exams")
          .select(
            "id, title, exam_date, subject_id"
          )
          .gte(
            "exam_date",
            new Date().toISOString()
          )
          .order("exam_date", {
            ascending: true,
          })
          .limit(5),

        supabase
          .from("tasks")
          .select(
            "id, title, due_date, status"
          )
          .neq("status", "completed")
          .order("due_date", {
            ascending: true,
          })
          .limit(5),
      ]);

      if (sessionsResult.data) {
        setSessions(sessionsResult.data);
      }

      if (subjectsResult.data) {
        setSubjects(subjectsResult.data);
      }

      if (examsResult.data) {
        setExams(examsResult.data);
      }

      if (tasksResult.data) {
        setTasks(tasksResult.data);
      }

      setLoading(false);
    }

    loadDashboard();
  }, []);

  const todayKey = useMemo(() => {
    const date = new Date();

    return [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
  }, []);

  const todayMinutes = useMemo(() => {
    return sessions.reduce((total, session) => {
      if (!session.started_at) {
        return total;
      }

      const date = new Date(session.started_at);

      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");

      if (key !== todayKey) {
        return total;
      }

      return (
        total +
        (session.duration_minutes || 0)
      );
    }, 0);
  }, [sessions, todayKey]);

  const weekMinutes = useMemo(() => {
    const now = new Date();

    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    return sessions.reduce((total, session) => {
      const date = new Date(session.started_at);

      if (date < start || date > now) {
        return total;
      }

      return (
        total +
        (session.duration_minutes || 0)
      );
    }, 0);
  }, [sessions]);

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const todayHours = Math.floor(
    todayMinutes / 60
  );

  const todayRemainingMinutes =
    todayMinutes % 60;

  const weekHours = Math.floor(
    weekMinutes / 60
  );

  const weekRemainingMinutes =
    weekMinutes % 60;

  const formatHours = (
    hours: number,
    minutes: number
  ) => {
    if (hours === 0) {
      return `${minutes} دقیقه`;
    }

    return `${hours} ساعت و ${minutes} دقیقه`;
  };

  const getSubjectName = (
    subjectId: string | null
  ) => {
    if (!subjectId) {
      return "بدون درس";
    }

    return (
      subjects.find(
        (subject) => subject.id === subjectId
      )?.name || "درس"
    );
  };

  if (loading) {
    return (
      <main className="app-page">
        <div className="loading-state">
          <span className="auth-spinner" />

          <p>
            در حال بارگذاری داشبورد...
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
            STUDY MANAGER
          </span>

          <h1>
            سلام، {name} 👋
          </h1>

          <p>
            وضعیت مطالعه امروزت را بررسی کن و
            ادامه مسیر را با تمرکز پیش ببر.
          </p>
        </div>

        <Link
          href="/timer"
          className="primary-button"
        >
          <Timer size={18} />
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
              {formatHours(
                todayHours,
                todayRemainingMinutes
              )}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>
              مطالعه ۷ روز اخیر
            </span>

            <strong>
              {formatHours(
                weekHours,
                weekRemainingMinutes
              )}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <span>
              درس‌های فعال
            </span>

            <strong>
              {subjects.length}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>
              کارهای در انتظار
            </span>

            <strong>
              {completedTasks > 0
                ? `${completedTasks} انجام‌شده`
                : tasks.length}
            </strong>
          </div>
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                ادامه مطالعه
              </h2>

              <p>
                سریع به بخش‌های اصلی برنامه برو.
              </p>
            </div>
          </div>

          <div className="quick-actions">
            <Link
              href="/timer"
              className="quick-action"
            >
              <Timer size={22} />

              <div>
                <strong>
                  تایمر مطالعه
                </strong>

                <span>
                  شروع یک جلسه جدید
                </span>
              </div>
            </Link>

            <Link
              href="/today"
              className="quick-action"
            >
              <CalendarDays size={22} />

              <div>
                <strong>
                  برنامه امروز
                </strong>

                <span>
                  مشاهده برنامه روزانه
                </span>
              </div>
            </Link>

            <Link
              href="/planner"
              className="quick-action"
            >
              <Target size={22} />

              <div>
                <strong>
                  برنامه‌ریزی
                </strong>

                <span>
                  مدیریت برنامه مطالعه
                </span>
              </div>
            </Link>

            <Link
              href="/analytics"
              className="quick-action"
            >
              <TrendingUp size={22} />

              <div>
                <strong>
                  تحلیل عملکرد
                </strong>

                <span>
                  بررسی روند مطالعه
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                آزمون‌های پیش‌رو
              </h2>

              <p>
                نزدیک‌ترین آزمون‌ها
              </p>
            </div>

            <Link href="/exams">
              مشاهده همه
            </Link>
          </div>

          {exams.length === 0 ? (
            <div className="empty-state">
              <CalendarDays size={28} />

              <p>
                هنوز آزمونی ثبت نشده است.
              </p>

              <Link href="/exams">
                افزودن آزمون
              </Link>
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
                    ).toLocaleDateString(
                      "fa-IR"
                    )}
                  </time>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>
                کارهای پیش‌رو
              </h2>

              <p>
                وظایف تکمیل‌نشده
              </p>
            </div>

            <Link href="/tasks">
              مشاهده همه
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <CheckCircle2 size={28} />

              <p>
                کار عقب‌افتاده یا در انتظاری نداری.
              </p>
            </div>
          ) : (
            <div className="dashboard-list">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="dashboard-list-item"
                >
                  <div>
                    <strong>
                      {task.title}
                    </strong>

                    <span>
                      {task.due_date
                        ? `سررسید: ${new Date(
                            task.due_date
                          ).toLocaleDateString(
                            "fa-IR"
                          )}`
                        : "بدون سررسید"}
                    </span>
                  </div>

                  <span className="status-badge">
                    {task.status === "in_progress"
                      ? "در حال انجام"
                      : "در انتظار"}
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
                خلاصه مطالعه
              </h2>

              <p>
                آخرین جلسات ثبت‌شده
              </p>
            </div>

            <Link href="/analytics">
              تحلیل کامل
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="empty-state">
              <Clock3 size={28} />

              <p>
                هنوز جلسه مطالعه‌ای ثبت نشده است.
              </p>

              <Link href="/timer">
                شروع اولین جلسه
              </Link>
            </div>
          ) : (
            <div className="dashboard-list">
              {sessions
                .slice(0, 5)
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
                        {new Date(
                          session.started_at
                        ).toLocaleDateString(
                          "fa-IR"
                        )}
                      </span>
                    </div>

                    <strong>
                      {session.duration_minutes ||
                        0}{" "}
                      دقیقه
                    </strong>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
