"use client";

import { useMemo, useState } from "react";

type MistakeType =
  | "carelessness"
  | "concept"
  | "forgetting"
  | "time"
  | "uncertain"
  | "calculation"
  | "unknown"
  | "other";

type Test = {
  id: number;
  title: string;
  subject: string;
  topic: string;
  date: string;
  questions: number;
  correct: number;
  wrong: number;
  blank: number;
  duration: number;
  difficulty: "easy" | "medium" | "hard";
  notes: string;
  mistakes: Record<MistakeType, number>;
};

const initialTests: Test[] = [
  {
    id: 1,
    title: "تست زیست فصل تنظیم عصبی",
    subject: "زیست‌شناسی",
    topic: "تنظیم عصبی",
    date: "۱۴۰۵/۰۶/۲۱",
    questions: 20,
    correct: 16,
    wrong: 3,
    blank: 1,
    duration: 25,
    difficulty: "medium",
    notes: "در بخش‌های مربوط به نورون نیاز به مرور دارم.",
    mistakes: {
      carelessness: 1,
      concept: 1,
      forgetting: 1,
      time: 0,
      uncertain: 0,
      calculation: 0,
      unknown: 0,
      other: 0,
    },
  },
  {
    id: 2,
    title: "آزمون شیمی",
    subject: "شیمی",
    topic: "ساختار اتم",
    date: "۱۴۰۵/۰۶/۲۰",
    questions: 25,
    correct: 19,
    wrong: 4,
    blank: 2,
    duration: 35,
    difficulty: "hard",
    notes: "محاسبات را باید بیشتر تمرین کنم.",
    mistakes: {
      carelessness: 1,
      concept: 1,
      forgetting: 0,
      time: 1,
      uncertain: 0,
      calculation: 1,
      unknown: 0,
      other: 0,
    },
  },
];

