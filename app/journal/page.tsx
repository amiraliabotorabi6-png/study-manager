"use client";

import { useMemo, useState } from "react";

type JournalEntry = {
  id: number;
  title: string;
  content: string;
  date: string;
  mood: string;
  category: string;
  tags: string[];
};

const initialEntries: JournalEntry[] = [
  {
    id: 1,
    title: "شروع جدی هفته",
    content:
      "امروز توانستم طبق برنامه شروع کنم. زیست عملکرد خوبی داشت، اما در ریاضی تمرکز کمتری داشتم. بهتر است فردا قبل از شروع ریاضی، چند دقیقه مرور کوتاه داشته باشم.",
    date: "۱۴۰۵/۰۶/۲۱",
    mood: "خوب",
    category: "مطالعه",
    tags: ["زیست", "ریاضی", "تمرکز"],
  },
  {
    id: 2,
    title: "تحلیل یک آزمون",
    content:
      "در آزمون شیمی چند سؤال را به دلیل بی‌دقتی از دست دادم. مفاهیم اصلی را نسبتاً خوب بلد بودم، ولی هنگام حل عجله کردم.",
    date: "۱۴۰۵/۰۶/۲۰",
    mood: "متوسط",
    category: "آزمون",
    tags: ["شیمی", "بی‌دقتی", "آزمون"],
  },
  {
    id: 3,
    title: "برنامه فردا",
    content:
      "اولویت فردا مرور مباحث ضعیف و سپس حل تست زمان‌دار است. باید زمان استراحت را هم در برنامه لحاظ کنم.",
    date: "۱۴۰۵/۰۶/۱۹",
    mood: "خوب",
    category: "برنامه‌ریزی",
    tags: ["برنامه", "مرور", "تست"],
  },
];

const categories = [
  "همه",
  "مطالعه",
  "آزمون",
  "برنامه‌ریزی",
  "روزانه",
  "ایده",
];

