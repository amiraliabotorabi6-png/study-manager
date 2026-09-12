"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  Check,
  Eye,
  KeyRound,
  LogOut,
  Moon,
  Save,
  Shield,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setEmail(user.email ?? "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.full_name) {
        setName(profile.full_name);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();

    setSaving(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: name.trim() || null,
      });

    if (error) {
      setMessage("ذخیره اطلاعات انجام نشد.");
    } else {
      setMessage("اطلاعات با موفقیت ذخیره شد.");
    }

    setSaving(false);
  }

  async function changePassword() {
    if (!email) return;

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/settings`,
        }
      );

    if (error) {
      setMessage(
        "ارسال لینک تغییر رمز انجام نشد."
      );
      return;
    }

    setMessage(
      "لینک تغییر رمز عبور به ایمیل شما ارسال شد."
    );
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function toggleDarkMode() {
    const next = !darkMode;
    setDarkMode(next);

    document.documentElement.classList.toggle(
      "dark",
      next
    );

    localStorage.setItem(
      "study-manager-theme",
      next ? "dark" : "light"
    );
  }

  function toggleNotifications() {
    const next = !notifications;
    setNotifications(next);

    localStorage.setItem(
      "study-manager-notifications",
      String(next)
    );
  }

  if (loading) {
    return (
      <main className="page-container">
        <div className="empty-state">
          در حال بارگذاری تنظیمات...
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="eyebrow">حساب کاربری</div>

          <h1>تنظیمات</h1>

          <p>
            اطلاعات حساب، ظاهر برنامه و تنظیمات شخصی را
            مدیریت کن.
          </p>
        </div>
      </div>

      {message && (
        <div className="success-message">
          <Check size={18} />
          {message}
        </div>
      )}

      <div className="settings-page-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>اطلاعات حساب</h2>
              <p>
                اطلاعات پایه حساب کاربری
              </p>
            </div>

            <div className="panel-header-icon">
              <User size={20} />
            </div>
          </div>

          <form onSubmit={saveProfile}>
            <div className="form-group">
              <label>نام</label>

              <input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="نام شما"
              />
            </div>

            <div className="form-group">
              <label>ایمیل</label>

              <input
                value={email}
                disabled
                type="email"
              />

              <small>
                ایمیل حساب از این بخش قابل تغییر نیست.
              </small>
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={saving}
            >
              <Save size={18} />

              {saving
                ? "در حال ذخیره..."
                : "ذخیره تغییرات"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>ظاهر و اعلان‌ها</h2>
              <p>
                نحوه نمایش و دریافت اعلان‌ها
              </p>
            </div>

            <div className="panel-header-icon">
              <Eye size={20} />
            </div>
          </div>

          <div className="settings-list">
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-icon">
                  <Moon size={18} />
                </div>

                <div>
                  <strong>حالت تاریک</strong>

                  <span>
                    استفاده از ظاهر تیره برنامه
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`switch ${
                  darkMode ? "active" : ""
                }`}
                onClick={toggleDarkMode}
              >
                <span />
              </button>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-icon">
                  <Bell size={18} />
                </div>

                <div>
                  <strong>
                    اعلان‌ها
                  </strong>

                  <span>
                    فعال بودن اعلان‌های برنامه
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={`switch ${
                  notifications
                    ? "active"
                    : ""
                }`}
                onClick={
                  toggleNotifications
                }
              >
                <span />
              </button>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>امنیت</h2>

              <p>
                مدیریت امنیت حساب کاربری
              </p>
            </div>

            <div className="panel-header-icon">
              <Shield size={20} />
            </div>
          </div>

          <div className="settings-list">
            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-icon">
                  <KeyRound size={18} />
                </div>

                <div>
                  <strong>
                    تغییر رمز عبور
                  </strong>

                  <span>
                    ارسال لینک تغییر رمز به ایمیل
                  </span>
                </div>
              </div>

              <button
                className="secondary-button"
                onClick={changePassword}
              >
                ارسال لینک
              </button>
            </div>

            <div className="setting-row">
              <div className="setting-info">
                <div className="setting-icon">
                  <LogOut size={18} />
                </div>

                <div>
                  <strong>
                    خروج از حساب
                  </strong>

                  <span>
                    خروج از این دستگاه
                  </span>
                </div>
              </div>

              <button
                className="secondary-button danger-button"
                onClick={logout}
              >
                خروج
              </button>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>داده‌ها</h2>

              <p>
                مدیریت اطلاعات ذخیره‌شده در برنامه
              </p>
            </div>
          </div>

          <div className="info-box">
            <Shield size={18} />

            <p>
              اطلاعات حساب و داده‌های اصلی برنامه در
              Supabase ذخیره می‌شوند و دسترسی هر کاربر
              با سیاست‌های امنیتی پایگاه داده محدود
              شده است.
            </p>
          </div>

          <div className="settings-action-row">
            <button
              className="secondary-button"
              onClick={() =>
                (window.location.href =
                  "/backup")
              }
            >
              پشتیبان‌گیری و بازیابی
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
