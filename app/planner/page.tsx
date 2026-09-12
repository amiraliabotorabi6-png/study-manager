"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Target,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type PlannerItem = {
  id: string;
  title: string;
  item_type: string;
  start_at: string;
  end_at: string;
  status: string;
  subject_id: string | null;
};

type Subject = {
  id: string;
  name: string;
};

const WEEK_DAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

export default function PlannerPage() {
  const supabase = createClient();

  const [items, setItems] = useState<PlannerItem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [weekOffset, setWeekOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [itemType, setItemType] = useState("study");
  const [subjectId, setSubjectId] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const getSaturday = (offset: number) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    const day = date.getDay();
    const daysSinceSaturday = (day + 1) % 7;

    date.setDate(
      date.getDate() -
        daysSinceSaturday +
        offset * 7
    );

    return date;
  };

  const weekStart = useMemo(
    () => getSaturday(weekOffset),
    [weekOffset]
  );

  const weekDates = useMemo(() => {
    return WEEK_DAYS.map((_, index) => {
      const date = new Date(weekStart);

      date.setDate(
        weekStart.getDate() + index
      );

      return date;
    });
  }, [weekStart]);

  const weekEnd = useMemo(() => {
    const date = new Date(weekStart);

    date.setDate(
      date.getDate() + 7
    );

    return date;
  }, [weekStart]);

  useEffect(() => {
    async function loadPlanner() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const [
        plannerResult,
        subjectsResult,
      ] = await Promise.all([
        supabase
          .from("planner_items")
          .select(
            "id, title, item_type, start_at, end_at, status, subject_id"
          )
          .gte(
            "start_at",
            weekStart.toISOString()
          )
          .lt(
            "start_at",
            weekEnd.toISOString()
          )
          .order("start_at", {
            ascending: true,
          }),

        supabase
          .from("subjects")
          .select("id, name")
          .eq("is_active", true)
          .order("sort_order", {
            ascending: true,
          }),
      ]);

      if (plannerResult.data) {
        setItems(plannerResult.data);
      }

      if (subjectsResult.data) {
        setSubjects(subjectsResult.data);
      }

      setLoading(false);
    }

    loadPlanner();
  }, [weekStart, weekEnd]);

  const getSubjectName = (
    id: string | null
  ) => {
    if (!id) {
      return "بدون درس";
    }

    return (
      subjects.find(
        (subject) => subject.id === id
      )?.name || "درس"
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(
      "fa-IR",
      {
        month: "long",
        day: "numeric",
      }
    );
  };

  const getItemsForDay = (date: Date) => {
    return items.filter((item) => {
      const itemDate = new Date(
        item.start_at
      );

      return (
        itemDate.getFullYear() ===
          date.getFullYear() &&
        itemDate.getMonth() ===
          date.getMonth() &&
        itemDate.getDate() ===
          date.getDate()
      );
    });
  };

  const formatTime = (value: string) => {
    return new Date(value).toLocaleTimeString(
      "fa-IR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  async function addPlannerItem() {
    setError("");

    if (!title.trim()) {
      setError(
        "عنوان برنامه را وارد کن."
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

      const targetDate = weekDates[0];

      const start = new Date(targetDate);
      const end = new Date(targetDate);

      const [startHour, startMinute] =
        startTime.split(":").map(Number);

      const [endHour, endMinute] =
        endTime.split(":").map(Number);

      start.setHours(
        startHour,
        startMinute,
        0,
        0
      );

      end.setHours(
        endHour,
        endMinute,
        0,
        0
      );

      if (end <= start) {
        end.setDate(
          end.getDate() + 1
        );
      }

      const { data, error: insertError } =
        await supabase
          .from("planner_items")
          .insert({
            user_id: user.id,
            title: title.trim(),
            item_type: itemType,
            subject_id:
              subjectId || null,
            start_at: start.toISOString(),
            end_at: end.toISOString(),
            status: "planned",
          })
          .select(
            "id, title, item_type, start_at, end_at, status, subject_id"
          )
          .single();

      if (insertError) {
        setError(
          "افزودن برنامه انجام نشد."
        );
        return;
      }

      if (data) {
        setItems((current) =>
          [...current, data].sort(
            (a, b) =>
              new Date(
                a.start_at
              ).getTime() -
              new Date(
                b.start_at
              ).getTime()
          )
        );
      }

      setTitle("");
      setSubjectId("");
      setShowForm(false);
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
            در حال بارگذاری برنامه...
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
            PLANNER
          </span>

          <h1>
            برنامه‌ریزی مطالعه
          </h1>

          <p>
            برنامه هفتگی خودت را ببین و زمان‌های
            مطالعه را مدیریت کن.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setShowForm(
              (current) => !current
            )
          }
        >
          <Plus size={18} />
          افزودن برنامه
        </button>
      </section>

      {showForm && (
        <section className="dashboard-card planner-form-card">
          <div className="card-header">
            <div>
              <h2>
                برنامه جدید
              </h2>

              <p>
                یک فعالیت به شروع هفته فعلی
                اضافه می‌شود.
              </p>
            </div>
          </div>

          <div className="planner-form">
            <div className="auth-field">
              <label htmlFor="planner-title">
                عنوان
              </label>

              <input
                id="planner-title"
                type="text"
                placeholder="مثلاً مطالعه فصل اول زیست"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
              />
            </div>

            <div className="auth-field">
              <label htmlFor="planner-type">
                نوع فعالیت
              </label>

              <select
                id="planner-type"
                value={itemType}
                onChange={(event) =>
                  setItemType(
                    event.target.value
                  )
                }
              >
                <option value="study">
                  مطالعه
                </option>

                <option value="test">
                  آزمون
                </option>

                <option value="review">
                  مرور
                </option>

                <option value="task">
                  کار
                </option>

                <option value="break">
                  استراحت
                </option>
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="planner-subject">
                درس
              </label>

              <select
                id="planner-subject"
                value={subjectId}
                onChange={(event) =>
                  setSubjectId(
                    event.target.value
                  )
                }
              >
                <option value="">
                  بدون درس
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

            <div className="planner-time-row">
              <div className="auth-field">
                <label htmlFor="planner-start">
                  شروع
                </label>

                <input
                  id="planner-start"
                  type="time"
                  value={startTime}
                  onChange={(event) =>
                    setStartTime(
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="auth-field">
                <label htmlFor="planner-end">
                  پایان
                </label>

                <input
                  id="planner-end"
                  type="time"
                  value={endTime}
                  onChange={(event) =>
                    setEndTime(
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="button"
              className="primary-button"
              onClick={addPlannerItem}
              disabled={saving}
            >
              {saving
                ? "در حال ذخیره..."
                : "ذخیره برنامه"}
            </button>
          </div>
        </section>
      )}

      <section className="planner-toolbar">
        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            setWeekOffset(
              (current) => current - 1
            )
          }
        >
          <ChevronRight size={18} />
          هفته قبل
        </button>

        <div className="planner-week-title">
          <CalendarDays size={19} />

          <strong>
            {formatDate(weekStart)} تا{" "}
            {formatDate(
              new Date(
                weekEnd.getTime() -
                  24 * 60 * 60 * 1000
              )
            )}
          </strong>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            setWeekOffset(
              (current) => current + 1
            )
          }
        >
          هفته بعد
          <ChevronLeft size={18} />
        </button>
      </section>

      <section className="planner-week">
        {weekDates.map(
          (date, index) => {
            const dayItems =
              getItemsForDay(date);

            const isToday =
              new Date().toDateString() ===
              date.toDateString();

            return (
              <div
                key={date.toISOString()}
                className={
                  isToday
                    ? "planner-day today"
                    : "planner-day"
                }
              >
                <div className="planner-day-header">
                  <span>
                    {WEEK_DAYS[index]}
                  </span>

                  <strong>
                    {date.toLocaleDateString(
                      "fa-IR",
                      {
                        day: "numeric",
                      }
                    )}
                  </strong>
                </div>

                <div className="planner-day-body">
                  {dayItems.length === 0 ? (
                    <div className="planner-empty">
                      <Clock3 size={17} />

                      <span>
                        برنامه‌ای نیست
                      </span>
                    </div>
                  ) : (
                    dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="planner-item"
                      >
                        <div>
                          <strong>
                            {item.title}
                          </strong>

                          <span>
                            {formatTime(
                              item.start_at
                            )}{" "}
                            تا{" "}
                            {formatTime(
                              item.end_at
                            )}
                          </span>

                          {item.subject_id && (
                            <small>
                              {getSubjectName(
                                item.subject_id
                              )}
                            </small>
                          )}
                        </div>

                        <span className="planner-item-type">
                          {item.item_type ===
                          "study"
                            ? "مطالعه"
                            : item.item_type ===
                              "test"
                            ? "آزمون"
                            : item.item_type ===
                              "review"
                            ? "مرور"
                            : item.item_type ===
                              "break"
                            ? "استراحت"
                            : "کار"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          }
        )}
      </section>

      <section className="dashboard-card">
        <div className="card-header">
          <div>
            <h2>
              وضعیت برنامه
            </h2>

            <p>
              نمای کلی از فعالیت‌های این هفته
            </p>
          </div>
        </div>

        <div className="planner-summary">
          <div>
            <Target size={20} />

            <span>
              کل فعالیت‌ها
            </span>

            <strong>
              {items.length}
            </strong>
          </div>

          <div>
            <Clock3 size={20} />

            <span>
              فعالیت‌های مطالعه
            </span>

            <strong>
              {
                items.filter(
                  (item) =>
                    item.item_type ===
                    "study"
                ).length
              }
            </strong>
          </div>

          <div>
            <CalendarDays size={20} />

            <span>
              روزهای دارای برنامه
            </span>

            <strong>
              {
                new Set(
                  items.map((item) =>
                    new Date(
                      item.start_at
                    ).toDateString()
                  )
                ).size
              }
            </strong>
          </div>
        </div>
      </section>

      <div className="planner-links">
        <Link
          href="/today"
          className="secondary-button"
        >
          برنامه امروز
        </Link>

        <Link
          href="/goals"
          className="secondary-button"
        >
          اهداف
        </Link>

        <Link
          href="/exams"
          className="secondary-button"
        >
          آزمون‌ها
        </Link>
      </div>
    </main>
  );
}
