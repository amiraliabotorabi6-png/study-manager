"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function VerifyEmailPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function resendVerification() {
    setError("");
    setSent(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("لطفاً ایمیل خود را وارد کن.");
      return;
    }

    setLoading(true);

    try {
      const { error: resendError } =
        await supabase.auth.resend({
          type: "signup",
          email: cleanEmail,
        });

      if (resendError) {
        setError(
          "ارسال دوباره ایمیل تأیید انجام نشد. دوباره تلاش کن."
        );
        return;
      }

      setSent(true);
    } catch {
      setError(
        "خطایی در ارتباط با سرور رخ داد. دوباره تلاش کن."
      );
    } finally {
      setLoading(false);
    }
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
          <div className="auth-success">
            <div className="auth-success-icon">
              @
            </div>

            <span className="auth-label">
              EMAIL VERIFICATION
            </span>

            <h1>
              ایمیلت را تأیید کن
            </h1>

            <p>
              برای فعال‌سازی حساب، ایمیل تأیید ارسال‌شده
              از طرف Study Manager را باز کن و روی لینک
              تأیید بزن.
            </p>

            <div className="auth-email-preview">
              <span>
                ایمیل حساب
              </span>

              <input
                type="email"
                dir="ltr"
                placeholder="example@email.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
              />
            </div>

            {sent && (
              <div className="auth-success-message">
                ایمیل تأیید دوباره ارسال شد.
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
              className="auth-submit"
              onClick={resendVerification}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  ارسال دوباره ایمیل تأیید
                  <span>↻</span>
                </>
              )}
            </button>

            <Link
              href="/login"
              className="auth-success-link"
            >
              بازگشت به صفحه ورود
            </Link>
          </div>
        </div>

        <div className="auth-footer">
          <span>Study Manager</span>

          <span>•</span>

          <span>
            مدیریت مطالعه، ساده و دقیق
          </span>
        </div>
      </section>
    </main>
  );
}