const mistakeLabels: Record<MistakeType, string> = {
  carelessness: "بی‌دقتی",
  concept: "ضعف مفهومی",
  forgetting: "فراموشی",
  time: "کمبود زمان",
  uncertain: "شک و تردید",
  calculation: "اشتباه محاسباتی",
  unknown: "مبحث ناشناخته",
  other: "سایر",
};

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [selectedId, setSelectedId] = useState(1);
  const [subjectFilter, setSubjectFilter] = useState("همه");
  const [search, setSearch] = useState("");

  const subjects = [
    "همه",
    ...Array.from(new Set(tests.map((test) => test.subject))),
  ];

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSubject =
        subjectFilter === "همه" || test.subject === subjectFilter;

      const text =
        `${test.title} ${test.subject} ${test.topic}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      return matchesSubject && matchesSearch;
    });
  }, [tests, subjectFilter, search]);

  const selectedTest =
    tests.find((test) => test.id === selectedId) ?? filteredTests[0];

  const totalQuestions = tests.reduce(
    (sum, test) => sum + test.questions,
    0
  );

  const totalCorrect = tests.reduce(
    (sum, test) => sum + test.correct,
    0
  );

  const totalWrong = tests.reduce(
    (sum, test) => sum + test.wrong,
    0
  );

  const averagePercentage = totalQuestions
    ? Math.round((totalCorrect / totalQuestions) * 100)
    : 0;

  function getPercentage(test: Test) {
    if (!test.questions) return 0;
    return Math.round((test.correct / test.questions) * 100);
  }

  function getAccuracy(test: Test) {
    const answered = test.correct + test.wrong;

    if (!answered) return 0;

    return Math.round((test.correct / answered) * 100);
  }

  function difficultyLabel(
    difficulty: Test["difficulty"]
  ) {
    if (difficulty === "easy") return "آسان";
    if (difficulty === "medium") return "متوسط";
    return "سخت";
  }

  function addTest() {
    const id =
      tests.length > 0
        ? Math.max(...tests.map((test) => test.id)) + 1
        : 1;

    const newTest: Test = {
      id,
      title: "آزمون جدید",
      subject: "درس جدید",
      topic: "مبحث مشخص نشده",
      date: "۱۴۰۵/۰۶/۲۱",
      questions: 20,
      correct: 0,
      wrong: 0,
      blank: 20,
      duration: 30,
      difficulty: "medium",
      notes: "",
      mistakes: {
        carelessness: 0,
        concept: 0,
        forgetting: 0,
        time: 0,
        uncertain: 0,
        calculation: 0,
        unknown: 0,
        other: 0,
      },
    };

    setTests((current) => [newTest, ...current]);
    setSelectedId(id);
  }

  function deleteTest(id: number) {
    setTests((current) =>
      current.filter((test) => test.id !== id)
    );

    if (selectedId === id) {
      const next = tests.find((test) => test.id !== id);

      if (next) {
        setSelectedId(next.id);
      }
    }
  }

  return (
    <main className="tests-page">
      <header className="tests-header">
        <div>
          <span className="dashboard-label">TEST ANALYTICS</span>
          <h1>آزمون و تست</h1>
          <p>
            ثبت عملکرد، بررسی اشتباهات و تحلیل روند تست‌زنی
          </p>
        </div>

        <button onClick={addTest}>+ ثبت آزمون</button>
      </header>

      <section className="test-stats">
        <div className="panel test-stat">
          <span>تعداد آزمون‌ها</span>
          <strong>{tests.length}</strong>
          <small>آزمون ثبت‌شده</small>
        </div>

        <div className="panel test-stat">
          <span>تعداد سؤالات</span>
          <strong>{totalQuestions}</strong>
          <small>سؤال پاسخ‌داده‌شده</small>
        </div>

        <div className="panel test-stat">
          <span>میانگین درصد</span>
          <strong>{averagePercentage}٪</strong>
          <small>بر اساس پاسخ‌های صحیح</small>
        </div>

        <div className="panel test-stat">
          <span>پاسخ غلط</span>
          <strong>{totalWrong}</strong>
          <small>نیازمند تحلیل</small>
        </div>
      </section>

      <section className="tests-toolbar panel">
        <div className="test-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="جستجوی آزمون، درس یا مبحث..."
          />
        </div>

        <div className="test-filters">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={
                subjectFilter === subject ? "active" : ""
              }
              onClick={() => setSubjectFilter(subject)}
            >
              {subject}
            </button>
          ))}
        </div>
      </section>

      <section className="tests-layout">
        <aside className="panel tests-list-panel">
          <div className="panel-header">
            <div>
              <h2>آزمون‌ها</h2>
              <p>{filteredTests.length} مورد</p>
            </div>
          </div>

          <div className="tests-list">
            {filteredTests.map((test) => (
              <button
                key={test.id}
                className={`test-list-item ${
                  selectedTest?.id === test.id
                    ? "active"
                    : ""
                }`}
                onClick={() => setSelectedId(test.id)}
              >
                <div className="test-list-main">
                  <strong>{test.title}</strong>
                  <span>{test.subject}</span>
                  <small>
                    {test.date} · {test.topic}
                  </small>
                </div>

                <div className="test-list-score">
                  <strong>{getPercentage(test)}٪</strong>
                  <span>{test.questions} سؤال</span>
                </div>
              </button>
            ))}

            {filteredTests.length === 0 && (
              <div className="test-empty">
                آزمونی پیدا نشد.
              </div>
            )}
          </div>
        </aside>

        {selectedTest && (
          <section className="test-details">
            <div className="panel test-detail-header">
              <div>
                <span className="test-subject-badge">
                  {selectedTest.subject}
                </span>

                <h2>{selectedTest.title}</h2>

                <p>
                  {selectedTest.topic} · {selectedTest.date}
                </p>
              </div>

              <button
                className="delete-test"
                onClick={() =>
                  deleteTest(selectedTest.id)
                }
              >
                حذف آزمون
              </button>
            </div>

            <div className="test-result-grid">
              <div className="panel result-card">
                <span>درصد</span>
                <strong>
                  {getPercentage(selectedTest)}٪
                </strong>
                <small>پاسخ صحیح</small>
              </div>

              <div className="panel result-card">
                <span>دقت</span>
                <strong>
                  {getAccuracy(selectedTest)}٪
                </strong>
                <small>از سؤالات پاسخ‌داده‌شده</small>
              </div>

              <div className="panel result-card">
                <span>صحیح</span>
                <strong>{selectedTest.correct}</strong>
                <small>پاسخ صحیح</small>
              </div>

              <div className="panel result-card">
                <span>غلط</span>
                <strong>{selectedTest.wrong}</strong>
                <small>پاسخ اشتباه</small>
              </div>

              <div className="panel result-card">
                <span>نزده</span>
                <strong>{selectedTest.blank}</strong>
                <small>بدون پاسخ</small>
              </div>

              <div className="panel result-card">
                <span>زمان</span>
                <strong>{selectedTest.duration}</strong>
                <small>دقیقه</small>
              </div>
            </div>

            <div className="test-analysis-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>تحلیل پاسخ‌ها</h2>
                    <p>توزیع عملکرد در این آزمون</p>
                  </div>
                </div>

                <div className="answer-bars">
                  <div>
                    <div className="answer-bar-label">
                      <span>صحیح</span>
                      <strong>
                        {selectedTest.correct}
                      </strong>
                    </div>

                    <div className="answer-bar">
                      <div
                        style={{
                          width: `${
                            (selectedTest.correct /
                              selectedTest.questions) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="answer-bar-label">
                      <span>غلط</span>
                      <strong>
                        {selectedTest.wrong}
                      </strong>
                    </div>

                    <div className="answer-bar">
                      <div
                        style={{
                          width: `${
                            (selectedTest.wrong /
                              selectedTest.questions) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="answer-bar-label">
                      <span>نزده</span>
                      <strong>
                        {selectedTest.blank}
                      </strong>
                    </div>

                    <div className="answer-bar">
                      <div
                        style={{
                          width: `${
                            (selectedTest.blank /
                              selectedTest.questions) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>اطلاعات آزمون</h2>
                    <p>جزئیات ثبت‌شده</p>
                  </div>
                </div>

                <div className="test-info-list">
                  <div>
                    <span>درس</span>
                    <strong>
                      {selectedTest.subject}
                    </strong>
                  </div>

                  <div>
                    <span>مبحث</span>
                    <strong>
                      {selectedTest.topic}
                    </strong>
                  </div>

                  <div>
                    <span>تعداد سؤال</span>
                    <strong>
                      {selectedTest.questions}
                    </strong>
                  </div>

                  <div>
                    <span>سطح سختی</span>
                    <strong>
                      {difficultyLabel(
                        selectedTest.difficulty
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>زمان</span>
                    <strong>
                      {selectedTest.duration} دقیقه
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel mistakes-panel">
              <div className="panel-header">
                <div>
                  <h2>دسته‌بندی اشتباهات</h2>
                  <p>
                    علت اشتباهات را ثبت و الگوهای تکرارشونده
                    را پیدا کن
                  </p>
                </div>
              </div>

              <div className="mistakes-grid">
                {(
                  Object.keys(
                    mistakeLabels
                  ) as MistakeType[]
                ).map((type) => (
                  <div
                    className="mistake-item"
                    key={type}
                  >
                    <span>{mistakeLabels[type]}</span>

                    <strong>
                      {selectedTest.mistakes[type]}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel test-note-panel">
              <div className="panel-header">
                <div>
                  <h2>تحلیل شخصی</h2>
                  <p>
                    نکات و نتیجه‌گیری خودت از آزمون
                  </p>
                </div>
              </div>

              <textarea
                defaultValue={selectedTest.notes}
                rows={5}
                placeholder="چه چیزی خوب بود؟ چه چیزی نیاز به مرور یا تمرین دارد؟"
              />

              <button>ذخیره تحلیل</button>
            </div>
          </section>
        )}
      </section>
    </main>
  );
                }
