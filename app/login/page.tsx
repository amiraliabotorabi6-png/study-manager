"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("لطفاً ایمیل خود را وارد کن.");
      return;
    }

    if (!password) {
      setError("لطفاً رمز عبور خود را وارد کن.");
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (signInError) {
        if (
          signInError.message
            .toLowerCase()
            .includes("email not confirmed")
        ) {
          setError(
            "ایمیل حساب هنوز تأیید نشده است. ابتدا ایمیل تأیید را باز کن."
          );
        } else {
          setError(
            "ایمیل یا رمز عبور اشتباه است."
          );
        }

        return;
      }

      if (!rememberMe) {
        sessionStorage.setItem(
          "study-manager-session",
          "temporary"
        );
      }

      window.location.href = redirectTo.startsWith("/")
        ? redirectTo
        : "/dashboard";
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
          <div className="auth-card-header">
            <span className="auth-label">
              WELCOME BACK
            </span>

            <h1>خوش برگشتی</h1>

            <p>
              برای ادامه وارد حساب کاربری خودت شو.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="auth-field">
              <label htmlFor="login-email">
                ایمیل
              </label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  @
                </span>

                <input
                  id="login-email"
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
              <label htmlFor="login-password">
                رمز عبور
              </label>

              <div className="auth-input-wrapper">
                <span className="auth-input-icon">
                  •
                </span>

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  dir="ltr"
                  autoComplete="current-password"
                  placeholder="رمز عبور خود را وارد کن"
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

            <div className="login-options">
              <label className="remember-row">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                />

                <span>
                  مرا به خاطر بسپار
                </span>
              </label>

              <Link href="/forgot-password">
                رمز عبور را فراموش کرده‌ای؟
              </Link>
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
              هنوز حساب نداری؟
            </span>

            <Link href="/register">
              ساخت حساب جدید
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
