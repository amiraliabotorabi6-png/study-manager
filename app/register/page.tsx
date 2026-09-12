"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("لطفاً نام خود را وارد کن.");
      return;
    }

    if (!email.trim()) {
      setError("لطفاً ایمیل خود را وارد کن.");
      return;
    }

    if (!password) {
      setError("لطفاً یک رمز عبور وارد کن.");
      return;
    }

    if (password.length < 8) {
      setError(
        "رمز عبور باید حداقل ۸ کاراکتر داشته باشد."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "رمز عبور و تکرار آن با یکدیگر مطابقت ندارند."
      );
      return;
    }

    if (!agree) {
      setError(
        "برای ساخت حساب باید قوانین استفاده را تأیید کنی."
      );
      return;
    }

    setLoading(true);

    // اتصال واقعی به Supabase Auth در مرحله احراز هویت اضافه می‌شود.
    setTimeout(() => {
      setLoading(false);

      setError(
        "ثبت‌نام هنوز فعال نشده است. در مرحله بعد به Supabase متصل می‌شویم."
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

            <span>
              سیستم مدیریت هوشمند مطالعه
            </span>
          </div>
        </div>

        <div className="auth-card register-card">
          <div className="auth-card-header">
            <span className="auth-label">
              CREATE ACCOUNT
            </span>

            <h1>ساخت حساب جدید</h1>

            <p>
              حساب خودت را بساز و مدیریت مطالعه را شروع
              کن.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="name">
                نام
              </label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  ◉
                </span>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="نام خود را وارد کن"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                ایمیل
              </label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="register-email"
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
              <label htmlFor="register-password">
                رمز عبور
              </label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  •
                </span>

                <input
                  id="register-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  dir="ltr"
                  autoComplete="new-password"
                  placeholder="حداقل ۸ کاراکتر"
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

            <div className="auth-field">
              <label htmlFor="confirm-password">
                تکرار رمز عبور
              </label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  •
                </span>

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  dir="ltr"
                  autoComplete="new-password"
                  placeholder="رمز عبور را دوباره وارد کن"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                  aria-label={
                    showConfirmPassword
                      ? "مخفی کردن رمز عبور"
                      : "نمایش رمز عبور"
                  }
                >
                  {showConfirmPassword ? "◉" : "○"}
                </button>
              </div>
            </div>

            <label className="remember-row register-agreement">
              <input
                type="checkbox"
                checked={agree}
                onChange={(event) =>
                  setAgree(event.target.checked)
                }
              />

              <span>
                با{" "}
                <button
                  type="button"
                  className="inline-link"
                >
                  قوانین استفاده
                </button>{" "}
                و سیاست حفظ حریم خصوصی موافقم.
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
                  در حال ساخت حساب...
                </>
              ) : (
                <>
                  ساخت حساب
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
              قبلاً حساب ساخته‌ای؟
            </span>

            <Link href="/login">
              ورود به حساب
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
