"use client";

import { useState } from "react";

type PlanItem = {
  id: number;
  time: string;
  title: string;
  subject: string;
  duration: string;
  type: "study" | "task" | "exam" | "activity";
  done: boolean;
};

const initialItems: PlanItem[] = [
  {
    id: 1,
    time: "۰۹:۰۰",
    title: "مطالعه زیست‌شناسی",
    subject: "زیست‌شناسی",
    duration: "۶۰ دقیقه",
    type: "study",
    done: false,
  },
  {
    id: 2,
    time: "۱۰:۱۵",
    title: "حل تست شیمی",
    subject: "شیمی",
    duration: "۴۵ دقیقه",
    type: "study",
    done: false,
  },
  {
    id: 3,
    time: "۱۲:۰۰",
    title: "مرور مبحث ریاضی",
    subject: "ریاضی",
    duration: "۳۰ دقیقه",
    type: "task",
    done: false,
  },
];

export default function TodayPage() {
  const [items, setItems] = useState<PlanItem[]>(initialItems);

  const completed = items.filter((item) => item.done).length;
  const progress = items.length
    ? Math.round((completed / items.length) * 100)
    : 0;

  function toggleItem(id: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  function typeLabel(type: PlanItem["type"]) {
    if (type === "study") return "مطالعه";
    if (type === "task") return "وظیفه";
    if (type === "exam") return "آزمون";
    return "فعالیت";
  }

  return (
    <main className="today-page">
      <header className="today-header">
        <div>
          <span className="dashboard-label">TODAY</span>
          <h1>امروز</h1>
          <p>مرکز اجرای برنامه و فعالیت‌های روزانه</p>
        </div>

        <div className="today-date">
          <span>شنبه</span>
          <strong>۲۱ شهریور ۱۴۰۵</strong>
        </div>
      </header>

      <section className="today-summary">
        <div className="today-summary-main">
          <div>
            <span>پیشرفت برنامه امروز</span>
            <strong>{progress}٪</strong>
          </div>

          <div className="today-progress">
            <div style={{ width: `${progress}%` }} />
          </div>

          <small>
            {completed} مورد از {items.length} مورد انجام شده
          </small>
        </div>

        <div className="today-stat">
          <span>زمان برنامه‌ریزی‌شده</span>
          <strong>۲ ساعت و ۱۵ دقیقه</strong>
        </div>

        <div className="today-stat">
          <span>زمان مطالعه خالص</span>
          <strong>۰:۰۰</strong>
        </div>
      </section>

      <section className="today-layout">
        <div className="today-plan panel">
          <div className="panel-header">
            <div>
              <h2>برنامه امروز</h2>
              <p>جلسات، وظایف و فعالیت‌های برنامه‌ریزی‌شده</p>
            </div>

            <button className="small-button">+ افزودن</button>
          </div>

          <div className="timeline">
            {items.map((item) => (
              <div
                key={item.id}
                className={`timeline-item ${item.done ? "completed" : ""}`}
              >
                <div className="timeline-time">{item.time}</div>

                <div className="timeline-line">
                  <span />
                </div>

                <div className="plan-card">
                  <div className="plan-card-top">
                    <div>
                      <span className="plan-type">
                        {typeLabel(item.type)}
                      </span>
                      <h3>{item.title}</h3>
                    </div>

                    <button
                      className={`check-button ${
                        item.done ? "checked" : ""
                      }`}
                      onClick={() => toggleItem(item.id)}
                      aria-label="تغییر وضعیت"
                    >
                      {item.done ? "✓" : ""}
                    </button>
                  </div>

                  <div className="plan-card-info">
                    <span>{item.subject}</span>
                    <span>{item.duration}</span>
                  </div>

                  {!item.done && item.type === "study" && (
                    <button className="start-session">
                      شروع جلسه
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="today-sidebar">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>جلسه فعلی</h2>
                <p>اجرای سریع مطالعه</p>
              </div>
            </div>

            <div className="current-session">
              <div className="session-circle">
                <span>۰۰:۰۰</span>
              </div>

              <strong>هنوز جلسه‌ای شروع نشده</strong>
              <small>یک جلسه را از برنامه انتخاب کن.</small>

              <button>رفتن به تایمر</button>
            </div>
          </div>

          <div className="panel free-time-panel">
            <div className="panel-header">
              <div>
                <h2>زمان آزاد</h2>
                <p>زمان‌های خالی امروز</p>
              </div>
            </div>

            <div className="free-time">
              <div>
                <span>۱۳:۰۰ تا ۱۴:۳۰</span>
                <strong>۱ ساعت و ۳۰ دقیقه</strong>
              </div>

              <div>
                <span>۱۷:۰۰ تا ۱۸:۰۰</span>
                <strong>۱ ساعت</strong>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>یادآوری‌ها</h2>
                <p>موارد مهم امروز</p>
              </div>
            </div>

            <div className="reminder-empty">
              <span>🔔</span>
              <p>یادآوری مهمی وجود ندارد.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
