"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      setEmail(user.email ?? "");

      const metadata = user.user_metadata;

      setName(metadata?.full_name ?? "");
      setLoading(false);
    }

    loadProfile();
  }, []);

  async function saveProfile() {
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          data: {
            full_name: name.trim(),
          },
        });

      if (updateError) {
        setError(
          "ذخیره اطلاعات انجام نشد. دوباره تلاش کن."
        );
        return;
      }

      setMessage("اطلاعات حساب با موفقیت ذخیره شد.");
    } catch {
      setError(
        "خطایی در ارتباط با سرور رخ داد."
      );
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await supabase.auth.signOut();

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="app-page">
        <div className="loading-state">
          <span className="auth-spinner" />
          <p>در حال بارگذاری تنظیمات...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-page">
      <div className="page-header">
        <div>
          <span className="page-eyebrow">
            SETTINGS
          </span>

          <h1>تنظیمات</h1>

          <p>
            حساب کاربری و تنظیمات Study Manager را
            مدیریت کن.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>حساب کاربری</h2>

              <p>
                اطلاعات پایه حساب خودت را مدیریت کن.
              </p>
            </div>
          </div>

          <div className="settings-form">
            <div className="auth-field">
              <label htmlFor="settings-name">
                نام
              </label>

              <input
                id="settings-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="نام خود را وارد کن"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="settings-email">
                ایمیل
              </label>

              <input
                id="settings-email"
                type="email"
                dir="ltr"
                value={email}
                disabled
              />
            </div>

            {message && (
              <div className="settings-message">
                {message}
              </div>
            )}

            {error && (
              <div className="auth-error">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <button
              type="button"
              className="primary-button"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving
                ? "در حال ذخیره..."
                : "ذخیره تغییرات"}
            </button>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>ظاهر برنامه</h2>

              <p>
                ظاهر و تجربه کاربری را تنظیم کن.
              </p>
            </div>
          </div>

          <div className="settings-options">
            <div className="settings-option">
              <div>
                <strong>
                  حالت تاریک
                </strong>

                <span>
                  استفاده از رابط کاربری تاریک
                </span>
              </div>

              <button
                type="button"
                className={
                  darkMode
                    ? "toggle active"
                    : "toggle"
                }
                onClick={() =>
                  setDarkMode(
                    (current) => !current
                  )
                }
                aria-label="تغییر حالت تاریک"
              >
                <span />
              </button>
            </div>

            <div className="settings-option">
              <div>
                <strong>
                  اعلان‌ها
                </strong>

                <span>
                  فعال‌سازی اعلان‌های Study Manager
                </span>
              </div>

              <button
                type="button"
                className={
                  notifications
                    ? "toggle active"
                    : "toggle"
                }
                onClick={() =>
                  setNotifications(
                    (current) => !current
                  )
                }
                aria-label="تغییر اعلان‌ها"
              >
                <span />
              </button>
            </div>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>امنیت حساب</h2>

              <p>
                گزینه‌های امنیتی حساب کاربری.
              </p>
            </div>
          </div>

          <div className="settings-actions">
            <Link
              href="/forgot-password"
              className="secondary-button"
            >
              تغییر / بازیابی رمز عبور
            </Link>

            <button
              type="button"
              className="danger-button"
              onClick={logout}
            >
              خروج از حساب
            </button>
          </div>
        </section>

        <section className="dashboard-card danger-card">
          <div className="card-header">
            <div>
              <h2>منطقه خطر</h2>

              <p>
                عملیات حساس مربوط به حساب در این بخش
                قرار می‌گیرد.
              </p>
            </div>
          </div>

          <div className="danger-warning">
            <strong>
              حذف حساب
            </strong>

            <p>
              حذف حساب و اطلاعات یک عملیات دائمی است.
              این قابلیت بعداً با تأیید چندمرحله‌ای
              پیاده‌سازی خواهد شد.
            </p>

            <button
              type="button"
              className="danger-button"
              disabled
            >
              حذف حساب
            </button>
          </div>
        </section>
      </div>
    </main>
  );
          }
