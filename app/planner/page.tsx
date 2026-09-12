"use client";

import { useState } from "react";

type PlanItem = {
  id: number;
  time: string;
  duration: number;
  title: string;
  subject: string;
  type: "study" | "task" | "activity";
  status: "planned" | "done";
};

const initialPlan: PlanItem[] = [
  {
    id: 1,
    time: "۰۹:۰۰",
    duration: 60,
    title: "مطالعه زیست‌شناسی",
    subject: "زیست‌شناسی",
    type: "study",
    status: "planned",
  },
  {
    id: 2,
    time: "۱۰:۱۵",
    duration: 45,
    title: "حل تست شیمی",
    subject: "شیمی",
    type: "study",
    status: "planned",
  },
  {
    id: 3,
    time: "۱۲:۰۰",
    duration: 30,
    title: "مرور ریاضی",
    subject: "ریاضی",
    type: "study",
    status: "planned",
  },
  {
    id: 4,
    time: "۱۵:۰۰",
    duration: 45,
    title: "استراحت و ناهار",
    subject: "شخصی",
    type: "activity",
    status: "planned",
  },
];

const weekDays = [
  { name: "شنبه", date: "۲۱" },
  { name: "یکشنبه", date: "۲۲" },
  { name: "دوشنبه", date: "۲۳" },
  { name: "سه‌شنبه", date: "۲۴" },
  { name: "چهارشنبه", date: "۲۵" },
  { name: "پنجشنبه", date: "۲۶" },
  { name: "جمعه", date: "۲۷" },
];

