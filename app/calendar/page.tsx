"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  Plus,
  Target,
} from "lucide-react";

type Exam = {
  id: string;
  title: string;
  subject_id: string | null;
  exam_date: string;
  exam_time: string | null;
  target_score: number | null;
};

type Task = {
  id: string;
  title: string;
  due_date: string | null;
  priority: string | null;
  completed: boolean;
};

type Subject = {
  id: string;
  name: string;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getCalendarDays(month: Date) {
  const first = startOfMonth(month);
  const firstDay = first.getDay();

  const start = new Date(first);
  start.setDate(first.getDate() - firstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

export default function CalendarPage() {
  const supabase = createClient();

  const [currentMonth, setCurrentMonth] = useState(
    startOfMonth(new Date())
  );

  const [selectedDate, setSelectedDate] = useState(
    toDateKey(new Date())
  );

  const [exams, setExams] = useState<Exam[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const [examResult, taskResult, subjectResult] =
      await Promise.all([
        supabase
          .from("exams")
          .select(
            "id, title, subject_id, exam_date, exam_time, target_score"
          )
          .eq("user_id", user.id)
          .order("exam_date", { ascending: true }),

        supabase
          .from("tasks")
          .select(
            "id, title, due_date, priority, completed"
          )
          .eq("user_id", user.id)
          .order("due_date", { ascending: true }),

        supabase
          .from("subjects")
          .select("id, name")
          .eq("user_id", user.id)
          .order("name"),
      ]);

    if (!examResult.error && examResult.data) {
      setExams(examResult.data);
    }

    if (!taskResult.error && taskResult.data) {
      setTasks(taskResult.data);
    }

    if (!subjectResult.error && subjectResult.data) {
      setSubjects(subjectResult.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth]
  );

  const subjectMap = useMemo(() => {
    return new Map(
      subjects.map((subject) => [subject.id, subject.name])
    );
  }, [subjects]);

  const selectedExams = exams.filter(
    (exam) => exam.exam_date === selectedDate
  );

  const selectedTasks = tasks.filter(
    (task) => task.due_date === selectedDate
  );

  const monthLabel = currentMonth.toLocaleDateString(
    "fa-IR",
    {
      month: "long",
      year: "numeric",
    }
  );

  function previousMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  }

  function nextMonth() {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  }

  function goToday() {
    const today = new Date();
    setCurrentMonth(startOfMonth(today));
    setSelectedDate(toDateKey(today));
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="eyebrow">تقویم</div>
          <h1>تقویم مطالعه</h1>
          <p>
            امتحان‌ها و کارهای برنامه‌ریزی‌شده را در یک نگاه
            ببین.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={goToday}
        >
          <CalendarDays size={18} />
          امروز
        </button>
      </div>

      <section className="calendar-layout">
        <div className="panel calendar-panel">
          <div className="calendar-toolbar">
            <button
              className="icon-button"
              onClick={previousMonth}
              aria-label="ماه قبل"
            >
              <ChevronRight size={20} />
            </button>

            <h2>{monthLabel}</h2>

            <button
              className="icon-button"
              onClick={nextMonth}
              aria-label="ماه بعد"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="calendar-weekdays">
            {[
              "یکشنبه",
              "دوشنبه",
              "سه‌شنبه",
              "چهارشنبه",
              "پنجشنبه",
              "جمعه",
              "شنبه",
            ].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {loading ? (
            <div className="empty-state">
              در حال بارگذاری تقویم...
            </div>
          ) : (
            <div className="calendar-grid">
              {calendarDays.map((day) => {
                const key = toDateKey(day);

                const isCurrentMonth =
                  day.getMonth() === currentMonth.getMonth();

                const isSelected = key === selectedDate;

                const isToday =
                  key === toDateKey(new Date());

                const dayExams = exams.filter(
                  (exam) => exam.exam_date === key
                );

                const dayTasks = tasks.filter(
                  (task) => task.due_date === key
                );

                return (
                  <button
                    key={key}
                    className={[
                      "calendar-day",
                      !isCurrentMonth
                        ? "muted"
                        : "",
                      isSelected
                        ? "selected"
                        : "",
                      isToday ? "today" : "",
                    ].join(" ")}
                    onClick={() =>
                      setSelectedDate(key)
                    }
                  >
                    <span className="calendar-day-number">
                      {day.toLocaleDateString("fa-IR", {
                        day: "numeric",
                      })}
                    </span>

                    <div className="calendar-events">
                      {dayExams.length > 0 && (
                        <span className="calendar-event exam">
                          <GraduationCap size={12} />
                          {dayExams.length}
                        </span>
                      )}

                      {dayTasks.length > 0 && (
                        <span className="calendar-event task">
                          <Target size={12} />
                          {dayTasks.length}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <aside className="panel selected-day-panel">
          <div className="panel-header">
            <div>
              <div className="eyebrow">
                روز انتخاب‌شده
              </div>

              <h2>
                {new Date(
                  `${selectedDate}T12:00:00`
                ).toLocaleDateString("fa-IR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h2>
            </div>
          </div>

          <div className="calendar-detail-section">
            <div className="section-title">
              <GraduationCap size={18} />
              امتحان‌ها
            </div>

            {selectedExams.length === 0 ? (
              <div className="small-empty">
                امتحانی برای این روز ثبت نشده.
              </div>
            ) : (
              <div className="detail-list">
                {selectedExams.map((exam) => (
                  <div
                    className="calendar-detail-card"
                    key={exam.id}
                  >
                    <div>
                      <strong>{exam.title}</strong>

                      <span>
                        {exam.subject_id
                          ? subjectMap.get(
                              exam.subject_id
                            ) || "بدون درس"
                          : "بدون درس"}
                      </span>
                    </div>

                    <div className="detail-meta">
                      {exam.exam_time && (
                        <span>
                          <Clock3 size={14} />
                          {exam.exam_time.slice(0, 5)}
                        </span>
                      )}

                      {exam.target_score !== null && (
                        <span>
                          هدف: {exam.target_score}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="calendar-detail-section">
            <div className="section-title">
              <Target size={18} />
              کارها
            </div>

            {selectedTasks.length === 0 ? (
              <div className="small-empty">
                کاری برای این روز ثبت نشده.
              </div>
            ) : (
              <div className="detail-list">
                {selectedTasks.map((task) => (
                  <div
                    className="calendar-detail-card"
                    key={task.id}
                  >
                    <div>
                      <strong>{task.title}</strong>

                      <span>
                        {task.completed
                          ? "انجام شده"
                          : "انجام نشده"}
                      </span>
                    </div>

                    {task.priority && (
                      <span className="badge">
                        {task.priority}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="secondary-button full-width"
            onClick={() =>
              (window.location.href = "/tasks")
            }
          >
            <Plus size={18} />
            مدیریت کارها
          </button>
        </aside>
      </section>
    </main>
  );
}
