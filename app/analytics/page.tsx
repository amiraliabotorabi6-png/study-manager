"use client";

import { useMemo, useState } from "react";

type Period = "week" | "month" | "custom";

type SubjectData = {
  subject: string;
  minutes: number;
  tests: number;
  percentage: number;
  mastery: number;
};

const weeklyStudy = [
  { day: "شنبه", minutes: 310 },
  { day: "یکشنبه", minutes: 390 },
  { day: "دوشنبه", minutes: 280 },
  { day: "سه‌شنبه", minutes: 420 },
  { day: "چهارشنبه", minutes: 350 },
  { day: "پنجشنبه", minutes: 270 },
  { day: "جمعه", minutes: 180 },
];

const subjects: SubjectData[] = [
  {
    subject: "زیست‌شناسی",
    minutes: 620,
    tests: 85,
    percentage: 78,
    mastery: 82,
  },
  {
    subject: "شیمی",
    minutes: 510,
    tests: 70,
    percentage: 72,
    mastery: 76,
  },
  {
    subject: "ریاضی",
    minutes: 430,
    tests: 55,
    percentage: 68,
    mastery: 70,
  },
  {
    subject: "فیزیک",
    minutes: 360,
    tests: 42,
    percentage: 74,
    mastery: 73,
  },
  {
    subject: "زبان",
    minutes: 190,
    tests: 30,
    percentage: 81,
    mastery: 79,
  },
];

