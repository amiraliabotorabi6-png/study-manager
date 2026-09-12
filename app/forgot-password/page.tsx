"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("لطفاً ایمیل خود را وارد کن.");
      return;
    }

    setLoading(true);

    // اتصال واقعی به Supabase Auth در مرحله احراز هویت اضافه می‌شود.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
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
          {!sent ? (
            <>
              <div className="auth-card-header">
                <span className="auth-label">
                  RESET PASSWORD
                </span>

                <h1>بازیابی رمز عبور</h1>

                <p>
                  ایمیل حساب کاربری خود را وارد کن تا
                  لینک بازیابی رمز عبور برایت ارسال شود.
                </p>
              </div>

              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >
                <div className="auth-field">
                  <label htmlFor="email">
                    ایمیل
                  </label>

                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">
                      @
                    </span>

                    <input
                      id="email"
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

              <div className="auth-back">
                <Link href="/login">
                  <span>→</span>
                  بازگشت به صفحه ورود
                </Link>
              </div>
            </>
          ) : (
            <div className="auth-success">
              <div className="auth-success-icon">
                ✓
              </div>

              <span className="auth-label">
                EMAIL SENT
              </span>

              <h1>
                ایمیل ارسال شد
              </h1>

              <p>
                اگر حسابی با این ایمیل وجود داشته باشد،
                لینک بازیابی رمز عبور برای آن ارسال
                خواهد شد.
              </p>

              <div className="auth-email-preview">
                <span>ایمیل مقصد</span>

                <strong dir="ltr">
                  {email}
                </strong>
              </div>

              <button
                className="auth-resend"
                onClick={() => {
                  setSent(false);
                  setError("");
                }}
              >
                ارسال دوباره
              </button>

              <Link
                href="/login"
                className="auth-success-link"
              >
                بازگشت به صفحه ورود
              </Link>
            </div>
          )}
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
