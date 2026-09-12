"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSent(false);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("لطفاً ایمیل خود را وارد کن.");
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          cleanEmail,
          {
            redirectTo:
              `${window.location.origin}/api/auth/callback?next=/settings`,
          }
        );

      if (resetError) {
        setError(
          "ارسال ایمیل بازیابی انجام نشد. دوباره تلاش کن."
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

  if (sent) {
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
                ✓
              </div>

              <span className="auth-label">
                EMAIL SENT
              </span>

              <h1>
                ایمیل بازیابی ارسال شد
              </h1>

              <p>
                اگر این ایمیل در Study Manager ثبت
                شده باشد، لینک تغییر رمز برایت
                ارسال شده است.
              </p>

              <div className="auth-email-preview">
                <span>
                  ایمیل
                </span>

                <strong dir="ltr">
                  {email}
                </strong>
              </div>

              <button
                type="button"
                className="auth-submit"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
              >
                ارسال دوباره
                <span>↻</span>
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
          <div className="auth-card-header">
            <span className="auth-label">
              PASSWORD RECOVERY
            </span>

            <h1>
              بازیابی رمز عبور
            </h1>

            <p>
              ایمیل حساب خودت را وارد کن تا لینک
              بازیابی برایت ارسال شود.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="forgot-email">
                ایمیل
              </label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="forgot-email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                />
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <span>!</span>

                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="auth-spinner" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  ارسال لینک بازیابی
                  <span>←</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>یا</span>
          </div>

          <div className="auth-register">
            <span>
              رمز عبورت را به یاد آوردی؟
            </span>

            <Link href="/login">
              بازگشت به ورود
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
