"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart3,
  Clock3,
  FileText,
  TrendingUp,
  BookOpen,
  Target,
  CalendarDays,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Subject = {
  id: string;
  name: string;
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
  percentage: number | null;
  score: number | null;
  max_score: number | null;
  test_date: string;
};

type ChartItem = {
  name: string;
  minutes: number;
};

export default function AnalyticsPage() {
  const supabase = createClient();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState<
    "7" | "30" | "all"
  >("7");

  async function loadData() {
    setLoading(true);

    const [subjectsResult, sessionsResult, testsResult] =
      await Promise.all([
        supabase
          .from("subjects")
          .select("id,name")
          .order("name"),

        supabase
          .from("study_sessions")
          .select(
            "id,subject_id,duration_minutes,started_at"
          )
          .order("started_at", {
            ascending: true,
          }),

        supabase
          .from("tests")
          .select(
            "id,subject_id,percentage,score,max_score,test_date"
          )
          .order("test_date", {
            ascending: true,
          }),
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

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

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

    return null;
  }

  const filteredSessions = useMemo(() => {
    if (period === "all") return sessions;

    const days = Number(period);

    const limit = new Date();
    limit.setHours(0, 0, 0, 0);
    limit.setDate(limit.getDate() - days + 1);

    return sessions.filter(
      (session) =>
        new Date(session.started_at) >= limit
    );
  }, [sessions, period]);

  const filteredTests = useMemo(() => {
    if (period === "all") return tests;

    const days = Number(period);

    const limit = new Date();
    limit.setHours(0, 0, 0, 0);
    limit.setDate(limit.getDate() - days + 1);

    return tests.filter(
      (test) => new Date(test.test_date) >= limit
    );
  }, [tests, period]);

  const totalMinutes = filteredSessions.reduce(
    (sum, session) =>
      sum + Number(session.duration_minutes || 0),
    0
  );

  const totalHours = totalMinutes / 60;

  const averageDailyHours = useMemo(() => {
    if (period === "all") {
      const dates = new Set(
        filteredSessions.map((session) =>
          new Date(
            session.started_at
          ).toLocaleDateString("en-CA")
        )
      );

      return dates.size
        ? totalHours / dates.size
        : 0;
    }

    const days = Number(period);

    return totalHours / days;
  }, [filteredSessions, totalHours, period]);

  const averagePercentage = useMemo(() => {
    const values = filteredTests
      .map(getPercentage)
      .filter(
        (value): value is number => value !== null
      );

    if (!values.length) return null;

    return (
      values.reduce((sum, value) => sum + value, 0) /
      values.length
    );
  }, [filteredTests]);

  const subjectChartData = useMemo<ChartItem[]>(() => {
    return subjects
      .map((subject) => {
        const minutes = filteredSessions
          .filter(
            (session) =>
              session.subject_id === subject.id
          )
          .reduce(
            (sum, session) =>
              sum +
              Number(
                session.duration_minutes || 0
              ),
            0
          );

        return {
          name: subject.name,
          minutes,
        };
      })
      .filter((item) => item.minutes > 0)
      .sort((a, b) => b.minutes - a.minutes);
  }, [subjects, filteredSessions]);

  const dailyChartData = useMemo(() => {
    const map = new Map<
      string,
      number
    >();

    filteredSessions.forEach((session) => {
      const date = new Date(
        session.started_at
      );

      const key =
        date.toLocaleDateString("fa-IR", {
          month: "numeric",
          day: "numeric",
        });

      map.set(
        key,
        (map.get(key) || 0) +
          Number(session.duration_minutes || 0)
      );
    });

    return Array.from(map.entries()).map(
      ([name, minutes]) => ({
        name,
        minutes,
      })
    );
  }, [filteredSessions]);

  const strongestSubject = useMemo(() => {
    if (!subjectChartData.length) return null;

    return subjectChartData[0];
  }, [subjectChartData]);

  const strongestTestSubject = useMemo(() => {
    const subjectScores = subjects
      .map((subject) => {
        const values = filteredTests
          .filter(
            (test) =>
              test.subject_id === subject.id
          )
          .map(getPercentage)
          .filter(
            (value): value is number =>
              value !== null
          );

        if (!values.length) return null;

        return {
          name: subject.name,
          average:
            values.reduce(
              (sum, value) => sum + value,
              0
            ) / values.length,
        };
      })
      .filter(
        (
          item
        ): item is {
          name: string;
          average: number;
        } => item !== null
      )
      .sort((a, b) => b.average - a.average);

    return subjectScores[0] || null;
  }, [subjects, filteredTests]);

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
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="page-kicker">
            تحلیل عملکرد
          </div>

          <h1>آمار و تحلیل</h1>

          <p className="page-subtitle">
            روند مطالعه و عملکرد آزمون‌هایت را بررسی کن.
          </p>
        </div>

        <div className="period-selector">
          <button
            className={
              period === "7"
                ? "period-active"
                : ""
            }
            onClick={() => setPeriod("7")}
          >
            ۷ روز
          </button>

          <button
            className={
              period === "30"
                ? "period-active"
                : ""
            }
            onClick={() => setPeriod("30")}
          >
            ۳۰ روز
          </button>

          <button
            className={
              period === "all"
                ? "period-active"
                : ""
            }
            onClick={() => setPeriod("all")}
          >
            همه
          </button>
        </div>
      </div>

      {loading ? (
        <div className="empty-card">
          <p>در حال محاسبه آمار...</p>
        </div>
      ) : (
        <>
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Clock3 size={21} />
              </div>

              <div>
                <span>کل مطالعه</span>
                <strong>
                  {formatHours(totalMinutes)}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CalendarDays size={21} />
              </div>

              <div>
                <span>میانگین روزانه</span>
                <strong>
                  {averageDailyHours.toFixed(1)} ساعت
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <FileText size={21} />
              </div>

              <div>
                <span>تعداد آزمون</span>
                <strong>
                  {filteredTests.length}
                </strong>
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
                    : `${averagePercentage.toFixed(
                        1
                      )}٪`}
                </strong>
              </div>
            </div>
          </section>

          <section className="analytics-grid">
            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h2>
                    <BarChart3 size={19} />
                    مطالعه بر اساس درس
                  </h2>

                  <p>
                    مجموع زمان مطالعه هر درس در بازه
                    انتخاب‌شده
                  </p>
                </div>
              </div>

              {subjectChartData.length === 0 ? (
                <div className="chart-empty">
                  هنوز داده‌ای برای نمایش وجود ندارد.
                </div>
              ) : (
                <div className="chart-container">
                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >
                    <BarChart
                      data={subjectChartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.15}
                      />

                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                      />

                      <YAxis
                        tick={{ fontSize: 12 }}
                      />

                      <Tooltip
                        formatter={(
                          value
                        ) =>
                          `${value} دقیقه`
                        }
                      />

                      <Bar
                        dataKey="minutes"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <div>
                  <h2>
                    <Clock3 size={19} />
                    روند مطالعه
                  </h2>

                  <p>
                    زمان مطالعه ثبت‌شده در هر روز
                  </p>
                </div>
              </div>

              {dailyChartData.length === 0 ? (
                <div className="chart-empty">
                  هنوز داده‌ای برای نمایش وجود ندارد.
                </div>
              ) : (
                <div className="chart-container">
                  <ResponsiveContainer
                    width="100%"
                    height={300}
                  >
                    <BarChart
                      data={dailyChartData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        opacity={0.15}
                      />

                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                      />

                      <YAxis
                        tick={{ fontSize: 12 }}
                      />

                      <Tooltip
                        formatter={(
                          value
                        ) =>
                          `${value} دقیقه`
                        }
                      />

                      <Bar
                        dataKey="minutes"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </section>

          <section className="analytics-insights">
            <div className="insight-card">
              <div className="insight-icon">
                <BookOpen size={20} />
              </div>

              <div>
                <span>بیشترین زمان مطالعه</span>

                <strong>
                  {strongestSubject
                    ? strongestSubject.name
                    : "—"}
                </strong>

                {strongestSubject && (
                  <small>
                    {formatHours(
                      strongestSubject.minutes
                    )}
                  </small>
                )}
              </div>
            </div>

            <div className="insight-card">
              <div className="insight-icon">
                <Target size={20} />
              </div>

              <div>
                <span>
                  بالاترین میانگین آزمون
                </span>

                <strong>
                  {strongestTestSubject
                    ? strongestTestSubject.name
                    : "—"}
                </strong>

                {strongestTestSubject && (
                  <small>
                    {strongestTestSubject.average.toFixed(
                      1
                    )}
                    ٪
                  </small>
                )}
              </div>
            </div>
          </section>

          <section className="analysis-note">
            <strong>نکته تحلیلی</strong>

            <p>
              این صفحه آمار ثبت‌شده را نمایش می‌دهد.
              ارتباط بین زمان مطالعه و نتیجه آزمون به‌تنهایی
              به معنی رابطه علت و معلولی نیست؛ برای تحلیل
              دقیق‌تر باید عوامل دیگری مثل نوع مطالعه،
              مبحث، دشواری آزمون و شرایط مطالعه نیز در نظر
              گرفته شوند.
            </p>
          </section>
        </>
      )}
    </main>
  );
                }