export default function PlannerPage() {
  const [view, setView] = useState<"day" | "week">("day");
  const [selectedDay, setSelectedDay] = useState(0);
  const [plan, setPlan] = useState(initialPlan);

  const totalMinutes = plan.reduce((sum, item) => sum + item.duration, 0);

  const studyMinutes = plan
    .filter((item) => item.type === "study")
    .reduce((sum, item) => sum + item.duration, 0);

  function toggleStatus(id: number) {
    setPlan((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "done" ? "planned" : "done",
            }
          : item
      )
    );
  }

  function removeItem(id: number) {
    setPlan((current) => current.filter((item) => item.id !== id));
  }

  return (
    <main className="planner-page">
      <header className="planner-header">
        <div>
          <span className="dashboard-label">PLANNER</span>
          <h1>برنامه‌ریزی</h1>
          <p>برنامه مطالعه را بر اساس زمان واقعی روزت مدیریت کن.</p>
        </div>

        <div className="planner-actions">
          <button className="secondary-action">بازسازی برنامه</button>
          <button>+ افزودن فعالیت</button>
        </div>
      </header>

      <section className="planner-toolbar">
        <div className="view-switch">
          <button
            className={view === "day" ? "selected" : ""}
            onClick={() => setView("day")}
          >
            روزانه
          </button>

          <button
            className={view === "week" ? "selected" : ""}
            onClick={() => setView("week")}
          >
            هفتگی
          </button>
        </div>

        <div className="planner-navigation">
          <button>→</button>
          <strong>۲۱ شهریور ۱۴۰۵</strong>
          <button>←</button>
        </div>
      </section>

      {view === "week" && (
        <section className="week-selector panel">
          {weekDays.map((day, index) => (
            <button
              key={day.date}
              className={selectedDay === index ? "week-day active" : "week-day"}
              onClick={() => setSelectedDay(index)}
            >
              <span>{day.name}</span>
              <strong>{day.date}</strong>
            </button>
          ))}
        </section>
      )}

      <section className="planner-summary">
        <div className="planner-stat">
          <span>زمان کل برنامه</span>
          <strong>{Math.floor(totalMinutes / 60)} ساعت و {totalMinutes % 60} دقیقه</strong>
        </div>

        <div className="planner-stat">
          <span>زمان مطالعه</span>
          <strong>{Math.floor(studyMinutes / 60)} ساعت و {studyMinutes % 60} دقیقه</strong>
        </div>

        <div className="planner-stat">
          <span>جلسات مطالعه</span>
          <strong>{plan.filter((item) => item.type === "study").length}</strong>
        </div>

        <div className="planner-stat">
          <span>زمان آزاد</span>
          <strong>۲ ساعت و ۳۰ دقیقه</strong>
        </div>
      </section>

      <section className="planner-layout">
        <div className="panel schedule-panel">
          <div className="panel-header">
            <div>
              <h2>برنامه روز</h2>
              <p>برای جابه‌جایی در نسخه کامل می‌توانی فعالیت‌ها را مرتب کنی.</p>
            </div>

            <span className="plan-date">شنبه ۲۱ شهریور</span>
          </div>

          <div className="schedule">
            {plan.length === 0 ? (
              <div className="planner-empty">
                <div>📅</div>
                <strong>برنامه‌ای وجود ندارد</strong>
                <span>یک فعالیت جدید به برنامه اضافه کن.</span>
              </div>
            ) : (
              plan.map((item) => (
                <article
                  key={item.id}
                  className={`schedule-item ${
                    item.status === "done" ? "done" : ""
                  }`}
                >
                  <div className="schedule-time">
                    <strong>{item.time}</strong>
                    <span>{item.duration} دقیقه</span>
                  </div>

                  <div className="schedule-marker">
                    <span />
                  </div>

                  <div className="schedule-content">
                    <div className="schedule-main">
                      <div>
                        <span className={`activity-type ${item.type}`}>
                          {item.type === "study"
                            ? "مطالعه"
                            : item.type === "task"
                              ? "وظیفه"
                              : "فعالیت"}
                        </span>

                        <h3>{item.title}</h3>

                        <p>{item.subject}</p>
                      </div>

                      <div className="schedule-actions">
                        <button
                          className="icon-action"
                          onClick={() => toggleStatus(item.id)}
                        >
                          {item.status === "done" ? "✓" : "○"}
                        </button>

                        <button
                          className="icon-action delete"
                          onClick={() => removeItem(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    <div className="schedule-progress">
                      <div
                        style={{
                          width: item.status === "done" ? "100%" : "0%",
                        }}
                      />
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>

        <aside className="planner-sidebar">
          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>تنظیمات برنامه</h2>
                <p>محدودیت‌های امروز</p>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <span>هدف مطالعه</span>
                <strong>۶ ساعت</strong>
              </div>
              <span className="setting-badge">روزانه</span>
            </div>

            <div className="setting-row">
              <div>
                <span>زمان شروع</span>
                <strong>۰۸:۰۰</strong>
              </div>
              <span className="setting-badge">فعال</span>
            </div>

            <div className="setting-row">
              <div>
                <span>زمان پایان</span>
                <strong>۲۲:۰۰</strong>
              </div>
              <span className="setting-badge">فعال</span>
            </div>

            <button className="full-button">ویرایش دسترسی زمانی</button>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h2>اولویت‌ها</h2>
                <p>موارد مهم‌تر در برنامه</p>
              </div>
            </div>

            <div className="priority-list">
              <div>
                <span className="priority-number">۱</span>
                <div>
                  <strong>زیست‌شناسی</strong>
                  <small>اولویت بالا</small>
                </div>
              </div>

              <div>
                <span className="priority-number">۲</span>
                <div>
                  <strong>شیمی</strong>
                  <small>اولویت متوسط</small>
                </div>
              </div>

              <div>
                <span className="priority-number">۳</span>
                <div>
                  <strong>ریاضی</strong>
                  <small>اولویت متوسط</small>
                </div>
              </div>
            </div>
          </div>

          <div className="panel ai-planner-card">
            <span className="ai-label">SMART PLANNER</span>
            <h2>پیشنهاد هوشمند</h2>
            <p>
              بعداً برنامه‌ریز هوشمند با استفاده از زمان‌های آزاد،
              اهداف، آزمون‌ها و سابقه مطالعه پیشنهادهای دقیق‌تری ارائه می‌کند.
            </p>
            <button className="full-button">بررسی پیشنهادها</button>
          </div>
        </aside>
      </section>
    </main>
  );
            }
