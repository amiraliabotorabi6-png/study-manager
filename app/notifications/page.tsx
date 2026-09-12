"use client";

import { useState } from "react";

type NotificationType =
  | "study-start"
  | "study-end"
  | "break"
  | "exam"
  | "task"
  | "report"
  | "goal"
  | "review"
  | "falling-behind";

type NotificationSetting = {
  id: NotificationType;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
  browser: boolean;
  inApp: boolean;
};

const initialSettings: NotificationSetting[] = [
  {
    id: "study-start",
    title: "شروع مطالعه",
    description: "قبل از شروع یک جلسه مطالعه به تو یادآوری شود.",
    icon: "▶",
    enabled: true,
    browser: true,
    inApp: true,
  },
  {
    id: "study-end",
    title: "پایان مطالعه",
    description: "وقتی زمان هدف جلسه تمام شد اطلاع داده شود.",
    icon: "✓",
    enabled: true,
    browser: true,
    inApp: true,
  },
  {
    id: "break",
    title: "استراحت",
    description: "زمان شروع و پایان استراحت‌ها یادآوری شود.",
    icon: "◷",
    enabled: true,
    browser: false,
    inApp: true,
  },
  {
    id: "exam",
    title: "آزمون‌ها",
    description: "نزدیک‌شدن آزمون‌های مهم اطلاع داده شود.",
    icon: "📝",
    enabled: true,
    browser: true,
    inApp: true,
  },
  {
    id: "task",
    title: "کارهای عقب‌افتاده",
    description: "کارهایی که از موعدشان گذشته‌اند یادآوری شوند.",
    icon: "!",
    enabled: true,
    browser: true,
    inApp: true,
  },
  {
    id: "report",
    title: "گزارش‌ها",
    description: "گزارش‌های روزانه، هفتگی و ماهانه اطلاع داده شوند.",
    icon: "▥",
    enabled: false,
    browser: false,
    inApp: true,
  },
  {
    id: "goal",
    title: "اهداف",
    description: "رسیدن به اهداف یا نزدیک‌شدن به آن‌ها اطلاع داده شود.",
    icon: "🎯",
    enabled: true,
    browser: true,
    inApp: true,
  },
  {
    id: "review",
    title: "مرور",
    description: "وقتی زمان مرور یک مبحث فرا رسید یادآوری شود.",
    icon: "↻",
    enabled: true,
    browser: false,
    inApp: true,
  },
  {
    id: "falling-behind",
    title: "عقب‌ماندن از برنامه",
    description: "اگر از برنامه روزانه عقب افتادی اطلاع داده شود.",
    icon: "↗",
    enabled: true,
    browser: true,
    inApp: true,
  },
];

type RecentNotification = {
  id: number;
  title: string;
  text: string;
  time: string;
  type: NotificationType;
  read: boolean;
};

const initialRecent: RecentNotification[] = [
  {
    id: 1,
    title: "آزمون نزدیک است",
    text: "آزمون زیست‌شناسی ۶ روز دیگر برگزار می‌شود.",
    time: "امروز، ۱۸:۳۰",
    type: "exam",
    read: false,
  },
  {
    id: 2,
    title: "هدف مطالعه",
    text: "امروز ۷۵٪ از هدف مطالعه روزانه تکمیل شده است.",
    time: "امروز، ۱۷:۱۰",
    type: "goal",
    read: true,
  },
  {
    id: 3,
    title: "زمان مرور",
    text: "مرور مبحث تنظیم عصبی برای امروز در نظر گرفته شده است.",
    time: "امروز، ۱۵:۰۰",
    type: "review",
    read: true,
  },
];

