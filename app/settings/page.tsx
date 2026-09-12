"use client";

import { useState } from "react";

type Theme = "dark" | "light" | "system";
type TimerMode = "stopwatch" | "countdown" | "pomodoro";

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [timerMode, setTimerMode] =
    useState<TimerMode>("pomodoro");

  const [dailyGoal, setDailyGoal] = useState(6);
  const [weekStart, setWeekStart] = useState("شنبه");

  const [autoStartBreak, setAutoStartBreak] =
    useState(false);

  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [focusMode, setFocusMode] = useState(false);

  const [rememberSession, setRememberSession] =
    useState(true);

  const [showSeconds, setShowSeconds] = useState(true);

  const [saved, setSaved] = useState(false);

  function saveSettings() {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  function toggle(
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    setter((current) => !current);
  }

  return (
    <main className="settings-page">
      <header className="settings-header">
        <div>
          <span className="dashboard-label">
            SETTINGS
          </span>

          <h1>تنظیمات</h1>

          <p>
            شخصی‌سازی Study Manager متناسب با روش مطالعه
            تو
          </p>
        </div>

        <button
          className="settings-save-button"
          onClick={saveSettings}
        >
          {saved ? "✓ ذخیره شد" : "ذخیره تنظیمات"}
        </button>
      </header>

      <section className="settings-layout">
        <div className="settings-main">
          {/* Account */}
          <section className="panel settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">
                👤
              </div>

              <div>
                <h2>حساب کاربری</h2>

                <p>
                  اطلاعات حساب و مشخصات کاربری
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="settings-field">
                <label>نام نمایشی</label>

                <input
                  defaultValue="دانش‌آموز"
                  placeholder="نام نمایشی"
                />
              </div>

              <div className="settings-field">
                <label>ایمیل</label>

                <input
                  type="email"
                  defaultValue="example@email.com"
                  placeholder="ایمیل"
                />
              </div>
            </div>

            <div className="settings-account-actions">
              <button>تغییر ایمیل</button>

              <button className="secondary">
                تغییر رمز عبور
              </button>
            </div>
          </section>

          {/* Appearance */}
          <section className="panel settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">
                ◐
              </div>

              <div>
                <h2>ظاهر برنامه</h2>

                <p>
                  نحوه نمایش برنامه را انتخاب کن.
                </p>
              </div>
            </div>

            <div className="theme-options">
              <button
                className={
                  theme === "dark" ? "active" : ""
                }
                onClick={() => setTheme("dark")}
              >
                <span className="theme-preview dark">
                  ◐
                </span>

                <div>
                  <strong>تیره</strong>

                  <small>
                    مناسب مطالعه در محیط کم‌نور
                  </small>
                </div>
              </button>

              <button
                className={
                  theme === "light" ? "active" : ""
                }
                onClick={() => setTheme("light")}
              >
                <span className="theme-preview light">
                  ☀
                </span>

                <div>
                  <strong>روشن</strong>

                  <small>
                    ظاهر روشن و ساده
                  </small>
                </div>
              </button>

              <button
                className={
                  theme === "system" ? "active" : ""
                }
                onClick={() => setTheme("system")}
              >
                <span className="theme-preview system">
                  ⚙
                </span>

                <div>
                  <strong>سیستم</strong>

                  <small>
                    هماهنگ با تنظیمات دستگاه
                  </small>
                </div>
              </button>
            </div>
          </section>

          {/* Study */}
          <section className="panel settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">
                📚
              </div>

              <div>
                <h2>مطالعه</h2>

                <p>
                  تنظیمات مربوط به برنامه و هدف مطالعه
                </p>
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="settings-field">
                <label>
                  هدف مطالعه روزانه
                </label>

                <div className="input-with-unit">
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={dailyGoal}
                    onChange={(event) =>
                      setDailyGoal(
                        Number(event.target.value)
                      )
                    }
                  />

                  <span>ساعت</span>
                </div>
              </div>

              <div className="settings-field">
                <label>
                  شروع هفته
                </label>

                <select
                  value={weekStart}
                  onChange={(event) =>
                    setWeekStart(event.target.value)
                  }
                >
                  <option value="شنبه">شنبه</option>
                  <option value="یکشنبه">
                    یکشنبه
                  </option>
                  <option value="دوشنبه">
                    دوشنبه
                  </option>
                </select>
              </div>
            </div>

            <div className="settings-toggle-list">
              <div className="settings-toggle-row">
                <div>
                  <strong>
                    ثبت خودکار جلسه مطالعه
                  </strong>

                  <p>
                    اطلاعات جلسه پس از پایان تایمر
                    به‌صورت خودکار ثبت شود.
                  </p>
                </div>

                <button
                  className={`settings-switch ${
                    rememberSession ? "active" : ""
                  }`}
                  onClick={() =>
                    toggle(setRememberSession)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <strong>
                    نمایش ثانیه در تایمر
                  </strong>

                  <p>
                    ثانیه‌ها در نمایشگر تایمر نشان داده
                    شوند.
                  </p>
                </div>

                <button
                  className={`settings-switch ${
                    showSeconds ? "active" : ""
                  }`}
                  onClick={() =>
                    toggle(setShowSeconds)
                  }
                >
                  <span />
                </button>
              </div>
            </div>
          </section>

          {/* Timer */}
          <section className="panel settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">
                ⏱
              </div>

              <div>
                <h2>تایمر</h2>

                <p>
                  تنظیمات پیش‌فرض جلسات مطالعه
                </p>
              </div>
            </div>

            <div className="settings-field">
              <label>
                حالت پیش‌فرض تایمر
              </label>

              <div className="timer-mode-options">
                <button
                  className={
                    timerMode === "stopwatch"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setTimerMode("stopwatch")
                  }
                >
                  <strong>کرنومتر</strong>

                  <small>
                    بدون زمان پایان مشخص
                  </small>
                </button>

                <button
                  className={
                    timerMode === "countdown"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setTimerMode("countdown")
                  }
                >
                  <strong>شمارش معکوس</strong>

                  <small>
                    تا رسیدن به هدف زمانی
                  </small>
                </button>

                <button
                  className={
                    timerMode === "pomodoro"
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setTimerMode("pomodoro")
                  }
                >
                  <strong>پومودورو</strong>

                  <small>
                    مطالعه و استراحت دوره‌ای
                  </small>
                </button>
              </div>
            </div>

            <div className="settings-toggle-list">
              <div className="settings-toggle-row">
                <div>
                  <strong>
                    شروع خودکار استراحت
                  </strong>

                  <p>
                    بعد از پایان زمان مطالعه، استراحت
                    به‌صورت خودکار آغاز شود.
                  </p>
                </div>

                <button
                  className={`settings-switch ${
                    autoStartBreak ? "active" : ""
                  }`}
                  onClick={() =>
                    toggle(setAutoStartBreak)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <strong>
                    صدای پایان تایمر
                  </strong>

                  <p>
                    هنگام پایان جلسه صدای اعلان پخش شود.
                  </p>
                </div>

                <button
                  className={`settings-switch ${
                    sound ? "active" : ""
                  }`}
                  onClick={() =>
                    toggle(setSound)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <strong>
                    لرزش دستگاه
                  </strong>

                  <p>
                    در دستگاه‌های پشتیبانی‌شده هنگام
                    پایان تایمر لرزش فعال شود.
                  </p>
                </div>

                <button
                  className={`settings-switch ${
                    vibration ? "active" : ""
                  }`}
                  onClick={() =>
                    toggle(setVibration)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div>
                  <strong>
                    حالت تمرکز
                  </strong>

                  <p>
                    هنگام مطالعه عناصر غیرضروری رابط
                    کاربری کمتر نمایش داده شوند.
                  </p>
                </div>

                <button
                  className={`settings-switch ${
                    focusMode ? "active" : ""
                  }`}
                  onClick={() =>
                    toggle(setFocusMode)
                  }
                >
                  <span />
                </button>
              </div>
            </div>
          </section>

          {/* Calendar */}
          <section className="panel settings-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">
                🗓
              </div>

              <div>
                <h2>تقویم</h2>

                <p>
                  تنظیمات نمایش تقویم و زمان‌بندی
                </p>
              </div>
            </div>

            <div className="settings-info-grid">
              <div>
                <span>تقویم</span>

                <strong>
                  هجری شمسی
                </strong>

                <small>
                  تقویم اصلی برنامه
                </small>
              </div>

              <div>
                <span>ساعت</span>

                <strong>
                  ۲۴ ساعته
                </strong>

                <small>
                  نمایش زمان
                </small>
              </div>

              <div>
                <span>زبان</span>

                <strong>
                  فارسی
                </strong>

                <small>
                  رابط کاربری
                </small>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="panel settings-section security-section">
            <div className="settings-section-header">
              <div className="settings-section-icon">
                🔒
              </div>

              <div>
                <h2>امنیت</h2>

                <p>
                  مدیریت دسترسی و حساب کاربری
                </p>
              </div>
            </div>

            <div className="security-actions">
              <button>
                تغییر رمز عبور
              </button>

              <button>
                خروج از همه دستگاه‌ها
              </button>

              <button className="danger">
                حذف حساب و اطلاعات
              </button>
            </div>

            <div className="security-warning">
              <span>⚠</span>

              <p>
                حذف حساب یک عملیات حساس است. در نسخه
                متصل به سرور، قبل از حذف نهایی تأیید
                مجدد دریافت خواهد شد.
              </p>
            </div>
          </section>
        </div>

        <aside className="settings-sidebar">
          <div className="panel settings-summary">
            <div className="settings-summary-icon">
              ⚙
            </div>

            <h2>تنظیمات فعلی</h2>

            <p>
              خلاصه‌ای از تنظیمات فعلی برنامه
            </p>

            <div className="settings-summary-list">
              <div>
                <span>ظاهر</span>

                <strong>
                  {theme === "dark"
                    ? "تیره"
                    : theme === "light"
                    ? "روشن"
                    : "سیستم"}
                </strong>
              </div>

              <div>
                <span>هدف روزانه</span>

                <strong>
                  {dailyGoal} ساعت
                </strong>
              </div>

              <div>
                <span>تایمر</span>

                <strong>
                  {timerMode === "pomodoro"
                    ? "پومودورو"
                    : timerMode === "countdown"
                    ? "شمارش معکوس"
                    : "کرنومتر"}
                </strong>
              </div>

              <div>
                <span>تقویم</span>

                <strong>
                  شمسی
                </strong>
              </div>
            </div>
          </div>

          <div className="panel settings-help">
            <span>💡</span>

            <div>
              <strong>
                توجه
              </strong>

              <p>
                در حال حاضر این تنظیمات در حافظه موقت
                صفحه نگهداری می‌شوند. پس از اتصال
                Supabase، تنظیمات به‌صورت دائمی برای
                حساب کاربری ذخیره خواهند شد.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
