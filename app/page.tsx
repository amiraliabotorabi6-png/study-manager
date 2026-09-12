"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Clock3,
    title: "تایمر حرفه‌ای",
    text: "ثبت دقیق جلسات مطالعه، زمان خالص، استراحت و عملکرد.",
  },
  {
    icon: CalendarDays,
    title: "برنامه‌ریزی",
    text: "برنامه روزانه و هفتگی را مدیریت و اجرا کن.",
  },
  {
    icon: BarChart3,
    title: "تحلیل عملکرد",
    text: "روند مطالعه، آزمون‌ها و نقاط قوت و ضعف را بررسی کن.",
  },
  {
    icon: Target,
    title: "اهداف",
    text: "برای ساعت مطالعه، درس‌ها و آزمون‌ها هدف تعیین کن.",
  },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <Link href="/" className="brand">
          <div className="brand-mark">
            <BookOpen size={22} />
          </div>

          <span>Study Manager</span>
        </Link>

        <div className="landing-nav-actions">
          <Link
            href="/login"
            className="secondary-button"
          >
            ورود
          </Link>

          <Link
            href="/register"
            className="primary-button"
          >
            ثبت‌نام
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="eyebrow">
            مدیریت هوشمند مطالعه
          </div>

          <h1>
            مطالعه‌ات را
            <br />
            <span>دقیق‌تر مدیریت کن.</span>
          </h1>

          <p>
            یک فضای یکپارچه برای برنامه‌ریزی، ثبت مطالعه،
            مدیریت آزمون‌ها و تحلیل پیشرفت تحصیلی.
          </p>

          <div className="hero-actions">
            <Link
              href="/register"
              className="primary-button large"
            >
              شروع کار
              <ArrowLeft size={19} />
            </Link>

            <Link
              href="/login"
              className="secondary-button large"
            >
              ورود به حساب
            </Link>
          </div>

          <div className="hero-trust">
            <span>
              <CheckCircle2 size={16} />
              ثبت و ذخیره اطلاعات
            </span>

            <span>
              <CheckCircle2 size={16} />
              تحلیل روند مطالعه
            </span>

            <span>
              <CheckCircle2 size={16} />
              طراحی واکنش‌گرا
            </span>
          </div>
        </div>

        <div className="hero-dashboard-preview">
          <div className="preview-window">
            <div className="preview-topbar">
              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>

              <div className="preview-title">
                داشبورد مطالعه
              </div>
            </div>

            <div className="preview-content">
              <div className="preview-welcome">
                <div>
                  <small>شنبه، ۲۱ شهریور</small>
                  <h3>خوش آمدی 👋</h3>
                </div>

                <div className="preview-avatar">
                  <GraduationCap size={20} />
                </div>
              </div>

              <div className="preview-stats">
                <div>
                  <Clock3 size={17} />
                  <small>مطالعه امروز</small>
                  <strong>۴:۳۵</strong>
                </div>

                <div>
                  <Target size={17} />
                  <small>هدف روزانه</small>
                  <strong>۶:۰۰</strong>
                </div>

                <div>
                  <BarChart3 size={17} />
                  <small>جلسات</small>
                  <strong>۵</strong>
                </div>
              </div>

              <div className="preview-chart">
                <div className="preview-chart-header">
                  <strong>
                    روند مطالعه
                  </strong>

                  <span>
                    این هفته
                  </span>
                </div>

                <div className="fake-chart">
                  <span style={{ height: "38%" }} />
                  <span style={{ height: "58%" }} />
                  <span style={{ height: "46%" }} />
                  <span style={{ height: "76%" }} />
                  <span style={{ height: "64%" }} />
                  <span style={{ height: "88%" }} />
                  <span style={{ height: "72%" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <div className="eyebrow">
            همه‌چیز در یکجا
          </div>

          <h2>
            ابزارهای لازم برای مدیریت مطالعه
          </h2>

          <p>
            از ثبت ساده زمان مطالعه تا تحلیل عملکرد و
            برنامه‌ریزی آینده.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                className="feature-card"
                key={feature.title}
              >
                <div className="feature-icon">
                  <Icon size={21} />
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <div className="eyebrow">
            آماده‌ای؟
          </div>

          <h2>
            از امروز مطالعه‌ات را
            <br />
            حرفه‌ای‌تر مدیریت کن.
          </h2>
        </div>

        <Link
          href="/register"
          className="primary-button large"
        >
          ساخت حساب
          <ArrowLeft size={19} />
        </Link>
      </section>

      <footer className="landing-footer">
        <div className="brand">
          <div className="brand-mark">
            <BookOpen size={18} />
          </div>

          <span>Study Manager</span>
        </div>

        <span>
          مدیریت شخصی مطالعه
        </span>
      </footer>
    </main>
  );
}
