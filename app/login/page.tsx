"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("لطفاً ایمیل و رمز عبور را وارد کن.");
      return;
    }

    setLoading(true);

    // اتصال واقعی به Supabase در مرحله احراز هویت اضافه می‌شود.
    setTimeout(() => {
      setLoading(false);
      setError(
        "احراز هویت هنوز فعال نشده است. در مرحله بعد به Supabase متصل می‌شویم."
      );
    }, 700);
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
            <span>سیستم مدیریت هوشمند مطالعه</span>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <span className="auth-label">
              WELCOME BACK
            </span>

            <h1>خوش برگشتی 👋</h1>

            <p>
              برای ادامه، وارد حساب کاربری خودت شو.
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

            <div className="auth-field">
              <div className="auth-label-row">
                <label htmlFor="password">
                  رمز عبور
                </label>

                <Link href="/forgot-password">
                  فراموشی رمز عبور؟
                </Link>
              </div>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  •
                </span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  dir="ltr"
                  autoComplete="current-password"
                  placeholder="رمز عبور"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showPassword
                      ? "مخفی کردن رمز عبور"
                      : "نمایش رمز عبور"
                  }
                >
                  {showPassword ? "◉" : "○"}
                </button>
              </div>
            </div>

            <label className="remember-row">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) =>
                  setRemember(event.target.checked)
                }
              />

              <span>
                مرا به خاطر بسپار
              </span>
            </label>

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
                  در حال ورود...
                </>
              ) : (
                <>
                  ورود به حساب
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
              هنوز حساب کاربری نداری؟
            </span>

            <Link href="/register">
              ساخت حساب جدید
            </Link>
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
