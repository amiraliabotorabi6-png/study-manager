"use client";

import { useState } from "react";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("example@email.com");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  function resendEmail() {
    setLoading(true);
    setMessage("");

    // اتصال واقعی به Supabase Auth در مرحله احراز هویت اضافه می‌شود.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setMessage(
        "لینک تأیید ایمیل دوباره ارسال شد."
      );
    }, 800);
  }

  return (
    <main className="auth-page">
      <div className="auth-background">
        <div className="auth-glow auth-glow-one" />
        <div className="auth-glow auth-glow-two" />
      </div>

      <section className="auth-container">
        <div className="auth-brand">
          <div className="auth-logo">S</div>

          <div>
            <strong>Study Manager</strong>

            <span>
              سیستم مدیریت هوشمند مطالعه
            </span>
          </div>
        </div>

        <div className="auth-card">
          <div className="verify-content">
            <div className="verify-icon">
              ✉
            </div>

            <span className="auth-label">
              VERIFY EMAIL
            </span>

            <h1>
              ایمیلت را تأیید کن
            </h1>

            <p>
              برای فعال شدن حساب کاربری، لینک تأیید را
              از طریق ایمیل باز کن.
            </p>

            <div className="auth-email-preview">
              <span>
                ایمیل ثبت‌شده
              </span>

              <strong dir="ltr">
                {email}
              </strong>
            </div>

            <div className="verify-checklist">
              <div>
                <span>✓</span>
                <p>
                  صندوق ورودی ایمیل را بررسی کن.
                </p>
              </div>

              <div>
                <span>✓</span>
                <p>
                  اگر ایمیل را نمی‌بینی، پوشه Spam را
                  بررسی کن.
                </p>
              </div>

              <div>
                <span>✓</span>
                <p>
                  روی لینک تأیید داخل ایمیل کلیک کن.
                </p>
              </div>
            </div>

            {message && (
              <div className="auth-success-message">
                <span>✓</span>
                <p>{message}</p>
              </div>
            )}

            <button
              className="auth-submit"
              onClick={resendEmail}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  در حال ارسال...
                </>
              ) : sent ? (
                <>
                  ارسال دوباره ایمیل
                  <span>↻</span>
                </>
              ) : (
                <>
                  ارسال مجدد لینک تأیید
                  <span>↻</span>
                </>
              )}
            </button>

            <div className="verify-actions">
              <Link href="/login">
                بازگشت به ورود
              </Link>

              <span>•</span>

              <button
                type="button"
                onClick={() => {
                  setEmail("");
                  setMessage("");
                }}
              >
                استفاده از ایمیل دیگر
              </button>
            </div>
          </div>
        </div>

        <div className="auth-footer">
          <span>
            Study Manager
          </span>

          <span>•</span>

          <span>
            مدیریت مطالعه، ساده و دقیق
          </span>
        </div>
      </section>
    </main>
  );
}
