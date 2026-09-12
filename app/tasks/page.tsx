"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Check,
  Clock3,
  ListTodo,
  Plus,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string | null;
  status: string | null;
  completed_at: string | null;
};

const priorities = [
  { value: "low", label: "کم" },
  { value: "medium", label: "متوسط" },
  { value: "high", label: "زیاد" },
  { value: "urgent", label: "خیلی مهم" },
];

export default function TasksPage() {
  const supabase = createClient();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");

  async function loadTasks() {
    setLoading(true);

    const { data, error } = await supabase
      .from("tasks")
      .select(
        "id,title,description,due_date,priority,status,completed_at"
      )
      .order("due_date", {
        ascending: true,
        nullsFirst: false,
      });

    if (!error && data) {
      setTasks(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  function resetForm() {
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("medium");
  }

  async function addTask() {
    if (!title.trim() || adding) return;

    setAdding(true);

    const { error } = await supabase.from("tasks").insert({
      title: title.trim(),
      description: description.trim() || null,
      due_date: dueDate || null,
      priority,
      status: "pending",
    });

    if (!error) {
      resetForm();
      setShowAdd(false);
      await loadTasks();
    } else {
      console.error(error);
      alert("ثبت وظیفه با خطا مواجه شد.");
    }

    setAdding(false);
  }

  async function toggleTask(task: Task) {
    const completed = task.status === "completed";

    const { error } = await supabase
      .from("tasks")
      .update({
        status: completed ? "pending" : "completed",
        completed_at: completed
          ? null
          : new Date().toISOString(),
      })
      .eq("id", task.id);

    if (!error) {
      await loadTasks();
    }
  }

  async function deleteTask(id: string) {
    const task = tasks.find((item) => item.id === id);

    if (!task) return;

    const confirmed = window.confirm(
      `وظیفه «${task.title}» حذف شود؟`
    );

    if (!confirmed) return;

    await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    await loadTasks();
  }

  function getPriorityLabel(value: string | null) {
    return (
      priorities.find(
        (item) => item.value === value
      )?.label || "متوسط"
    );
  }

  function getPriorityClass(value: string | null) {
    if (value === "urgent") return "task-priority-urgent";
    if (value === "high") return "task-priority-high";
    if (value === "low") return "task-priority-low";
    return "task-priority-medium";
  }

  function isOverdue(task: Task) {
    if (!task.due_date) return false;
    if (task.status === "completed") return false;

    const today = new Date();
    const due = new Date(task.due_date);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due.getTime() < today.getTime();
  }

  function formatDate(date: string | null) {
    if (!date) return "بدون موعد";

    return new Date(date).toLocaleDateString("fa-IR");
  }

  const completedCount = useMemo(
    () =>
      tasks.filter(
        (task) => task.status === "completed"
      ).length,
    [tasks]
  );

  const pendingCount = useMemo(
    () =>
      tasks.filter(
        (task) => task.status !== "completed"
      ).length,
    [tasks]
  );

  const overdueCount = useMemo(
    () => tasks.filter(isOverdue).length,
    [tasks]
  );

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <div className="page-kicker">
            مدیریت کارها
          </div>

          <h1>وظایف</h1>

          <p className="page-subtitle">
            کارهای درسی و شخصی را ثبت، اولویت‌بندی و پیگیری
            کن.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={18} />
          افزودن وظیفه
        </button>
      </div>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <ListTodo size={21} />
          </div>

          <div>
            <span>کل وظایف</span>
            <strong>{tasks.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>در انتظار انجام</span>
            <strong>{pendingCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Check size={21} />
          </div>

          <div>
            <span>انجام‌شده</span>
            <strong>{completedCount}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <AlertCircle size={21} />
          </div>

          <div>
            <span>عقب‌افتاده</span>
            <strong>{overdueCount}</strong>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="empty-card">
          <p>در حال دریافت وظایف...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-card">
          <ListTodo size={42} />

          <h2>هنوز وظیفه‌ای ثبت نشده</h2>

          <p>
            اولین کار خودت را اضافه کن تا بتوانی روند
            انجام آن را پیگیری کنی.
          </p>

          <button
            className="primary-button"
            onClick={() => setShowAdd(true)}
          >
            <Plus size={18} />
            افزودن اولین وظیفه
          </button>
        </div>
      ) : (
        <section className="task-list">
          {tasks.map((task) => {
            const completed =
              task.status === "completed";

            const overdue = isOverdue(task);

            return (
              <article
                className={`task-card ${
                  completed ? "task-completed" : ""
                } ${overdue ? "task-overdue" : ""}`}
                key={task.id}
              >
                <button
                  className={`task-check ${
                    completed ? "checked" : ""
                  }`}
                  onClick={() => toggleTask(task)}
                  title={
                    completed
                      ? "بازگرداندن"
                      : "انجام شد"
                  }
                >
                  {completed && <Check size={17} />}
                </button>

                <div className="task-content">
                  <div className="task-title-row">
                    <h2>{task.title}</h2>

                    <span
                      className={`task-priority ${getPriorityClass(
                        task.priority
                      )}`}
                    >
                      {getPriorityLabel(
                        task.priority
                      )}
                    </span>
                  </div>

                  {task.description && (
                    <p>{task.description}</p>
                  )}

                  <div className="task-meta">
                    <span>
                      <Clock3 size={14} />
                      {formatDate(task.due_date)}
                    </span>

                    {overdue && (
                      <span className="overdue-label">
                        عقب‌افتاده
                      </span>
                    )}

                    {completed && (
                      <span className="completed-label">
                        انجام‌شده
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="icon-button danger"
                  title="حذف وظیفه"
                  onClick={() =>
                    deleteTask(task.id)
                  }
                >
                  <Trash2 size={17} />
                </button>
              </article>
            );
          })}
        </section>
      )}

      {showAdd && (
        <div
          className="modal-backdrop"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>افزودن وظیفه</h2>

                <p>
                  مشخصات کاری که باید انجام شود را وارد کن.
                </p>
              </div>

              <button
                className="icon-button"
                onClick={() => setShowAdd(false)}
              >
                <X size={19} />
              </button>
            </div>

            <div className="form-grid">
              <label className="form-label full-width">
                عنوان وظیفه
                <input
                  className="form-input"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="مثلاً مطالعه فصل دوم زیست"
                  autoFocus
                />
              </label>

              <label className="form-label">
                موعد انجام
                <input
                  className="form-input"
                  type="date"
                  value={dueDate}
                  onChange={(event) =>
                    setDueDate(event.target.value)
                  }
                />
              </label>

              <label className="form-label">
                اولویت
                <select
                  className="form-input"
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value)
                  }
                >
                  {priorities.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                    >
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-label full-width">
                توضیحات
                <textarea
                  className="form-input form-textarea"
                  rows={4}
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="توضیحات یا جزئیات وظیفه..."
                />
              </label>
            </div>

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowAdd(false)}
              >
                انصراف
              </button>

              <button
                className="primary-button"
                disabled={
                  adding || !title.trim()
                }
                onClick={addTask}
              >
                {adding
                  ? "در حال ثبت..."
                  : "ثبت وظیفه"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
            }
