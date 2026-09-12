"use client";

import { useMemo, useState } from "react";

type CalendarEvent = {
  id: number;
  title: string;
  type: "study" | "exam" | "task" | "activity";
  date: string;
  time?: string;
  subject?: string;
  status?: "done" | "pending";
};

const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

const monthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const initialEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "مطالعه زیست",
    type: "study",
    date: "۱۴۰۵/۰۶/۲۱",
    time: "۱۰:۰۰",
    subject: "زیست‌شناسی",
    status: "pending",
  },
  {
    id: 2,
    title: "تمرین شیمی",
    type: "study",
    date: "۱۴۰۵/۰۶/۲۱",
    time: "۱۴:۰۰",
    subject: "شیمی",
    status: "pending",
  },
  {
    id: 3,
    title: "آزمون زیست‌شناسی",
    type: "exam",
    date: "۱۴۰۵/۰۶/۲۸",
    time: "۱۰:۰۰",
    subject: "زیست‌شناسی",
    status: "pending",
  },
  {
    id: 4,
    title: "مرور تابع",
    type: "task",
    date: "۱۴۰۵/۰۶/۲۲",
    time: "۱۸:۰۰",
    subject: "ریاضی",
    status: "pending",
  },
  {
    id: 5,
    title: "باشگاه",
    type: "activity",
    date: "۱۴۰۵/۰۶/۲۱",
    time: "۱۹:۰۰",
    status: "pending",
  },
  {
    id: 6,
    title: "آزمون شیمی",
    type: "exam",
    date: "۱۴۰۵/۰۷/۰۳",
    time: "۱۶:۰۰",
    subject: "شیمی",
    status: "pending",
  },
];