export default function JournalPage() {
  const [entries, setEntries] =
    useState<JournalEntry[]>(initialEntries);

  const [selectedId, setSelectedId] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("همه");

  const [isWriting, setIsWriting] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] =
    useState("مطالعه");
  const [newMood, setNewMood] = useState("خوب");

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesCategory =
        category === "همه" ||
        entry.category === category;

      const matchesSearch =
        !query ||
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );

      return matchesCategory && matchesSearch;
    });
  }, [entries, search, category]);

  const selectedEntry =
    entries.find((entry) => entry.id === selectedId) ??
    filteredEntries[0];

  function createEntry() {
    if (!newTitle.trim() && !newContent.trim()) {
      return;
    }

    const id =
      entries.length > 0
        ? Math.max(...entries.map((entry) => entry.id)) +
          1
        : 1;

    const newEntry: JournalEntry = {
      id,
      title: newTitle.trim() || "یادداشت جدید",
      content:
        newContent.trim() || "بدون متن",
      date: "۱۴۰۵/۰۶/۲۱",
      mood: newMood,
      category: newCategory,
      tags: [],
    };

    setEntries((current) => [
      newEntry,
      ...current,
    ]);

    setSelectedId(id);
    setNewTitle("");
    setNewContent("");
    setNewCategory("مطالعه");
    setNewMood("خوب");
    setIsWriting(false);
  }

  function deleteEntry(id: number) {
    const remaining = entries.filter(
      (entry) => entry.id !== id
    );

    setEntries(remaining);

    if (selectedId === id) {
      setSelectedId(
        remaining.length > 0 ? remaining[0].id : 0
      );
    }
  }

  return (
    <main className="journal-page">
      <header className="journal-header">
        <div>
          <span className="dashboard-label">
            JOURNAL
          </span>

          <h1>دفترچه روزانه</h1>

          <p>
            ثبت تجربه‌ها، افکار و تحلیل روند مطالعه
          </p>
        </div>

        <button
          className="journal-new-button"
          onClick={() => setIsWriting(true)}
        >
          + یادداشت جدید
        </button>
      </header>

      {isWriting && (
        <section className="panel journal-editor">
          <div className="panel-header">
            <div>
              <h2>یادداشت جدید</h2>

              <p>
                اتفاقات و نکات مهم امروز را ثبت کن.
              </p>
            </div>

            <button
              className="journal-close"
              onClick={() => setIsWriting(false)}
            >
              بستن
            </button>
          </div>

          <div className="journal-form">
            <input
              value={newTitle}
              onChange={(event) =>
                setNewTitle(event.target.value)
              }
              placeholder="عنوان یادداشت"
            />

            <div className="journal-form-row">
              <select
                value={newCategory}
                onChange={(event) =>
                  setNewCategory(event.target.value)
                }
              >
                <option value="مطالعه">
                  مطالعه
                </option>
                <option value="آزمون">
                  آزمون
                </option>
                <option value="برنامه‌ریزی">
                  برنامه‌ریزی
                </option>
                <option value="روزانه">
                  روزانه
                </option>
                <option value="ایده">ایده</option>
              </select>

              <select
                value={newMood}
                onChange={(event) =>
                  setNewMood(event.target.value)
                }
              >
                <option value="عالی">عالی</option>
                <option value="خوب">خوب</option>
                <option value="متوسط">
                  متوسط
                </option>
                <option value="ضعیف">ضعیف</option>
              </select>
            </div>

            <textarea
              rows={7}
              value={newContent}
              onChange={(event) =>
                setNewContent(event.target.value)
              }
              placeholder="یادداشت خودت را اینجا بنویس..."
            />

            <div className="journal-editor-actions">
              <button onClick={createEntry}>
                ذخیره یادداشت
              </button>

              <button
                className="secondary"
                onClick={() =>
                  setIsWriting(false)
                }
              >
                انصراف
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="journal-layout">
        <aside className="panel journal-sidebar">
          <div className="journal-search">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="جست‌وجوی یادداشت..."
            />
          </div>

          <div className="journal-categories">
            <span>دسته‌بندی</span>

            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item ? "active" : ""
                }
                onClick={() => setCategory(item)}
              >
                {item}

                {item !== "همه" && (
                  <small>
                    {
                      entries.filter(
                        (entry) =>
                          entry.category === item
                      ).length
                    }
                  </small>
                )}
              </button>
            ))}
          </div>

          <div className="journal-list">
            <div className="journal-list-title">
              یادداشت‌ها
              <span>{filteredEntries.length}</span>
            </div>

            {filteredEntries.map((entry) => (
              <button
                key={entry.id}
                className={`journal-list-item ${
                  selectedEntry?.id === entry.id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedId(entry.id)
                }
              >
                <div>
                  <strong>{entry.title}</strong>

                  <span>{entry.category}</span>
                </div>

                <small>{entry.date}</small>
              </button>
            ))}

            {filteredEntries.length === 0 && (
              <div className="journal-empty">
                یادداشتی پیدا نشد.
              </div>
            )}
          </div>
        </aside>

        <section className="journal-content">
          {selectedEntry ? (
            <>
              <article className="panel journal-detail">
                <div className="journal-detail-header">
                  <div>
                    <span className="journal-category">
                      {selectedEntry.category}
                    </span>

                    <h2>{selectedEntry.title}</h2>

                    <div className="journal-meta">
                      <span>
                        📅 {selectedEntry.date}
                      </span>

                      <span>
                        وضعیت: {selectedEntry.mood}
                      </span>
                    </div>
                  </div>

                  <button
                    className="journal-delete"
                    onClick={() =>
                      deleteEntry(selectedEntry.id)
                    }
                  >
                    حذف
                  </button>
                </div>

                <div className="journal-text">
                  {selectedEntry.content}
                </div>

                {selectedEntry.tags.length > 0 && (
                  <div className="journal-tags">
                    {selectedEntry.tags.map(
                      (tag) => (
                        <span key={tag}>
                          #{tag}
                        </span>
                      )
                    )}
                  </div>
                )}
              </article>

              <section className="panel journal-analysis">
                <div className="panel-header">
                  <div>
                    <h2>تحلیل هوشمند</h2>

                    <p>
                      تحلیل خودکار یادداشت‌ها پس از
                      اتصال سیستم هوش مصنوعی فعال
                      می‌شود.
                    </p>
                  </div>

                  <span className="analysis-badge">
                    AI
                  </span>
                </div>

                <div className="analysis-placeholder">
                  <div className="analysis-icon">
                    ✦
                  </div>

                  <div>
                    <strong>
                      تحلیل هنوز فعال نشده است
                    </strong>

                    <p>
                      در نسخه متصل به دیتابیس، این بخش
                      می‌تواند موضوعات پرتکرار، الگوهای
                      یادداشت‌ها و ارتباط آن‌ها با داده‌های
                      مطالعه و آزمون را برایت نمایش دهد.
                    </p>
                  </div>
                </div>
              </section>

              <section className="journal-insights">
                <div className="panel insight-card">
                  <span>تعداد یادداشت‌ها</span>

                  <strong>{entries.length}</strong>

                  <small>
                    یادداشت ثبت‌شده
                  </small>
                </div>

                <div className="panel insight-card">
                  <span>دسته فعلی</span>

                  <strong>
                    {selectedEntry.category}
                  </strong>

                  <small>
                    دسته‌بندی یادداشت
                  </small>
                </div>

                <div className="panel insight-card">
                  <span>وضعیت</span>

                  <strong>
                    {selectedEntry.mood}
                  </strong>

                  <small>
                    وضعیت ثبت‌شده
                  </small>
                </div>
              </section>
            </>
          ) : (
            <div className="panel journal-no-selection">
              <span>📝</span>

              <h2>هنوز یادداشتی وجود ندارد</h2>

              <p>
                اولین یادداشتت را ثبت کن تا اینجا نمایش
                داده شود.
              </p>

              <button
                onClick={() => setIsWriting(true)}
              >
                + ثبت اولین یادداشت
              </button>
            </div>
          )}
        </section>
      </section>
    </main>
  );
          }
