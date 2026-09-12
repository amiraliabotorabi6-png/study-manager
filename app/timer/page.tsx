"use client";

import { useEffect, useRef, useState } from "react";

type TimerMode = "stopwatch" | "countdown" | "pomodoro";

export default function TimerPage() {
  const [mode, setMode] = useState<TimerMode>("stopwatch");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [targetMinutes, setTargetMinutes] = useState(25);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [note, setNote] = useState("");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSeconds((current) => {
        if (mode === "stopwatch") {
          return current + 1;
        }

        if (mode === "countdown") {
          if (current <= 1) {
            setRunning(false);
            return 0;
          }

          return current - 1;
        }

        if (current <= 1) {
          setRunning(false);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, mode]);

  function formatTime(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return [hours, minutes, secs]
      .map((value) => String(value).padStart(2, "0"))
      .join(":");
  }

  function startTimer() {
    if (mode !== "stopwatch" && seconds === 0) {
      setSeconds(targetMinutes * 60);
    }

    setRunning(true);
  }

  function pauseTimer() {
    setRunning(false);
  }

  function resetTimer() {
    setRunning(false);

    if (mode === "stopwatch") {
      setSeconds(0);
    } else {
      setSeconds(targetMinutes * 60);
    }
  }

  function changeMode(newMode: TimerMode) {
    setRunning(false);
    setMode(newMode);

    if (newMode === "stopwatch") {
      setSeconds(0);
    } else {
      setSeconds(targetMinutes * 60);
    }
  }

  function changeTarget(value: number) {
    const safeValue = Math.max(1, value);
    setTargetMinutes(safeValue);

    if (!running && mode !== "stopwatch") {
      setSeconds(safeValue * 60);
    }
  }

  return (
    <main className="timer-page">
      <header className="timer-header">
        <div>
          <span className="dashboard-label">STUDY MANAGER</span>
          <h1>تایمر مطالعه</h1>
          <p>زمان مطالعه‌ات را دقیق ثبت و مدیریت کن.</p>
        </div>

        <div className="timer-status">
          <span className={running ? "status-dot active" : "status-dot"} />
          {running ? "در حال مطالعه" : "متوقف"}
        </div>
      </header>

      <section className="timer-layout">
        <div className="timer-main-card">
          <div className="timer-modes">
            <button
              className={mode === "stopwatch" ? "mode active" : "mode"}
              onClick={() => changeMode("stopwatch")}
            >
              کرنومتر
            </button>

            <button
              className={mode === "countdown" ? "mode active" : "mode"}
              onClick={() => changeMode("countdown")}
            >
              شمارش معکوس
            </button>

            <button
              className={mode === "pomodoro" ? "mode active" : "mode"}
              onClick={() => changeMode("pomodoro")}
            >
              پومودورو
            </button>
          </div>

          <div className="timer-display">
            <span>{formatTime(seconds)}</span>
          </div>

          <div className="timer-controls">
            {!running ? (
              <button className="start-button" onClick={startTimer}>
                شروع مطالعه
              </button>
            ) : (
              <button className="pause-button" onClick={pauseTimer}>
                توقف موقت
              </button>
            )}

            <button className="reset-button" onClick={resetTimer}>
              بازنشانی
            </button>
          </div>

          {mode !== "stopwatch" && (
            <div className="target-control">
              <label htmlFor="target">مدت هدف</label>

              <div className="target-input">
                <input
                  id="target"
                  type="number"
                  min="1"
                  value={targetMinutes}
                  onChange={(event) =>
                    changeTarget(Number(event.target.value))
                  }
                />
                <span>دقیقه</span>
              </div>
            </div>
          )}
        </div>

        <aside className="timer-side-card">
          <h2>اطلاعات جلسه</h2>
          <p>برای ثبت دقیق‌تر، مشخصات مطالعه را وارد کن.</p>

          <div className="field">
            <label htmlFor="subject">درس</label>
            <select
              id="subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            >
              <option value="">انتخاب درس</option>
              <option value="زیست‌شناسی">زیست‌شناسی</option>
              <option value="شیمی">شیمی</option>
              <option value="ریاضی">ریاضی</option>
              <option value="فیزیک">فیزیک</option>
              <option value="فارسی">فارسی</option>
              <option value="دینی">دینی</option>
              <option value="عربی">عربی</option>
              <option value="زبان">زبان</option>
              <option value="زمین‌شناسی">زمین‌شناسی</option>
              <option value="نگارش">نگارش</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="topic">مبحث</label>
            <input
              id="topic"
              type="text"
              placeholder="مثلاً گوارش"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="note">یادداشت جلسه</label>
            <textarea
              id="note"
              rows={5}
              placeholder="نکات، کیفیت مطالعه یا توضیحات..."
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </div>

          <div className="session-info">
            <div>
              <span>درس</span>
              <strong>{subject || "—"}</strong>
            </div>

            <div>
              <span>مبحث</span>
              <strong>{topic || "—"}</strong>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
      }