function toPersianNumber(value: number) {
  return value
    .toString()
    .replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function getMonthDays(month: number) {
  return month <= 6 ? 31 : month === 12 ? 29 : 30;
}

export default function CalendarPage() {
  const [year, setYear] = useState(1405);
  const [month, setMonth] = useState(6);
  const [selectedDay, setSelectedDay] = useState(21);
  const [view, setView] = useState<"month" | "agenda">(
    "month"
  );

  const [events, setEvents] =
    useState<CalendarEvent[]>(initialEvents);

  const [typeFilter, setTypeFilter] = useState<
    "all" | CalendarEvent["type"]
  >("all");

  const [showForm, setShowForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("۱۰:۰۰");
  const [newType, setNewType] =
    useState<CalendarEvent["type"]>("study");
  const [newSubject, setNewSubject] = useState("");

  const daysInMonth = getMonthDays(month);

  const firstDayOffset = useMemo(() => {
    /*
      در نسخه فعلی برای شهریور ۱۴۰۵، روز اول ماه
      از دوشنبه شروع می‌شود.
      بعداً می‌توان این بخش را با کتابخانه دقیق
      تقویم جلالی جایگزین کرد.
    */
    if (year === 1405 && month === 6) {
      return 2;
    }

    return 0;
  }, [year, month]);

  const monthEvents = events.filter((event) => {
    const parts = event.date.split("/");

    return (
      Number(parts[0]) === year &&
      Number(parts[1]) === month
    );
  });

  const selectedDate = `${year}/${String(month).padStart(
    2,
    "0"
  )}/${String(selectedDay).padStart(2, "0")}`;

  const selectedEvents = events.filter(
    (event) =>
      event.date === selectedDate &&
      (typeFilter === "all" ||
        event.type === typeFilter)
  );

  const filteredMonthEvents = monthEvents.filter(
    (event) =>
      typeFilter === "all" ||
      event.type === typeFilter
  );

  function previousMonth() {
    if (month === 1) {
      setMonth(12);
      setYear((current) => current - 1);
    } else {
      setMonth((current) => current - 1);
    }

    setSelectedDay(1);
  }

  function nextMonth() {
    if (month === 12) {
      setMonth(1);
      setYear((current) => current + 1);
    } else {
      setMonth((current) => current + 1);
    }

    setSelectedDay(1);
  }

  function goToday() {
    setYear(1405);
    setMonth(6);
    setSelectedDay(21);
  }

  function addEvent() {
    if (!newTitle.trim()) {
      return;
    }

    const id =
      events.length > 0
        ? Math.max(...events.map((event) => event.id)) +
          1
        : 1;

    const event: CalendarEvent = {
      id,
      title: newTitle.trim(),
      type: newType,
      date: selectedDate,
      time: newTime,
      subject: newSubject.trim() || undefined,
      status: "pending",
    };

    setEvents((current) => [...current, event]);

    setNewTitle("");
    setNewTime("۱۰:۰۰");
    setNewType("study");
    setNewSubject("");
    setShowForm(false);
  }

  function deleteEvent(id: number) {
    setEvents((current) =>
      current.filter((event) => event.id !== id)
    );
  }

  function toggleEvent(id: number) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? {
              ...event,
              status:
                event.status === "done"
                  ? "pending"
                  : "done",
            }
          : event
      )
    );
  }

  function getEventsForDay(day: number) {
    const date = `${year}/${String(month).padStart(
      2,
      "0"
    )}/${String(day).padStart(2, "0")}`;

    return filteredMonthEvents.filter(
      (event) => event.date === date
    );
  }

  function typeLabel(type: CalendarEvent["type"]) {
    if (type === "study") return "مطالعه";
    if (type === "exam") return "آزمون";
    if (type === "task") return "کار";
    return "فعالیت";
  }

  return (
    <main className="calendar-page">
      <header className="calendar-header">
        <div>
          <span className="dashboard-label">
            CALENDAR
          </span>

          <h1>تقویم</h1>

          <p>
            برنامه مطالعه، آزمون‌ها، کارها و فعالیت‌های
            روزانه
          </p>
        </div>

        <button
          className="calendar-add-button"
          onClick={() => setShowForm(true)}
        >
          + رویداد جدید
        </button>
      </header>

      {showForm && (
        <section className="panel calendar-form">
          <div className="panel-header">
            <div>
              <h2>ثبت رویداد</h2>

              <p>
                رویداد برای{" "}
                {toPersianNumber(selectedDay)}{" "}
                {monthNames[month - 1]} {year}
              </p>
            </div>

            <button
              className="calendar-close"
              onClick={() => setShowForm(false)}
            >
              بستن
            </button>
          </div>

          <div className="calendar-form-grid">
            <input
              value={newTitle}
              onChange={(event) =>
                setNewTitle(event.target.value)
              }
              placeholder="عنوان رویداد"
            />

            <input
              value={newTime}
              onChange={(event) =>
                setNewTime(event.target.value)
              }
              placeholder="ساعت"
            />

            <select
              value={newType}
              onChange={(event) =>
                setNewType(
                  event.target.value as CalendarEvent["type"]
                )
              }
            >
              <option value="study">مطالعه</option>
              <option value="exam">آزمون</option>
              <option value="task">کار</option>
              <option value="activity">فعالیت</option>
            </select>

            <input
              value={newSubject}
              onChange={(event) =>
                setNewSubject(event.target.value)
              }
              placeholder="درس / موضوع اختیاری"
            />
          </div>

          <div className="calendar-form-actions">
            <button onClick={addEvent}>
              ذخیره رویداد
            </button>

            <button
              className="secondary"
              onClick={() => setShowForm(false)}
            >
              انصراف
            </button>
          </div>
        </section>
      )}

      <section className="calendar-toolbar panel">
        <div className="calendar-navigation">
          <button onClick={previousMonth}>‹</button>

          <h2>
            {monthNames[month - 1]}{" "}
            {toPersianNumber(year)}
          </h2>

          <button onClick={nextMonth}>›</button>

          <button
            className="today-button"
            onClick={goToday}
          >
            امروز
          </button>
        </div>

        <div className="calendar-controls">
          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(
                event.target.value as
                  | "all"
                  | CalendarEvent["type"]
              )
            }
          >
            <option value="all">همه رویدادها</option>
            <option value="study">مطالعه</option>
            <option value="exam">آزمون</option>
            <option value="task">کارها</option>
            <option value="activity">فعالیت‌ها</option>
          </select>

          <div className="calendar-view-switch">
            <button
              className={
                view === "month" ? "active" : ""
              }
              onClick={() => setView("month")}
            >
              ماهانه
            </button>

            <button
              className={
                view === "agenda" ? "active" : ""
              }
              onClick={() => setView("agenda")}
            >
              فهرست
            </button>
          </div>
        </div>
      </section>

      {view === "month" ? (
        <section className="calendar-layout">
          <div className="panel calendar-main">
            <div className="calendar-weekdays">
              {weekDays.map((day) => (
                <div key={day}>{day}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {Array.from({
                length: firstDayOffset,
              }).map((_, index) => (
                <div
                  className="calendar-day empty"
                  key={`empty-${index}`}
                />
              ))}

              {Array.from({
                length: daysInMonth,
              }).map((_, index) => {
                const day = index + 1;
                const dayEvents =
                  getEventsForDay(day);

                const isSelected =
                  day === selectedDay;

                const isToday =
                  year === 1405 &&
                  month === 6 &&
                  day === 21;

                return (
                  <button
                    key={day}
                    className={`calendar-day ${
                      isSelected ? "selected" : ""
                    } ${isToday ? "today" : ""}`}
                    onClick={() =>
                      setSelectedDay(day)
                    }
                  >
                    <div className="calendar-day-number">
                      {toPersianNumber(day)}
                    </div>

                    <div className="calendar-day-events">
                      {dayEvents
                        .slice(0, 3)
                        .map((event) => (
                          <span
                            key={event.id}
                            className={`calendar-event-dot ${event.type}`}
                          >
                            {event.title}
                          </span>
                        ))}

                      {dayEvents.length > 3 && (
                        <small>
                          +
                          {toPersianNumber(
                            dayEvents.length - 3
                          )}
                        </small>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="panel calendar-sidebar">
            <div className="calendar-selected-header">
              <span>رویدادهای روز</span>

              <strong>
                {toPersianNumber(selectedDay)}{" "}
                {monthNames[month - 1]}
              </strong>
            </div>

            <button
              className="calendar-sidebar-add"
              onClick={() => setShowForm(true)}
            >
              + افزودن به این روز
            </button>

            <div className="calendar-event-list">
              {selectedEvents.map((event) => (
                <div
                  className="calendar-event-card"
                  key={event.id}
                >
                  <div
                    className={`calendar-event-icon ${event.type}`}
                  >
                    {event.type === "study"
                      ? "📚"
                      : event.type === "exam"
                      ? "📝"
                      : event.type === "task"
                      ? "✓"
                      : "◷"}
                  </div>

                  <div className="calendar-event-info">
                    <strong>{event.title}</strong>

                    <span>
                      {event.time || "بدون ساعت"}
                    </span>

                    {event.subject && (
                      <small>{event.subject}</small>
                    )}

                    <em>
                      {typeLabel(event.type)}
                    </em>
                  </div>

                  <div className="calendar-event-actions">
                    <button
                      onClick={() =>
                        toggleEvent(event.id)
                      }
                      title="تغییر وضعیت"
                    >
                      {event.status === "done"
                        ? "↩"
                        : "✓"}
                    </button>

                    <button
                      onClick={() =>
                        deleteEvent(event.id)
                      }
                      title="حذف"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              {selectedEvents.length === 0 && (
                <div className="calendar-no-events">
                  <span>📅</span>

                  <strong>
                    رویدادی ثبت نشده
                  </strong>

                  <p>
                    برای این روز هنوز برنامه‌ای وجود
                    ندارد.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </section>
      ) : (
        <section className="panel calendar-agenda">
          <div className="panel-header">
            <div>
              <h2>فهرست رویدادها</h2>

              <p>
                تمام رویدادهای ماه{" "}
                {monthNames[month - 1]}
              </p>
            </div>

            <span>
              {toPersianNumber(
                filteredMonthEvents.length
              )}{" "}
              رویداد
            </span>
          </div>

          <div className="agenda-list">
            {filteredMonthEvents
              .sort((a, b) =>
                a.date.localeCompare(b.date)
              )
              .map((event) => (
                <div
                  className="agenda-item"
                  key={event.id}
                >
                  <div className="agenda-date">
                    <strong>
                      {event.date.split("/")[2]}
                    </strong>

                    <span>
                      {monthNames[month - 1]}
                    </span>
                  </div>

                  <div
                    className={`agenda-type ${event.type}`}
                  >
                    {typeLabel(event.type)}
                  </div>

                  <div className="agenda-content">
                    <strong>{event.title}</strong>

                    <span>
                      {event.time || "بدون ساعت"}
                    </span>

                    {event.subject && (
                      <small>{event.subject}</small>
                    )}
                  </div>

                  <button
                    className="agenda-status"
                    onClick={() =>
                      toggleEvent(event.id)
                    }
                  >
                    {event.status === "done"
                      ? "انجام شد"
                      : "در انتظار"}
                  </button>

                  <button
                    className="agenda-delete"
                    onClick={() =>
                      deleteEvent(event.id)
                    }
                  >
                    حذف
                  </button>
                </div>
              ))}

            {filteredMonthEvents.length === 0 && (
              <div className="calendar-no-events">
                <span>📅</span>

                <strong>
                  رویدادی در این ماه وجود ندارد
                </strong>

                <p>
                  می‌توانی از دکمه رویداد جدید استفاده
                  کنی.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="calendar-summary">
        <div className="panel calendar-summary-card">
          <span>مطالعه</span>

          <strong>
            {
              monthEvents.filter(
                (event) => event.type === "study"
              ).length
            }
          </strong>

          <small>رویداد مطالعه</small>
        </div>

        <div className="panel calendar-summary-card">
          <span>آزمون‌ها</span>

          <strong>
            {
              monthEvents.filter(
                (event) => event.type === "exam"
              ).length
            }
          </strong>

          <small>آزمون این ماه</small>
        </div>

        <div className="panel calendar-summary-card">
          <span>کارها</span>

          <strong>
            {
              monthEvents.filter(
                (event) => event.type === "task"
              ).length
            }
          </strong>

          <small>کار برنامه‌ریزی‌شده</small>
        </div>

        <div className="panel calendar-summary-card">
          <span>فعالیت‌ها</span>

          <strong>
            {
              monthEvents.filter(
                (event) => event.type === "activity"
              ).length
            }
          </strong>

          <small>فعالیت ثبت‌شده</small>
        </div>
      </section>
    </main>
  );
        }