const topicData = [
  {
    topic: "تنظیم عصبی",
    subject: "زیست‌شناسی",
    mastery: 88,
    tests: 32,
    percentage: 84,
  },
  {
    topic: "ساختار اتم",
    subject: "شیمی",
    mastery: 72,
    tests: 25,
    percentage: 69,
  },
  {
    topic: "تابع",
    subject: "ریاضی",
    mastery: 64,
    tests: 30,
    percentage: 61,
  },
  {
    topic: "الکتریسیته",
    subject: "فیزیک",
    mastery: 78,
    tests: 20,
    percentage: 76,
  },
  {
    topic: "لغات",
    subject: "زبان",
    mastery: 91,
    tests: 18,
    percentage: 89,
  },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>("week");
  const [subjectFilter, setSubjectFilter] =
    useState("همه");

  const totalMinutes = subjects.reduce(
    (sum, subject) => sum + subject.minutes,
    0
  );

  const totalTests = subjects.reduce(
    (sum, subject) => sum + subject.tests,
    0
  );

  const averagePercentage = Math.round(
    subjects.reduce(
      (sum, subject) => sum + subject.percentage,
      0
    ) / subjects.length
  );

  const averageMastery = Math.round(
    subjects.reduce(
      (sum, subject) => sum + subject.mastery,
      0
    ) / subjects.length
  );

  const maxMinutes = Math.max(
    ...weeklyStudy.map((item) => item.minutes)
  );

  const filteredSubjects =
    subjectFilter === "همه"
      ? subjects
      : subjects.filter(
          (subject) =>
            subject.subject === subjectFilter
        );

  const filteredTopics =
    subjectFilter === "همه"
      ? topicData
      : topicData.filter(
          (topic) =>
            topic.subject === subjectFilter
        );

  const strongestSubject = useMemo(() => {
    return [...subjects].sort(
      (a, b) => b.mastery - a.mastery
    )[0];
  }, []);

  const weakestSubject = useMemo(() => {
    return [...subjects].sort(
      (a, b) => a.mastery - b.mastery
    )[0];
  }, []);

  function formatHours(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins} دقیقه`;
    }

    if (mins === 0) {
      return `${hours} ساعت`;
    }

    return `${hours} ساعت و ${mins} دقیقه`;
  }

  return (
    <main className="analytics-page">
      <header className="analytics-header">
        <div>
          <span className="dashboard-label">
            ANALYTICS
          </span>

          <h1>تحلیل و گزارش</h1>

          <p>
            بررسی روند مطالعه، عملکرد آزمون‌ها و وضعیت
            درس‌ها
          </p>
        </div>

        <div className="analytics-period">
          <button
            className={
              period === "week" ? "active" : ""
            }
            onClick={() => setPeriod("week")}
          >
            این هفته
          </button>

          <button
            className={
              period === "month" ? "active" : ""
            }
            onClick={() => setPeriod("month")}
          >
            این ماه
          </button>

          <button
            className={
              period === "custom" ? "active" : ""
            }
            onClick={() => setPeriod("custom")}
          >
            بازه دلخواه
          </button>
        </div>
      </header>

      <section className="analytics-stats">
        <div className="panel analytics-stat">
          <span>زمان مطالعه</span>

          <strong>
            {formatHours(totalMinutes)}
          </strong>

          <small>مجموع مطالعه ثبت‌شده</small>
        </div>

        <div className="panel analytics-stat">
          <span>تعداد تست</span>

          <strong>{totalTests}</strong>

          <small>تست ثبت‌شده</small>
        </div>

        <div className="panel analytics-stat">
          <span>میانگین درصد</span>

          <strong>{averagePercentage}٪</strong>

          <small>بر اساس آزمون‌های ثبت‌شده</small>
        </div>

        <div className="panel analytics-stat">
          <span>میانگین تسلط</span>

          <strong>{averageMastery}٪</strong>

          <small>برآورد وضعیت مباحث</small>
        </div>
      </section>

      <section className="analytics-grid">
        <div className="panel study-chart-panel">
          <div className="panel-header">
            <div>
              <h2>روند مطالعه</h2>

              <p>
                مقدار مطالعه در روزهای این هفته
              </p>
            </div>

            <span className="chart-unit">
              دقیقه
            </span>
          </div>

          <div className="study-chart">
            {weeklyStudy.map((item) => {
              const height =
                (item.minutes / maxMinutes) * 100;

              return (
                <div
                  className="chart-column"
                  key={item.day}
                >
                  <span className="chart-value">
                    {item.minutes}
                  </span>

                  <div className="chart-bar-wrapper">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span className="chart-day">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel analysis-summary-panel">
          <div className="panel-header">
            <div>
              <h2>خلاصه تحلیل</h2>

              <p>
                بر اساس داده‌های ثبت‌شده
              </p>
            </div>
          </div>

          <div className="analysis-highlight">
            <span>بالاترین تسلط</span>

            <strong>
              {strongestSubject.subject}
            </strong>

            <small>
              {strongestSubject.mastery}٪ برآورد تسلط
            </small>
          </div>

          <div className="analysis-highlight warning">
            <span>نیازمند توجه بیشتر</span>

            <strong>
              {weakestSubject.subject}
            </strong>

            <small>
              {weakestSubject.mastery}٪ برآورد تسلط
            </small>
          </div>

          <div className="analysis-note">
            <span>💡</span>

            <p>
              این تحلیل صرفاً بر اساس داده‌های ثبت‌شده
              است و به‌تنهایی رابطه علت و معلولی بین
              مطالعه و عملکرد را اثبات نمی‌کند.
            </p>
          </div>
        </div>
      </section>

      <section className="panel subject-analysis-panel">
        <div className="panel-header">
          <div>
            <h2>عملکرد درس‌ها</h2>

            <p>
              مقایسه زمان مطالعه، تست، درصد و تسلط
            </p>
          </div>

          <select
            value={subjectFilter}
            onChange={(event) =>
              setSubjectFilter(event.target.value)
            }
          >
            <option value="همه">همه درس‌ها</option>

            {subjects.map((subject) => (
              <option
                key={subject.subject}
                value={subject.subject}
              >
                {subject.subject}
              </option>
            ))}
          </select>
        </div>

        <div className="subject-analysis-table">
          <div className="subject-table-head">
            <span>درس</span>
            <span>مطالعه</span>
            <span>تست</span>
            <span>درصد</span>
            <span>تسلط</span>
          </div>

          {filteredSubjects.map((subject) => (
            <div
              className="subject-table-row"
              key={subject.subject}
            >
              <strong>{subject.subject}</strong>

              <span>
                {formatHours(subject.minutes)}
              </span>

              <span>{subject.tests}</span>

              <span className="table-percentage">
                {subject.percentage}٪
              </span>

              <div className="table-mastery">
                <div>
                  <span
                    style={{
                      width: `${subject.mastery}%`,
                    }}
                  />
                </div>

                <strong>
                  {subject.mastery}٪
                </strong>
              </div>
            </div>
          ))}

          {filteredSubjects.length === 0 && (
            <div className="analytics-empty">
              داده‌ای برای این درس وجود ندارد.
            </div>
          )}
        </div>
      </section>

      <section className="analytics-grid">
        <div className="panel mastery-panel">
          <div className="panel-header">
            <div>
              <h2>تسلط مباحث</h2>

              <p>
                برآورد وضعیت مباحث بر اساس داده‌های ثبت‌شده
              </p>
            </div>
          </div>

          <div className="mastery-list">
            {filteredTopics.map((topic) => (
              <div
                className="mastery-item"
                key={topic.topic}
              >
                <div className="mastery-item-header">
                  <div>
                    <strong>{topic.topic}</strong>

                    <span>{topic.subject}</span>
                  </div>

                  <strong>
                    {topic.mastery}٪
                  </strong>
                </div>

                <div className="mastery-progress">
                  <div
                    style={{
                      width: `${topic.mastery}%`,
                    }}
                  />
                </div>

                <div className="mastery-meta">
                  <span>
                    {topic.tests} تست
                  </span>

                  <span>
                    درصد: {topic.percentage}٪
                  </span>
                </div>
              </div>
            ))}

            {filteredTopics.length === 0 && (
              <div className="analytics-empty">
                مبحثی برای این درس ثبت نشده است.
              </div>
            )}
          </div>
        </div>

        <div className="panel recommendations-panel">
          <div className="panel-header">
            <div>
              <h2>پیشنهادهای تحلیلی</h2>

              <p>
                مواردی که ارزش بررسی دارند
              </p>
            </div>
          </div>

          <div className="recommendation-list">
            <div className="recommendation">
              <span>۱</span>

              <div>
                <strong>
                  بررسی مباحث با تسلط پایین
                </strong>

                <p>
                  مباحثی که درصد تسلط پایین‌تری دارند
                  در مرورهای بعدی بررسی شوند.
                </p>
              </div>
            </div>

            <div className="recommendation">
              <span>۲</span>

              <div>
                <strong>
                  مقایسه زمان و نتیجه
                </strong>

                <p>
                  زمان مطالعه هر درس را در کنار نتایج
                  آزمون همان درس بررسی کن.
                </p>
              </div>
            </div>

            <div className="recommendation">
              <span>۳</span>

              <div>
                <strong>
                  تحلیل آزمون‌های ضعیف
                </strong>

                <p>
                  علت اشتباهات و مباحث پرتکرار را از
                  صفحه آزمون‌ها بررسی کن.
                </p>
              </div>
            </div>

            <div className="recommendation">
              <span>۴</span>

              <div>
                <strong>
                  بررسی روند زمانی
                </strong>

                <p>
                  فقط یک روز را ملاک قرار نده و روند چند
                  هفته را با هم مقایسه کن.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="panel analytics-records">
        <div className="panel-header">
          <div>
            <h2>شاخص‌های مهم</h2>

            <p>
              چند معیار کاربردی برای بررسی وضعیت فعلی
            </p>
          </div>
        </div>

        <div className="records-grid">
          <div>
            <span>بیشترین مطالعه روزانه</span>

            <strong>
              {Math.max(
                ...weeklyStudy.map(
                  (item) => item.minutes
                )
              )}{" "}
              دقیقه
            </strong>

            <small>در این هفته</small>
          </div>

          <div>
            <span>بیشترین درصد</span>

            <strong>
              {Math.max(
                ...subjects.map(
                  (subject) => subject.percentage
                )
              )}
              ٪
            </strong>

            <small>بین درس‌های ثبت‌شده</small>
          </div>

          <div>
            <span>بیشترین تسلط</span>

            <strong>
              {Math.max(
                ...subjects.map(
                  (subject) => subject.mastery
                )
              )}
              ٪
            </strong>

            <small>برآورد فعلی</small>
          </div>

          <div>
            <span>مجموع مطالعه</span>

            <strong>
              {Math.round(totalMinutes / 60)}
              {" "}
              ساعت
            </strong>

            <small>داده‌های فعلی</small>
          </div>
        </div>
      </section>
    </main>
  );
      }
