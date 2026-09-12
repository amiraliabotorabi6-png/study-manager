"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  Check,
  Clock3,
  GraduationCap,
  Target,
  ListTodo,
  FileText,
  Settings2,
} from "lucide-react";

type Notification = {
  id: string;
  title: string;
  message: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
};

type NotificationSettings = {
  study_start: boolean;
  study_end: boolean;
  breaks: boolean;
  exams: boolean;
  overdue_tasks: boolean;
  reports: boolean;
  goals: boolean;
  reviews: boolean;
  falling_behind: boolean;
};

const defaultSettings: NotificationSettings = {
  study_start: true,
  study_end: true,
  breaks: true,
  exams: true,
  overdue_tasks: true,
  reports: true,
  goals: true,
  reviews: true,
  falling_behind: true,
};

const notificationOptions = [
  {
    key: "study_start",
    title: "شروع مطالعه",
    description: "یادآوری زمان شروع جلسه مطالعه",
    icon: Clock3,
  },
  {
    key: "study_end",
    title: "پایان مطالعه",
    description: "اعلان پایان زمان تعیین‌شده مطالعه",
    icon: Clock3,
  },
  {
    key: "breaks",
    title: "استراحت",
    description: "یادآوری زمان استراحت بین جلسات",
    icon: Bell,
  },
  {
    key: "exams",
    title: "امتحان‌ها",
    description: "یادآوری نزدیک شدن امتحان‌ها",
    icon: GraduationCap,
  },
  {
    key: "overdue_tasks",
    title: "کارهای عقب‌افتاده",
    description: "اعلان کارهایی که از موعدشان گذشته‌اند",
    icon: ListTodo,
  },
  {
    key: "reports",
    title: "گزارش‌ها",
    description: "اعلان آماده شدن گزارش‌های دوره‌ای",
    icon: FileText,
  },
  {
    key: "goals",
    title: "اهداف",
    description: "اعلان رسیدن یا نزدیک شدن به اهداف",
    icon: Target,
  },
  {
    key: "reviews",
    title: "مرور",
    description: "یادآوری زمان‌های مرور",
    icon: Bell,
  },
  {
    key: "falling_behind",
    title: "عقب ماندن از برنامه",
    description: "هشدار در صورت عقب افتادن از برنامه",
    icon: Bell,
  },
] as const;

