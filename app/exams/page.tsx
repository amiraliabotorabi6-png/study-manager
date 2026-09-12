"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  Clock3,
  Plus,
  Trash2,
  Target,
  X,
  BookOpen,
} from "lucide-react";

type Subject = {
  id: string;
  name: string;
};

type Exam = {
  id: string;
  name: string;
  subject_id: string | null;
  topic: string | null;
  exam_date: string;
  target_score: number | null;
  actual_score: number | null;
  notes: string | null;
};

export default function ExamsPage() {
  const supabase = createClient();

  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  const [name, setName] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState("");
  const [examDate, setExamDate] = useState("");
  const [targetScore, setTargetScore] = useState("");
  const [notes, setNotes] = useState("");

  async function loadData() {
    setLoading(true);

    const [examsResult, subjectsResult] =
      await Promise.all([
        supabase
          .from("exams")
          .select(
            "id,name,subject_id,topic,exam_date,target_score,actual_score,notes"
          )
          .order("exam_date", { ascending: true }),

        supabase
          .from("subjects")
          .select("id,name")
          .order("name"),
      ]);

    if (examsResult.data) {
      setExams(examsResult.data);
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
    setExamDate("");
    setTargetScore("");
    setNotes("");
  }

  async function addExam() {
    if (!name.trim() || !examDate || adding) return;

    setAdding(true);

    const { error } = await supabase
      .from("exams")
      .insert({
        name: name.trim(),
        subject_id: subjectId || null,
        topic: topic.trim() || null,
        exam_date: examDate,
        target_score: targetScore
          ? Number(targetScore)
          : null,
        notes: notes.trim() || null,
      });

    if (!error) {
      resetForm();
      setShowAdd(false);
      await loadData();
    }

    setAdding(false);
  }

  async function deleteExam(id: string) {
    const exam = exams.find((item) => item.id === id);

    if (!exam) return;

    const confirmed = window.confirm(
      `آزمون «${exam.name}» حذف شود؟`
    );

    if (!confirmed) return;

    await supabase
      .from("exams")
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

  function getDaysRemaining(date: string) {
    const exam = new Date(date);
    const now = new Date();

    exam.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    const difference =
      exam.getTime() - now.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  }

  function getExamStatus(date: string) {
    const days = getDaysRemaining(date);

    if (days < 0) return "گذشته";
    if (days === 0) return "امروز";
    if (days === 1) return "فردا";
    return `${days} روز مانده`;
  }

  const upcomingExams = useMemo(
    () =>
      exams.filter(
        (exam) => getDaysRemaining(exam.exam_date) >= 0
      ),
    [exams]
  );

  const completedExams = useMemo(
    () =>
      exams.filter(
        (exam) => getDaysRemaining(exam.exam_date) < 0
      ),
    [exams]
  );

  const todayExams = useMemo(
    () =>
      exams.filter(
        (exam) => getDaysRemaining(exam.exam_date) === 0
      ),
    [exams]
  );

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="page-kicker">
            مدیریت آزمون‌ها
          </div>

          <h1>آزمون‌ها</h1>

          <p className="page-subtitle">
            آزمون‌های پیش‌رو، هدف‌ها و نتایجت را مدیریت کن.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={18} />
          افزودن آزمون
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>کل آزمون‌ها</span>
            <strong>{exams.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>آزمون‌های پیش‌رو</span>
            <strong>{upcomingExams.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={21} />
          </div>

          <div>
            <span>آزمون امروز</span>
            <strong>{todayExams.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <span>آزمون‌های انجام‌شده</span>
            <strong>{completedExams.length}</strong>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="empty-card">
          <p>در حال دریافت آزمون‌ها...</p>
        </div>
      ) : exams.length === 0 ? (
        <div className="empty-card">
          <CalendarDays size={42} />

          <h2>هنوز آزمونی ثبت نشده</h2>

          <p>
            اولین آزمونت را اضافه کن تا برنامه‌ریزی و
            پیگیری آمادگی را شروع کنیم.
          </p>

          <button
            className="primary-button"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={18} />
            افزودن آزمون
          </button>
        </div>
      ) : (
        <section className="exam-list">
          {exams.map((exam) => {
            const daysRemaining = getDaysRemaining(
              exam.exam_date
            );

            const isPast = daysRemaining < 0;
            const isToday = daysRemaining === 0;

            return (
              <article
                className={`exam-card ${
                  isToday ? "exam-today" : ""
                }`}
                key={exam.id}
              >
                <div className="exam-card-main">
                  <div className="exam-date-box">
                    <CalendarDays size={20} />

                    <strong>
                      {new Date(
                        exam.exam_date
                      ).toLocaleDateString("fa-IR")}
                    </strong>
                  </div>

                  <div className="exam-info">
                    <div className="exam-title-row">
                      <h2>{exam.name}</h2>

                      <span
                        className={`status-badge ${
                          isPast
                            ? "status-past"
                            : isToday
                            ? "status-today"
                            : "status-upcoming"
                        }`}
                      >
                        {getExamStatus(
                          exam.exam_date
                        )}
                      </span>
                    </div>

                    <div className="exam-meta">
                      <span>
                        <BookOpen size={15} />
                        {getSubjectName(
                          exam.subject_id
                        )}
                      </span>

                      {exam.topic && (
                        <span>
                          مبحث: {exam.topic}
                        </span>
                      )}

                      {exam.target_score !== null && (
                        <span>
                          هدف:{" "}
                          {exam.target_score}
                        </span>
                      )}
                    </div>

                    {exam.notes && (
                      <p className="exam-notes">
                        {exam.notes}
                      </p>
                    )}
                  </div>

                  <button
                    className="icon-button danger"
                    title="حذف آزمون"
                    onClick={() =>
                      deleteExam(exam.id)
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
                <h2>افزودن آزمون</h2>
                <p>
                  مشخصات آزمون را وارد کن.
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
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="مثلاً آزمون زیست فصل اول"
                  autoFocus
                />
              </label>

              <label className="form-label">
                درس
                <select
                  className="form-input"
                  value={subjectId}
                  onChange={(event) =>
                    setSubjectId(event.target.value)
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
                  onChange={(event) =>
                    setTopic(event.target.value)
                  }
                  placeholder="مثلاً تنظیم عصبی"
                />
              </label>

              <label className="form-label">
                تاریخ آزمون
                <input
                  className="form-input"
                  type="date"
                  value={examDate}
                  onChange={(event) =>
                    setExamDate(event.target.value)
                  }
                />
              </label>

              <label className="form-label">
                نمره هدف
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  value={targetScore}
                  onChange={(event) =>
                    setTargetScore(
                      event.target.value
                    )
                  }
                  placeholder="مثلاً 80"
                />
              </label>

              <label className="form-label full-width">
                یادداشت
                <textarea
                  className="form-input form-textarea"
                  value={notes}
                  onChange={(event) =>
                    setNotes(event.target.value)
                  }
                  placeholder="نکات مربوط به آزمون..."
                  rows={3}
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
                  !examDate
                }
                onClick={addExam}
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
