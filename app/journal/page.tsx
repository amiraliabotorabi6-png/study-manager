"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BookOpen,
  CalendarDays,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type JournalEntry = {
  id: string;
  title: string | null;
  content: string | null;
  mood: string | null;
  entry_date: string;
  created_at: string;
};

const moods = [
  "عالی",
  "خوب",
  "معمولی",
  "خسته",
  "بی‌حوصله",
  "پراسترس",
];

export default function JournalPage() {
  const supabase = createClient();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("خوب");
  const [entryDate, setEntryDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  async function loadEntries() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("journal_entries")
      .select(
        "id, title, content, mood, entry_date, created_at"
      )
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEntries(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function addEntry(event: FormEvent) {
    event.preventDefault();

    if (!content.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("journal_entries")
      .insert({
        user_id: user.id,
        title: title.trim() || null,
        content: content.trim(),
        mood,
        entry_date: entryDate,
      });

    if (error) {
      alert("ذخیره یادداشت انجام نشد.");
      return;
    }

    setTitle("");
    setContent("");
    setMood("خوب");
    setEntryDate(new Date().toISOString().split("T")[0]);
    setShowForm(false);

    await loadEntries();
  }

  async function deleteEntry(id: string) {
    const confirmed = window.confirm(
      "این یادداشت حذف شود؟"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("journal_entries")
      .delete()
      .eq("id", id);

    if (!error) {
      setEntries((current) =>
        current.filter((entry) => entry.id !== id)
      );
    }
  }

  const filteredEntries = entries.filter((entry) => {
    const text = `${entry.title ?? ""} ${
      entry.content ?? ""
    } ${entry.mood ?? ""}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="eyebrow">ژورنال شخصی</div>
          <h1>دفتر یادداشت</h1>
          <p>
            اتفاقات، افکار و تجربه‌های روزانه‌ات را ثبت کن.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          یادداشت جدید
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={20} />
          </div>
          <div>
            <span>کل یادداشت‌ها</span>
            <strong>{entries.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <CalendarDays size={20} />
          </div>
          <div>
            <span>آخرین یادداشت</span>
            <strong>
              {entries.length
                ? new Date(
                    entries[0].entry_date
                  ).toLocaleDateString("fa-IR")
                : "—"}
            </strong>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>یادداشت‌ها</h2>
            <p>جست‌وجو در نوشته‌های قبلی</p>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جست‌وجو..."
            />
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            در حال بارگذاری...
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={34} />
            <h3>
              {search
                ? "یادداشتی پیدا نشد"
                : "هنوز یادداشتی ثبت نکرده‌ای"}
            </h3>
            <p>
              اولین یادداشتت را ثبت کن تا تاریخچه‌ات از اینجا
              شکل بگیرد.
            </p>

            {!search && (
              <button
                className="primary-button"
                onClick={() => setShowForm(true)}
              >
                <Plus size={18} />
                ثبت اولین یادداشت
              </button>
            )}
          </div>
        ) : (
          <div className="journal-list">
            {filteredEntries.map((entry) => (
              <article
                className="journal-card"
                key={entry.id}
              >
                <div className="journal-card-top">
                  <div>
                    <div className="journal-date">
                      <CalendarDays size={15} />
                      {new Date(
                        entry.entry_date
                      ).toLocaleDateString("fa-IR")}
                    </div>

                    <h3>
                      {entry.title || "بدون عنوان"}
                    </h3>
                  </div>

                  <div className="journal-actions">
                    {entry.mood && (
                      <span className="badge">
                        {entry.mood}
                      </span>
                    )}

                    <button
                      className="icon-button danger"
                      onClick={() =>
                        deleteEntry(entry.id)
                      }
                      aria-label="حذف یادداشت"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <p className="journal-content">
                  {entry.content}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <div>
                <div className="eyebrow">ثبت جدید</div>
                <h2>یادداشت روزانه</h2>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowForm(false)}
                aria-label="بستن"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addEntry}>
              <div className="form-group">
                <label>عنوان</label>
                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  placeholder="مثلاً: گزارش مطالعه امروز"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>تاریخ</label>
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) =>
                      setEntryDate(e.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>حال و هوا</label>
                  <select
                    value={mood}
                    onChange={(e) =>
                      setMood(e.target.value)
                    }
                  >
                    {moods.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>متن یادداشت</label>
                <textarea
                  value={content}
                  onChange={(e) =>
                    setContent(e.target.value)
                  }
                  placeholder="امروز چه اتفاقی افتاد؟ چه چیزهایی یاد گرفتی؟ چه چیزی ذهنت را درگیر کرد؟"
                  rows={8}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <BookOpen size={18} />
                  ذخیره یادداشت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
