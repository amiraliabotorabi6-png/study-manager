"use client";

import { useMemo, useState } from "react";

type Topic = {
  id: number;
  name: string;
  mastery: number;
  studyMinutes: number;
  testCount: number;
};

type Subject = {
  id: number;
  name: string;
  icon: string;
  colorClass: string;
  targetHours: number;
  topics: Topic[];
};

const initialSubjects: Subject[] = [
  {
    id: 1,
    name: "زیست‌شناسی",
    icon: "🧬",
    colorClass: "subject-blue",
    targetHours: 20,
    topics: [
      {
        id: 1,
        name: "تنظیم عصبی",
        mastery: 72,
        studyMinutes: 180,
        testCount: 35,
      },
      {
        id: 2,
        name: "حواس",
        mastery: 58,
        studyMinutes: 120,
        testCount: 22,
      },
      {
        id: 3,
        name: "گوارش",
        mastery: 41,
        studyMinutes: 90,
        testCount: 18,
      },
    ],
  },
  {
    id: 2,
    name: "شیمی",
    icon: "⚗️",
    colorClass: "subject-purple",
    targetHours: 15,
    topics: [
      {
        id: 4,
        name: "ساختار اتم",
        mastery: 81,
        studyMinutes: 210,
        testCount: 40,
      },
      {
        id: 5,
        name: "جدول تناوبی",
        mastery: 64,
        studyMinutes: 150,
        testCount: 28,
      },
      {
        id: 6,
        name: "استوکیومتری",
        mastery: 35,
        studyMinutes: 75,
        testCount: 15,
      },
    ],
  },
  {
    id: 3,
    name: "ریاضی",
    icon: "∑",
    colorClass: "subject-green",
    targetHours: 12,
    topics: [
      {
        id: 7,
        name: "تابع",
        mastery: 68,
        studyMinutes: 160,
        testCount: 30,
      },
      {
        id: 8,
        name: "معادله و نامعادله",
        mastery: 52,
        studyMinutes: 110,
        testCount: 21,
      },
    ],
  },
  {
    id: 4,
    name: "فیزیک",
    icon: "⚡",
    colorClass: "subject-orange",
    targetHours: 10,
    topics: [
      {
        id: 9,
        name: "الکتریسیته",
        mastery: 61,
        studyMinutes: 130,
        testCount: 25,
      },
      {
        id: 10,
        name: "حرکت‌شناسی",
        mastery: 47,
        studyMinutes: 95,
        testCount: 19,
      },
    ],
  },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");

  const selectedSubject =
    subjects.find((subject) => subject.id === selectedId) ?? subjects[0];

  const allTopics = useMemo(
    () =>
      subjects.flatMap((subject) =>
        subject.topics.map((topic) => ({
          ...topic,
          subjectName: subject.name,
        }))
      ),
    [subjects]
  );

  const filteredTopics = selectedSubject.topics.filter((topic) =>
    topic.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudyMinutes = selectedSubject.topics.reduce(
    (sum, topic) => sum + topic.studyMinutes,
    0
  );

  const totalTests = selectedSubject.topics.reduce(
    (sum, topic) => sum + topic.testCount,
    0
  );

  const averageMastery =
    selectedSubject.topics.length > 0
      ? Math.round(
          selectedSubject.topics.reduce(
            (sum, topic) => sum + topic.mastery,
            0
          ) / selectedSubject.topics.length
        )
      : 0;

  function addSubject() {
    const nextId =
      subjects.length > 0
        ? Math.max(...subjects.map((subject) => subject.id)) + 1
        : 1;

    const newSubject: Subject = {
      id: nextId,
      name: `درس جدید ${nextId}`,
      icon: "📘",
      colorClass: "subject-blue",
      targetHours: 10,
      topics: [],
    };

    setSubjects((current) => [...current, newSubject]);
    setSelectedId(nextId);
  }

  function addTopic() {
    const nextTopicId =
      Math.max(0, ...allTopics.map((topic) => topic.id)) + 1;

    const newTopic: Topic = {
      id: nextTopicId,
      name: `مبحث جدید ${nextTopicId}`,
      mastery: 0,
      studyMinutes: 0,
      testCount: 0,
    };

    setSubjects((current) =>
      current.map((subject) =>
        subject.id === selectedSubject.id
          ? {
              ...subject,
              topics: [...subject.topics, newTopic],
            }
          : subject
      )
    );
  }

  return (
    <main className="subjects-page">
      <header className="subjects-header">
        <div>
          <span className="dashboard-label">SUBJECTS</span>
          <h1>درس‌ها و مباحث</h1>
          <p>مدیریت کامل درس‌ها، مباحث و وضعیت یادگیری</p>
        </div>

        <button onClick={addSubject}>+ افزودن درس</button>
      </header>

      <section className="subjects-layout">
        <aside className="subjects-list panel">
          <div className="panel-header">
            <div>
              <h2>درس‌ها</h2>
              <p>{subjects.length} درس ثبت شده</p>
            </div>
          </div>

          <div className="subject-items">
            {subjects.map((subject) => {
              const average =
                subject.topics.length > 0
                  ? Math.round(
                      subject.topics.reduce(
                        (sum, topic) => sum + topic.mastery,
                        0
                      ) / subject.topics.length
                    )
                  : 0;

              return (
                <button
                  key={subject.id}
                  className={`subject-item ${
                    selectedId === subject.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedId(subject.id)}
                >
                  <span className={`subject-icon ${subject.colorClass}`}>
                    {subject.icon}
                  </span>

                  <span className="subject-item-content">
                    <strong>{subject.name}</strong>
                    <small>
                      {subject.topics.length} مبحث · تسلط {average}٪
                    </small>
                  </span>

                  <span className="subject-arrow">‹</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="subject-dashboard">
          <div className="subject-title-card panel">
            <div className="subject-title-main">
              <span
                className={`subject-large-icon ${selectedSubject.colorClass}`}
              >
                {selectedSubject.icon}
              </span>

              <div>
                <span className="dashboard-label">SUBJECT</span>
                <h2>{selectedSubject.name}</h2>
                <p>
                  هدف این درس: {selectedSubject.targetHours} ساعت در هفته
                </p>
              </div>
            </div>

            <button className="secondary-action">ویرایش درس</button>
          </div>

          <div className="subject-stats">
            <div className="subject-stat panel">
              <span>میانگین تسلط</span>
              <strong>{averageMastery}٪</strong>
              <small>بر اساس مباحث ثبت‌شده</small>
            </div>

            <div className="subject-stat panel">
              <span>زمان مطالعه</span>
              <strong>
                {Math.floor(totalStudyMinutes / 60)} ساعت
              </strong>
              <small>{totalStudyMinutes % 60} دقیقه اضافه</small>
            </div>

            <div className="subject-stat panel">
              <span>تعداد تست</span>
              <strong>{totalTests}</strong>
              <small>در مباحث ثبت‌شده</small>
            </div>

            <div className="subject-stat panel">
              <span>تعداد مباحث</span>
              <strong>{selectedSubject.topics.length}</strong>
              <small>مبحث فعال</small>
            </div>
          </div>

          <div className="panel topics-panel">
            <div className="panel-header">
              <div>
                <h2>مباحث</h2>
                <p>وضعیت یادگیری هر مبحث</p>
              </div>

              <div className="topic-actions">
                <input
                  type="search"
                  placeholder="جستجوی مبحث..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />

                <button onClick={addTopic}>+ مبحث</button>
              </div>
            </div>

            <div className="topics-table">
              <div className="topics-head">
                <span>مبحث</span>
                <span>تسلط</span>
                <span>مطالعه</span>
                <span>آزمون/تست</span>
                <span>وضعیت</span>
              </div>

              {filteredTopics.length === 0 ? (
                <div className="topics-empty">
                  <span>📚</span>
                  <strong>مبحثی پیدا نشد</strong>
                  <small>
                    مبحث جدید اضافه کن یا عبارت جستجو را تغییر بده.
                  </small>
                </div>
              ) : (
                filteredTopics.map((topic) => {
                  const status =
                    topic.mastery >= 75
                      ? "قوی"
                      : topic.mastery >= 50
                        ? "متوسط"
                        : "نیاز به مرور";

                  return (
                    <div className="topic-row" key={topic.id}>
                      <div className="topic-name">
                        <strong>{topic.name}</strong>
                        <div className="mastery-bar">
                          <div style={{ width: `${topic.mastery}%` }} />
                        </div>
                      </div>

                      <strong className="mastery-value">
                        {topic.mastery}٪
                      </strong>

                      <span>
                        {Math.floor(topic.studyMinutes / 60)}س{" "}
                        {topic.studyMinutes % 60}د
                      </span>

                      <span>{topic.testCount}</span>

                      <span
                        className={`topic-status ${
                          topic.mastery >= 75
                            ? "strong"
                            : topic.mastery >= 50
                              ? "medium"
                              : "weak"
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="subject-bottom-grid">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>روند تسلط</h2>
                  <p>تغییر وضعیت مباحث در طول زمان</p>
                </div>
              </div>

              <div className="mastery-placeholder">
                <div className="fake-chart">
                  <span style={{ height: "35%" }} />
                  <span style={{ height: "48%" }} />
                  <span style={{ height: "42%" }} />
                  <span style={{ height: "63%" }} />
                  <span style={{ height: "58%" }} />
                  <span style={{ height: "76%" }} />
                  <span style={{ height: "70%" }} />
                </div>

                <small>
                  با ثبت آزمون‌ها و جلسات بیشتر، نمودار واقعی ساخته می‌شود.
                </small>
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <div>
                  <h2>پیشنهاد مرور</h2>
                  <p>مباحثی که اولویت بیشتری دارند</p>
                </div>
              </div>

              <div className="review-list">
                {selectedSubject.topics
                  .filter((topic) => topic.mastery < 60)
                  .slice(0, 4)
                  .map((topic) => (
                    <div key={topic.id} className="review-item">
                      <div>
                        <strong>{topic.name}</strong>
                        <span>تسلط فعلی: {topic.mastery}٪</span>
                      </div>

                      <button>مرور</button>
                    </div>
                  ))}

                {selectedSubject.topics.filter(
                  (topic) => topic.mastery < 60
                ).length === 0 && (
                  <div className="review-empty">
                    همه مباحث این درس وضعیت مناسبی دارند.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
    }
