"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  Trash2,
  X,
  Target,
  Clock3,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

type Subject = {
  id: string;
  name: string;
};

type Test = {
  id: string;
  name: string;
  subject_id: string | null;
  topic: string | null;
  test_date: string;
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  question_count: number | null;
  correct_count: number | null;
  wrong_count: number | null;
  blank_count: number | null;
  duration_minutes: number | null;
  target_percentage: number | null;
  notes: string | null;
};

export default function TestsPage() {
  const supabase = createClient();

  const [tests, setTests] = useState<Test[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  const [name, setName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [testDate, setTestDate] = useState("");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [percentage, setPercentage] = useState("");
  const [questionCount, setQuestionCount] = useState("");
  const [correctCount, setCorrectCount] = useState("");
  const [wrongCount, setWrongCount] = useState("");
  const [blankCount, setBlankCount] = useState("");
  const [duration, setDuration] = useState("");
  const [targetPercentage, setTargetPercentage] =
    useState("");
  const [notes, setNotes] = useState("");

  async function loadData() {
    setLoading(true);

    const [testsResult, subjectsResult] =
      await Promise.all([
        supabase
          .from("tests")
          .select(
            "id,name,subject_id,topic,test_date,score,max_score,percentage,question_count,correct_count,wrong_count,blank_count,duration_minutes,target_percentage,notes"
          )
          .order("test_date", { ascending: false }),

        supabase
          .from("subjects")
          .select("id,name")
          .order("name"),
      ]);

    if (testsResult.data) {
      setTests(testsResult.data);
    }

    if (subjectsResult.data) {
      setSubjects(subjectsResult.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setName("");
    setSubjectId("");
    setTopic("");
    setTestDate("");
    setScore("");
    setMaxScore("");
    setPercentage("");
    setQuestionCount("");
    setCorrectCount("");
    setWrongCount("");
    setBlankCount("");
    setDuration("");
    setTargetPercentage("");
    setNotes("");
  }

  async function addTest() {
    if (!name.trim() || !testDate || adding) return;

    setAdding(true);

    const { error } = await supabase.from("tests").insert({
      name: name.trim(),
      subject_id: subjectId || null,
      topic: topic.trim() || null,
      test_date: testDate,
      score: score ? Number(score) : null,
      max_score: maxScore ? Number(maxScore) : null,
      percentage: percentage
        ? Number(percentage)
        : null,
      question_count: questionCount
        ? Number(questionCount)
        : null,
      correct_count: correctCount
        ? Number(correctCount)
        : null,
      wrong_count: wrongCount
        ? Number(wrongCount)
        : null,
      blank_count: blankCount
        ? Number(blankCount)
        : null,
      duration_minutes: duration
        ? Number(duration)
        : null,
      target_percentage: targetPercentage
        ? Number(targetPercentage)
        : null,
      notes: notes.trim() || null,
    });

    if (!error) {
      resetForm();
      setShowAdd(false);
      await loadData();
    } else {
      console.error(error);
      alert("ثبت آزمون با خطا مواجه شد.");
    }

    setAdding(false);
  }

  async function deleteTest(id: string) {
    const test = tests.find((item) => item.id === id);

    if (!test) return;

    const confirmed = window.confirm(
      `آزمون «${test.name}» حذف شود؟`
    );

    if (!confirmed) return;

    await supabase
      .from("tests")
      .delete()
      .eq("id", id);

    await loadData();
  }

  function getSubjectName(subjectId: string | null) {
    if (!subjectId) return "بدون درس";

    return (
      subjects.find(
        (subject) => subject.id === subjectId
      )?.name || "بدون درس"
    );
  }

  function getPercentage(test: Test) {
    if (test.percentage !== null) {
      return Number(test.percentage);
    }

    if (
      test.score !== null &&
      test.max_score !== null &&
      test.max_score > 0
    ) {
      return (
        (Number(test.score) /
          Number(test.max_score)) *
        100
      );
    }

    if (
      test.correct_count !== null &&
      test.question_count !== null &&
      test.question_count > 0
    ) {
      return (
        (Number(test.correct_count) /
          Number(test.question_count)) *
        100
      );
    }

    return null;
  }

  const averagePercentage = useMemo(() => {
    const values = tests
      .map(getPercentage)
      .filter(
        (value): value is number => value !== null
      );

    if (!values.length) return null;

    return (
      values.reduce((sum, value) => sum + value, 0) /
      values.length
    );
  }, [tests]);

  const totalQuestions = tests.reduce(
    (sum, test) =>
      sum + Number(test.question_count || 0),
    0
  );

  const totalCorrect = tests.reduce(
    (sum, test) =>
      sum + Number(test.correct_count || 0),
    0
  );

  const accuracy =
    totalQuestions > 0
      ? (totalCorrect / totalQuestions) * 100
      : null;

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="page-kicker">
            ثبت و تحلیل آزمون
          </div>

          <h1>آزمون‌ها</h1>

          <p className="page-subtitle">
            نتیجه آزمون‌ها، تعداد سؤالات، زمان و درصدت را
            ثبت و پیگیری کن.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={18} />
          ثبت آزمون
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={21} />
          </div>

          <div>
            <span>تعداد آزمون</span>
            <strong>{tests.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>میانگین درصد</span>
            <strong>
              {averagePercentage === null
                ? "—"
                : `${averagePercentage.toFixed(1)}٪`}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={21} />
          </div>

          <div>
            <span>کل سؤالات</span>
            <strong>{totalQuestions}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <span>دقت پاسخ‌گویی</span>
            <strong>
              {accuracy === null
                ? "—"
                : `${accuracy.toFixed(1)}٪`}
            </strong>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="empty-card">
          <p>در حال دریافت اطلاعات...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="empty-card">
          <FileText size={42} />

          <h2>هنوز آزمونی ثبت نشده</h2>

          <p>
            نتیجه اولین آزمونت را ثبت کن تا تحلیل عملکرد
            از همین‌جا شروع شود.
          </p>

          <button
            className="primary-button"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={18} />
            ثبت اولین آزمون
          </button>
        </div>
      ) : (
        <section className="exam-list">
          {tests.map((test) => {
            const testPercentage = getPercentage(test);

            return (
              <article
                className="exam-card"
                key={test.id}
              >
                <div className="exam-card-main">
                  <div className="exam-date-box">
                    <FileText size={20} />

                    <strong>
                      {new Date(
                        test.test_date
                      ).toLocaleDateString("fa-IR")}
                    </strong>
                  </div>

                  <div className="exam-info">
                    <div className="exam-title-row">
                      <h2>{test.name}</h2>

                      {testPercentage !== null && (
                        <span className="status-badge status-upcoming">
                          {testPercentage.toFixed(1)}٪
                        </span>
                      )}
                    </div>

                    <div className="exam-meta">
                      <span>
                        {getSubjectName(
                          test.subject_id
                        )}
                      </span>

                      {test.topic && (
                        <span>
                          مبحث: {test.topic}
                        </span>
                      )}

                      {test.question_count !== null && (
                        <span>
                          {test.question_count} سؤال
                        </span>
                      )}

                      {test.duration_minutes !== null && (
                        <span>
                          <Clock3 size={14} />
                          {test.duration_minutes} دقیقه
                        </span>
                      )}
                    </div>

                    <div className="test-result-grid">
                      <div>
                        <span>درست</span>
                        <strong>
                          {test.correct_count ?? "—"}
                        </strong>
                      </div>

                      <div>
                        <span>غلط</span>
                        <strong>
                          {test.wrong_count ?? "—"}
                        </strong>
                      </div>

                      <div>
                        <span>نزده</span>
                        <strong>
                          {test.blank_count ?? "—"}
                        </strong>
                      </div>

                      <div>
                        <span>هدف</span>
                        <strong>
                          {test.target_percentage !== null
                            ? `${test.target_percentage}٪`
                            : "—"}
                        </strong>
                      </div>
                    </div>

                    {test.notes && (
                      <p className="exam-notes">
                        {test.notes}
                      </p>
                    )}
                  </div>

                  <button
                    className="icon-button danger"
                    title="حذف آزمون"
                    onClick={() =>
                      deleteTest(test.id)
                    }
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {showAdd && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>ثبت آزمون</h2>
                <p>
                  اطلاعات آزمون را وارد کن.
                </p>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowAdd(false)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="form-grid">
              <label className="form-label">
                نام آزمون
                <input
                  className="form-input"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="مثلاً آزمون زیست فصل ۱"
                  autoFocus
                />
              </label>

              <label className="form-label">
                درس
                <select
                  className="form-input"
                  value={subjectId}
                  onChange={(e) =>
                    setSubjectId(e.target.value)
                  }
                >
                  <option value="">
                    انتخاب درس
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
              </label>

              <label className="form-label">
                مبحث
                <input
                  className="form-input"
                  value={topic}
                  onChange={(e) =>
                    setTopic(e.target.value)
                  }
                  placeholder="مثلاً تنظیم عصبی"
                />
              </label>

              <label className="form-label">
                تاریخ آزمون
                <input
                  className="form-input"
                  type="date"
                  value={testDate}
                  onChange={(e) =>
                    setTestDate(e.target.value)
                  }
                />
              </label>

              <label className="form-label">
                درصد
                <input
                  className="form-input"
                  type="number"
                  value={percentage}
                  onChange={(e) =>
                    setPercentage(e.target.value)
                  }
                  placeholder="مثلاً 75"
                />
              </label>

              <label className="form-label">
                هدف درصد
                <input
                  className="form-input"
                  type="number"
                  value={targetPercentage}
                  onChange={(e) =>
                    setTargetPercentage(
                      e.target.value
                    )
                  }
                  placeholder="مثلاً 80"
                />
              </label>

              <label className="form-label">
                تعداد سؤالات
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={questionCount}
                  onChange={(e) =>
                    setQuestionCount(
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="form-label">
                درست
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={correctCount}
                  onChange={(e) =>
                    setCorrectCount(
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="form-label">
                غلط
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={wrongCount}
                  onChange={(e) =>
                    setWrongCount(
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="form-label">
                نزده
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={blankCount}
                  onChange={(e) =>
                    setBlankCount(
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="form-label">
                زمان آزمون (دقیقه)
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={duration}
                  onChange={(e) =>
                    setDuration(
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="form-label">
                نمره
                <input
                  className="form-input"
                  type="number"
                  value={score}
                  onChange={(e) =>
                    setScore(e.target.value)
                  }
                />
              </label>

              <label className="form-label">
                حداکثر نمره
                <input
                  className="form-input"
                  type="number"
                  value={maxScore}
                  onChange={(e) =>
                    setMaxScore(
                      e.target.value
                    )
                  }
                />
              </label>

              <label className="form-label full-width">
                یادداشت و تحلیل شخصی
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="مثلاً بی‌دقتی در محاسبات..."
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowAdd(false)}
              >
                انصراف
              </button>

              <button
                className="primary-button"
                disabled={
                  adding ||
                  !name.trim() ||
                  !testDate
                }
                onClick={addTest}
              >
                {adding
                  ? "در حال ثبت..."
                  : "ثبت آزمون"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