export default function NotificationsPage() {
  const [settings, setSettings] =
    useState<NotificationSetting[]>(initialSettings);

  const [recent, setRecent] =
    useState<RecentNotification[]>(initialRecent);

  const [permission, setPermission] = useState<
    "unknown" | "granted" | "denied"
  >("unknown");

  const [quietHours, setQuietHours] = useState(true);
  const [quietStart, setQuietStart] = useState("۲۳:۰۰");
  const [quietEnd, setQuietEnd] = useState("۰۷:۳۰");

  const unreadCount = recent.filter(
    (item) => !item.read
  ).length;

  function toggleSetting(id: NotificationType) {
    setSettings((current) =>
      current.map((setting) =>
        setting.id === id
          ? {
              ...setting,
              enabled: !setting.enabled,
            }
          : setting
      )
    );
  }

  function toggleChannel(
    id: NotificationType,
    channel: "browser" | "inApp"
  ) {
    setSettings((current) =>
      current.map((setting) =>
        setting.id === id
          ? {
              ...setting,
              [channel]: !setting[channel],
            }
          : setting
      )
    );
  }

  function enableAll() {
    setSettings((current) =>
      current.map((setting) => ({
        ...setting,
        enabled: true,
      }))
    );
  }

  function disableAll() {
    setSettings((current) =>
      current.map((setting) => ({
        ...setting,
        enabled: false,
      }))
    );
  }

  async function requestBrowserPermission() {
    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      setPermission("denied");
      return;
    }

    const result = await window.Notification.requestPermission();

    if (result === "granted") {
      setPermission("granted");
    } else {
      setPermission("denied");
    }
  }

  function markAsRead(id: number) {
    setRecent((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
      )
    );
  }

  function markAllAsRead() {
    setRecent((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  }

  function deleteNotification(id: number) {
    setRecent((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function notificationTypeLabel(type: NotificationType) {
    if (type === "study-start") return "مطالعه";
    if (type === "study-end") return "مطالعه";
    if (type === "break") return "استراحت";
    if (type === "exam") return "آزمون";
    if (type === "task") return "کار";
    if (type === "report") return "گزارش";
    if (type === "goal") return "هدف";
    if (type === "review") return "مرور";
    return "برنامه";
  }

  return (
    <main className="notifications-page">
      <header className="notifications-header">
        <div>
          <span className="dashboard-label">
            NOTIFICATIONS
          </span>

          <h1>اعلان‌ها</h1>

          <p>
            مدیریت اعلان‌ها و یادآوری‌های Study Manager
          </p>
        </div>

        <div className="notification-header-actions">
          <button onClick={markAllAsRead}>
            خواندن همه
          </button>
        </div>
      </header>

      <section className="notification-overview">
        <div className="panel notification-overview-card">
          <div className="notification-overview-icon">
            🔔
          </div>

          <div>
            <span>اعلان‌های فعال</span>

            <strong>
              {
                settings.filter(
                  (setting) => setting.enabled
                ).length
              }
            </strong>

            <small>
              از {settings.length} نوع اعلان
            </small>
          </div>
        </div>

        <div className="panel notification-overview-card">
          <div className="notification-overview-icon">
            ●
          </div>

          <div>
            <span>خوانده‌نشده</span>

            <strong>{unreadCount}</strong>

            <small>
              اعلان جدید
            </small>
          </div>
        </div>

        <div className="panel notification-overview-card">
          <div className="notification-overview-icon">
            ◷
          </div>

          <div>
            <span>ساعات سکوت</span>

            <strong>
              {quietHours ? "فعال" : "خاموش"}
            </strong>

            <small>
              {quietStart} تا {quietEnd}
            </small>
          </div>
        </div>
      </section>

      <section className="notifications-layout">
        <div className="notifications-main">
          <section className="panel notification-settings-panel">
            <div className="panel-header">
              <div>
                <h2>تنظیمات اعلان</h2>

                <p>
                  هر نوع اعلان را جداگانه فعال یا غیرفعال کن.
                </p>
              </div>

              <div className="notification-bulk-actions">
                <button onClick={enableAll}>
                  فعال‌کردن همه
                </button>

                <button
                  className="secondary"
                  onClick={disableAll}
                >
                  غیرفعال‌کردن همه
                </button>
              </div>
            </div>

            <div className="notification-settings-list">
              {settings.map((setting) => (
                <div
                  className={`notification-setting ${
                    setting.enabled ? "enabled" : ""
                  }`}
                  key={setting.id}
                >
                  <div className="notification-setting-icon">
                    {setting.icon}
                  </div>

                  <div className="notification-setting-content">
                    <div>
                      <strong>{setting.title}</strong>

                      <p>{setting.description}</p>
                    </div>

                    <div className="notification-channels">
                      <button
                        className={
                          setting.inApp
                            ? "channel active"
                            : "channel"
                        }
                        onClick={() =>
                          toggleChannel(
                            setting.id,
                            "inApp"
                          )
                        }
                      >
                        داخل برنامه
                      </button>

                      <button
                        className={
                          setting.browser
                            ? "channel active"
                            : "channel"
                        }
                        onClick={() =>
                          toggleChannel(
                            setting.id,
                            "browser"
                          )
                        }
                      >
                        مرورگر
                      </button>
                    </div>
                  </div>

                  <button
                    className={`notification-switch ${
                      setting.enabled ? "active" : ""
                    }`}
                    onClick={() =>
                      toggleSetting(setting.id)
                    }
                    aria-label={`تغییر ${setting.title}`}
                  >
                    <span />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="panel quiet-hours-panel">
            <div className="panel-header">
              <div>
                <h2>ساعات سکوت</h2>

                <p>
                  در این بازه اعلان‌های غیرضروری ارسال نشوند.
                </p>
              </div>

              <button
                className={`notification-switch ${
                  quietHours ? "active" : ""
                }`}
                onClick={() =>
                  setQuietHours((current) => !current)
                }
                aria-label="تغییر ساعات سکوت"
              >
                <span />
              </button>
            </div>

            <div className="quiet-hours-content">
              <div>
                <label>شروع</label>

                <input
                  value={quietStart}
                  onChange={(event) =>
                    setQuietStart(event.target.value)
                  }
                />
              </div>

              <div>
                <label>پایان</label>

                <input
                  value={quietEnd}
                  onChange={(event) =>
                    setQuietEnd(event.target.value)
                  }
                />
              </div>

              <div className="quiet-hours-info">
                <span>🌙</span>

                <p>
                  اعلان‌های ضروری مثل هشدارهای مهم آزمون
                  می‌توانند در آینده از این قانون مستثنا شوند.
                </p>
              </div>
            </div>
          </section>

          <section className="panel browser-notification-panel">
            <div className="panel-header">
              <div>
                <h2>اعلان‌های دستگاه</h2>

                <p>
                  اجازه ارسال اعلان مرورگر را برای Study
                  Manager مدیریت کن.
                </p>
              </div>

              <span
                className={`permission-status ${permission}`}
              >
                {permission === "granted"
                  ? "فعال"
                  : permission === "denied"
                  ? "مسدود"
                  : "بررسی نشده"}
              </span>
            </div>

            <div className="browser-notification-content">
              <div>
                <strong>
                  اعلان مرورگر
                </strong>

                <p>
                  برای دریافت یادآوری حتی وقتی صفحه اصلی
                  باز نیست، اجازه اعلان مرورگر را فعال کن.
                </p>
              </div>

              <button onClick={requestBrowserPermission}>
                {permission === "granted"
                  ? "مجوز فعال است"
                  : "فعال‌کردن اعلان‌ها"}
              </button>
            </div>
          </section>
        </div>

        <aside className="notifications-sidebar">
          <section className="panel recent-notifications">
            <div className="panel-header">
              <div>
                <h2>اعلان‌های اخیر</h2>

                <p>
                  آخرین یادآوری‌های سیستم
                </p>
              </div>

              {unreadCount > 0 && (
                <span className="unread-count">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="recent-list">
              {recent.map((notification) => (
                <div
                  className={`recent-item ${
                    notification.read
                      ? ""
                      : "unread"
                  }`}
                  key={notification.id}
                >
                  <div className="recent-icon">
                    {notification.type === "exam"
                      ? "📝"
                      : notification.type === "goal"
                      ? "🎯"
                      : "↻"}
                  </div>

                  <div className="recent-content">
                    <div className="recent-title-row">
                      <strong>
                        {notification.title}
                      </strong>

                      {!notification.read && (
                        <span className="unread-dot" />
                      )}
                    </div>

                    <p>{notification.text}</p>

                    <small>
                      {notification.time} ·{" "}
                      {notificationTypeLabel(
                        notification.type
                      )}
                    </small>

                    <div className="recent-actions">
                      {!notification.read && (
                        <button
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                        >
                          خوانده شد
                        </button>
                      )}

                      <button
                        onClick={() =>
                          deleteNotification(
                            notification.id
                          )
                        }
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {recent.length === 0 && (
                <div className="notifications-empty">
                  <span>🔔</span>

                  <strong>
                    اعلان جدیدی وجود ندارد
                  </strong>

                  <p>
                    اعلان‌های آینده در این قسمت نمایش داده
                    می‌شوند.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="panel notification-tips">
            <div className="panel-header">
              <div>
                <h2>نکته</h2>

                <p>
                  درباره سیستم اعلان
                </p>
              </div>
            </div>

            <div className="notification-tip">
              <span>💡</span>

              <p>
                تنظیمات اعلان در نسخه فعلی در همین صفحه
                نگهداری می‌شوند. در مرحله اتصال به Supabase،
                این تنظیمات برای حساب کاربری ذخیره دائمی
                خواهند شد.
              </p>
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
      }