export default function NotificationsPage() {
  const supabase = createClient();

  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [settings, setSettings] =
    useState<NotificationSettings>(
      defaultSettings
    );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadData() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const [notificationsResult, settingsResult] =
      await Promise.all([
        supabase
          .from("notifications")
          .select(
            "id, title, message, type, is_read, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(50),

        supabase
          .from("notification_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

    if (
      !notificationsResult.error &&
      notificationsResult.data
    ) {
      setNotifications(notificationsResult.data);
    }

    if (
      !settingsResult.error &&
      settingsResult.data
    ) {
      setSettings({
        study_start:
          settingsResult.data.study_start ??
          true,
        study_end:
          settingsResult.data.study_end ??
          true,
        breaks:
          settingsResult.data.breaks ??
          true,
        exams:
          settingsResult.data.exams ??
          true,
        overdue_tasks:
          settingsResult.data.overdue_tasks ??
          true,
        reports:
          settingsResult.data.reports ??
          true,
        goals:
          settingsResult.data.goals ??
          true,
        reviews:
          settingsResult.data.reviews ??
          true,
        falling_behind:
          settingsResult.data.falling_behind ??
          true,
      });
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function markAsRead(id: string) {
    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", id);

    if (!error) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, is_read: true }
            : item
        )
      );
    }
  }

  async function markAllAsRead() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (!error) {
      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          is_read: true,
        }))
      );
    }
  }

  async function toggleSetting(
    key: keyof NotificationSettings
  ) {
    const nextValue = !settings[key];

    const nextSettings = {
      ...settings,
      [key]: nextValue,
    };

    setSettings(nextSettings);
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("notification_settings")
      .upsert(
        {
          user_id: user.id,
          ...nextSettings,
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      setSettings(settings);
      alert(
        "ذخیره تنظیمات اعلان‌ها انجام نشد."
      );
    }

    setSaving(false);
  }

  const unreadCount = notifications.filter(
    (item) => !item.is_read
  ).length;

  function notificationIcon(type: string) {
    if (type.includes("exam")) {
      return <GraduationCap size={18} />;
    }

    if (type.includes("task")) {
      return <ListTodo size={18} />;
    }

    if (type.includes("goal")) {
      return <Target size={18} />;
    }

    if (type.includes("study")) {
      return <Clock3 size={18} />;
    }

    return <Bell size={18} />;
  }

  function formatDate(value: string) {
    return new Date(value).toLocaleString(
      "fa-IR",
      {
        dateStyle: "short",
        timeStyle: "short",
      }
    );
  }

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            اعلان‌ها
          </div>

          <h1>مرکز اعلان‌ها</h1>

          <p>
            اعلان‌های مهم و تنظیمات یادآوری را مدیریت کن.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="secondary-button"
            onClick={markAllAsRead}
          >
            <Check size={18} />
            خواندن همه
          </button>
        )}
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Bell size={20} />
          </div>

          <div>
            <span>اعلان‌های جدید</span>
            <strong>{unreadCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Settings2 size={20} />
          </div>

          <div>
            <span>وضعیت اعلان‌ها</span>
            <strong>
              {
                Object.values(settings).filter(
                  Boolean
                ).length
              } فعال
            </strong>
          </div>
        </div>
      </section>

      <div className="two-column-layout">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>اعلان‌های اخیر</h2>
              <p>
                {unreadCount
                  ? `${unreadCount} اعلان خوانده‌نشده`
                  : "همه اعلان‌ها خوانده شده‌اند"}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              در حال بارگذاری...
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-state">
              <Bell size={34} />
              <h3>اعلانی وجود ندارد</h3>
              <p>
                وقتی رویداد مهمی اتفاق بیفتد، اعلان آن
                اینجا نمایش داده می‌شود.
              </p>
            </div>
          ) : (
            <div className="notification-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${
                    notification.is_read
                      ? "read"
                      : "unread"
                  }`}
                  onClick={() =>
                    !notification.is_read &&
                    markAsRead(notification.id)
                  }
                >
                  <div className="notification-icon">
                    {notificationIcon(
                      notification.type
                    )}
                  </div>

                  <div className="notification-body">
                    <div className="notification-title-row">
                      <h3>{notification.title}</h3>

                      {!notification.is_read && (
                        <span className="notification-dot" />
                      )}
                    </div>

                    {notification.message && (
                      <p>
                        {notification.message}
                      </p>
                    )}

                    <span className="notification-time">
                      {formatDate(
                        notification.created_at
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>تنظیمات اعلان</h2>
              <p>
                مشخص کن چه مواردی به تو یادآوری شوند.
              </p>
            </div>
          </div>

          <div className="settings-list">
            {notificationOptions.map(
              ({
                key,
                title,
                description,
                icon: Icon,
              }) => (
                <div
                  className="setting-row"
                  key={key}
                >
                  <div className="setting-info">
                    <div className="setting-icon">
                      <Icon size={18} />
                    </div>

                    <div>
                      <strong>{title}</strong>
                      <span>{description}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`switch ${
                      settings[key]
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      toggleSetting(key)
                    }
                    disabled={saving}
                    aria-label={title}
                  >
                    <span />
                  </button>
                </div>
              )
            )}
          </div>

          <div className="info-box">
            <Bell size={18} />

            <p>
              اعلان‌های درون برنامه‌ای از این تنظیمات
              پیروی می‌کنند. اعلان مرورگر نیز بعداً از
              همین بخش قابل مدیریت خواهد بود.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
