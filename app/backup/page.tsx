"use client";

import { useState } from "react";
import {
  Download,
  Upload,
  Database,
  ShieldCheck,
  FileJson,
  AlertTriangle,
} from "lucide-react";

const tables = [
  "subjects",
  "topics",
  "resources",
  "study_sessions",
  "daily_availability",
  "daily_activities",
  "exams",
  "tests",
  "test_questions",
  "mistake_categories",
  "mistakes",
  "tasks",
  "goals",
  "planner_items",
  "journal_entries",
  "sleep_records",
  "notification_settings",
  "notifications",
  "achievements",
  "study_streaks",
];

export default function BackupPage() {
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState("");

  async function createBackup() {
    setMessage("");

    try {
      const response = await fetch("/api/backup");

      if (!response.ok) {
        throw new Error();
      }

      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `study-manager-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);

      setMessage(
        "فایل پشتیبان با موفقیت ساخته شد."
      );
    } catch {
      setMessage(
        "ساخت فایل پشتیبان انجام نشد."
      );
    }
  }

  async function importBackup(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImporting(true);
    setMessage("");

    try {
      const text = await file.text();

      JSON.parse(text);

      /*
       * فعلاً فقط ساختار فایل بررسی می‌شود.
       * API بازیابی اطلاعات را در مرحله اتصال کامل
       * بکاپ به Supabase اضافه می‌کنیم.
       */

      setMessage(
        "فایل پشتیبان معتبر است و آماده بازیابی می‌باشد."
      );
    } catch {
      setMessage(
        "فایل انتخاب‌شده یک JSON معتبر نیست."
      );
    }

    setImporting(false);
    event.target.value = "";
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            مدیریت داده‌ها
          </div>

          <h1>پشتیبان‌گیری و بازیابی</h1>

          <p>
            از اطلاعات مطالعه‌ات نسخه پشتیبان بگیر تا
            در صورت نیاز بتوانی آن‌ها را بازیابی کنی.
          </p>
        </div>
      </div>

      {message && (
        <div className="success-message">
          <ShieldCheck size={18} />
          {message}
        </div>
      )}

      <div className="backup-grid">
        <section className="panel backup-main-card">
          <div className="backup-icon">
            <Download size={28} />
          </div>

          <div className="eyebrow">
            Export
          </div>

          <h2>
            دریافت نسخه پشتیبان
          </h2>

          <p>
            اطلاعات حساب و داده‌های اصلی برنامه را در
            قالب یک فایل JSON دریافت کن.
          </p>

          <button
            className="primary-button"
            onClick={createBackup}
          >
            <Download size={18} />
            ساخت فایل پشتیبان
          </button>
        </section>

        <section className="panel backup-main-card">
          <div className="backup-icon">
            <Upload size={28} />
          </div>

          <div className="eyebrow">
            Import
          </div>

          <h2>
            بازیابی اطلاعات
          </h2>

          <p>
            یک فایل پشتیبان JSON را انتخاب کن تا
            اعتبار آن بررسی شود.
          </p>

          <label className="primary-button file-button">
            <Upload size={18} />

            {importing
              ? "در حال بررسی..."
              : "انتخاب فایل"}

            <input
              type="file"
              accept=".json,application/json"
              onChange={importBackup}
              disabled={importing}
              hidden
            />
          </label>
        </section>
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>
              اطلاعات موجود در نسخه پشتیبان
            </h2>

            <p>
              داده‌های اصلی برنامه در نسخه پشتیبان
              قرار می‌گیرند.
            </p>
          </div>

          <Database size={21} />
        </div>

        <div className="backup-tables">
          {tables.map((table) => (
            <span key={table}>
              {table}
            </span>
          ))}
        </div>
      </section>

      <section className="warning-box">
        <AlertTriangle size={20} />

        <div>
          <strong>
            نکته مهم درباره بازیابی
          </strong>

          <p>
            بازیابی واقعی اطلاعات باید با احراز هویت
            و کنترل دقیق مالکیت داده‌ها انجام شود تا
            اطلاعات موجود به‌صورت ناخواسته جایگزین
            نشوند.
          </p>
        </div>
      </section>

      <section className="panel security-backup-card">
        <div className="security-backup-icon">
          <ShieldCheck size={22} />
        </div>

        <div>
          <h3>
            امنیت اطلاعات
          </h3>

          <p>
            فایل پشتیبان را در اختیار دیگران قرار نده؛
            ممکن است شامل اطلاعات شخصی و تاریخچه
            مطالعه تو باشد.
          </p>
        </div>
      </section>
    </main>
  );
}
