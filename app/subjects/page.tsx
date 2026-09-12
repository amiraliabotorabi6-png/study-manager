"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  Clock3,
  Plus,
  Trash2,
  TrendingUp,
  Target,
  FileText,
  X,
} from "lucide-react";

type Subject = {
  id: string;
  name: string;
  color: string | null;
};

type StudySession = {
  id: string;
  subject_id: string | null;
  duration_minutes: number;
  started_at: string;
};

type Test = {
  id: string;
  subject_id: string | null;
  score: number | null;
  max_score: number | null;
  percentage: number | null;
  test_date: string;
};

type Topic = {
  id: string;
  subject_id: string;
  name: string;
};

export default function SubjectsPage() {
  const supabase = createClient();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);

  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  async function loadData() {
    setLoading(true);

    const [
      subjectsResult,
      sessionsResult,
      testsResult,
      topicsResult,
    ] = await Promise.all([
      supabase
        .from("subjects")
        .select("id,name,color")
        .order("name"),

      supabase
        .from("study_sessions")
        .select("id,subject_id,duration_minutes,started_at")
        .order("started_at", { ascending: false }),

      supabase
        .from("tests")
        .select(
          "id,subject_id,score,max_score,percentage,test_date"
        )
        .order("test_date", { ascending: false }),

      supabase
        .from("topics")
        .select("id,subject_id,name")
        .order("name"),
    ]);

    if (subjectsResult.data) {
      setSubjects(subjectsResult.data);
    }

    if (sessionsResult.data) {
      setSessions(sessionsResult.data);
    }

    if (testsResult.data) {
      setTests(testsResult.data);
    }

    if (topicsResult.data) {
      setTopics(topicsResult.data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addSubject() {
    const name = newName.trim();

    if (!name || adding) return;

    setAdding(true);

    const { error } = await supabase.from("subjects").insert({
      name,
    });

    if (!error) {
      setNewName("");
      setShowAdd(false);
      await loadData();
    }

    setAdding(false);
  }

  async function deleteSubject(id: string) {
    const subject = subjects.find((item) => item.id === id);

    if (!subject) return;

    const confirmed = window.confirm(
      `درس «${subject.name}» حذف شود؟`
    );

    if (!confirmed) return;

    await supabase
      .from("subjects")
      .delete()
      .eq("id", id);

    await loadData();
  }

  const subjectStats = useMemo(() => {
    return subjects.map((subject) => {
      const subjectSessions = sessions.filter(
        (session) => session.subject_id === subject.id
      );

      const subjectTests = tests.filter(
        (test) => test.subject_id === subject.id
      );

      const subjectTopics = topics.filter(
        (topic) => topic.subject_id === subject.id
      );

      const totalMinutes = subjectSessions.reduce(
        (sum, session) =>
          sum + Number(session.duration_minutes || 0),
        0
      );

      const percentages = subjectTests
        .map((test) => {
          if (test.percentage !== null) {
            return Number(test.percentage);
          }

          if (
            test.score !== null &&
            test.max_score &&
            test.max_score > 0
          ) {
            return (
              (Number(test.score) /
                Number(test.max_score)) *
              100
            );
          }

          return null;
        })
        .filter(
          (value): value is number => value !== null
        );

      const average =
        percentages.length > 0
          ? percentages.reduce(
              (sum, value) => sum + value,
              0
            ) / percentages.length
          : null;

      return {
        ...subject,
        totalMinutes,
        testsCount: subjectTests.length,
        topicsCount: subjectTopics.length,
        average,
      };
    });
  }, [subjects, sessions, tests, topics]);

  const totalStudyMinutes = sessions.reduce(
    (sum, session) =>
      sum + Number(session.duration_minutes || 0),
    0
  );

  const totalTests = tests.length;

  const overallAverage = useMemo(() => {
    const values = tests
      .map((test) => {
        if (test.percentage !== null) {
          return Number(test.percentage);
        }

        if (
          test.score !== null &&
          test.max_score &&
          test.max_score > 0
        ) {
          return (
            (Number(test.score) /
              Number(test.max_score)) *
            100
          );
        }

        return null;
      })
      .filter(
        (value): value is number => value !== null
      );

    if (!values.length) return null;

    return (
      values.reduce((sum, value) => sum + value, 0) /
      values.length
    );
  }, [tests]);

  function formatTime(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} دقیقه`;
    if (mins === 0) return `${hours} ساعت`;

    return `${hours} ساعت و ${mins} دقیقه`;
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="page-kicker">مدیریت دروس</div>
          <h1>درس‌ها</h1>
          <p className="page-subtitle">
            وضعیت مطالعه، آزمون‌ها و مباحث هر درس را یکجا ببین.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={18} />
          افزودن درس
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={21} />
          </div>
          <div>
            <span>تعداد درس‌ها</span>
            <strong>{subjects.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={21} />
          </div>
          <div>
            <span>کل مطالعه</span>
            <strong>
              {formatTime(totalStudyMinutes)}
            </strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FileText size={21} />
          </div>
          <div>
            <span>تعداد آزمون‌ها</span>
            <strong>{totalTests}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={21} />
          </div>
          <div>
            <span>میانگین آزمون‌ها</span>
            <strong>
              {overallAverage === null
                ? "—"
                : `${overallAverage.toFixed(1)}٪`}
            </strong>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="empty-card">
          <p>در حال دریافت اطلاعات...</p>
        </div>
      ) : subjects.length === 0 ? (
        <div className="empty-card">
          <BookOpen size={42} />
          <h2>هنوز درسی ثبت نشده</h2>
          <p>
            اولین درس خودت را اضافه کن تا آمار مطالعه و
            آزمون‌ها برای آن ثبت شود.
          </p>

          <button
            className="primary-button"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={18} />
            افزودن اولین درس
          </button>
        </div>
      ) : (
        <section className="subjects-grid">
          {subjectStats.map((subject) => (
            <article
              className="subject-card"
              key={subject.id}
            >
              <div className="subject-card-top">
                <div
                  className="subject-color"
                  style={{
                    background:
                      subject.color || "currentColor",
                  }}
                />

                <div className="subject-title">
                  <h2>{subject.name}</h2>
                  <span>
                    {subject.topicsCount} مبحث
                  </span>
                </div>

                <button
                  className="icon-button danger"
                  title="حذف درس"
                  onClick={() =>
                    deleteSubject(subject.id)
                  }
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <div className="subject-main-stat">
                <span>زمان مطالعه</span>
                <strong>
                  {formatTime(subject.totalMinutes)}
                </strong>
              </div>

              <div className="subject-mini-grid">
                <div>
                  <span>آزمون</span>
                  <strong>{subject.testsCount}</strong>
                </div>

                <div>
                  <span>میانگین</span>
                  <strong>
                    {subject.average === null
                      ? "—"
                      : `${subject.average.toFixed(1)}٪`}
                  </strong>
                </div>

                <div>
                  <span>مبحث</span>
                  <strong>
                    {subject.topicsCount}
                  </strong>
                </div>
              </div>

              <div className="subject-actions">
                <a
                  href={`/subjects/${subject.id}`}
                  className="secondary-button"
                >
                  <Target size={17} />
                  جزئیات درس
                </a>
              </div>
            </article>
          ))}
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
                <h2>افزودن درس</h2>
                <p>
                  نام درس جدید را وارد کن.
                </p>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowAdd(false)}
              >
                <X size={19} />
              </button>
            </div>

            <label className="form-label">
              نام درس
              <input
                className="form-input"
                value={newName}
                onChange={(event) =>
                  setNewName(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    addSubject();
                  }
                }}
                placeholder="مثلاً زیست‌شناسی"
                autoFocus
              />
            </label>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowAdd(false)}
              >
                انصراف
              </button>

              <button
                className="primary-button"
                onClick={addSubject}
                disabled={adding || !newName.trim()}
              >
                {adding
                  ? "در حال ثبت..."
                  : "ثبت درس"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
