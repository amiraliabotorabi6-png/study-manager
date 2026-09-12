"use client";

import { useMemo, useState } from "react";

type TaskStatus = "todo" | "doing" | "done";
type Priority = "high" | "medium" | "low";

type Task = {
  id: number;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  priority: Priority;
  status: TaskStatus;
  notes: string;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "مطالعه گفتار اول زیست",
    subject: "زیست‌شناسی",
    date: "۱۴۰۵/۰۶/۲۱",
    time: "۱۰:۰۰",
    duration: 60,
    priority: "high",
    status: "doing",
    notes: "مطالعه دقیق متن کتاب و شکل‌ها",
  },
  {
    id: 2,
    title: "حل تمرین‌های شیمی",
    subject: "شیمی",
    date: "۱۴۰۵/۰۶/۲۱",
    time: "۱۲:۰۰",
    duration: 45,
    priority: "medium",
    status: "todo",
    notes: "تمرین‌های مشخص‌شده",
  },
  {
    id: 3,
    title: "تست تابع",
    subject: "ریاضی",
    date: "۱۴۰۵/۰۶/۲۱",
    time: "۱۵:۳۰",
    duration: 50,
    priority: "high",
    status: "todo",
    notes: "۲۰ تست با تحلیل کامل",
  },
  {
    id: 4,
    title: "مرور لغات زبان",
    subject: "زبان",
    date: "۱۴۰۵/۰۶/۲۰",
    time: "۱۸:۰۰",
    duration: 25,
    priority: "low",
    status: "done",
    notes: "مرور لغات جلسه قبل",
  },
];

const statusLabels: Record<TaskStatus, string> = {
  todo: "انجام‌نشده",
  doing: "در حال انجام",
  done: "انجام‌شده",
};

const priorityLabels: Record<Priority, string> = {
  high: "بالا",
  medium: "متوسط",
  low: "کم",
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [statusFilter, setStatusFilter] = useState<
    "all" | TaskStatus
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | Priority
  >("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(1);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      const text =
        `${task.title} ${task.subject} ${task.notes}`.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      return (
        matchesStatus &&
        matchesPriority &&
        matchesSearch
      );
    });
  }, [tasks, statusFilter, priorityFilter, search]);

  const selectedTask =
    tasks.find((task) => task.id === selectedId) ??
    filteredTasks[0];

  const completedCount = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const doingCount = tasks.filter(
    (task) => task.status === "doing"
  ).length;

  const todoCount = tasks.filter(
    (task) => task.status === "todo"
  ).length;

  const totalMinutes = tasks.reduce(
    (sum, task) => sum + task.duration,
    0
  );

  function addTask() {
    const id =
      tasks.length > 0
        ? Math.max(...tasks.map((task) => task.id)) + 1
        : 1;

    const newTask: Task = {
      id,
      title: "وظیفه جدید",
      subject: "درس جدید",
      date: "۱۴۰۵/۰۶/۲۱",
      time: "۲۰:۰۰",
      duration: 30,
      priority: "medium",
      status: "todo",
      notes: "",
    };

    setTasks((current) => [newTask, ...current]);
    setSelectedId(id);
  }

  function updateStatus(
    id: number,
    status: TaskStatus
  ) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  function deleteTask(id: number) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );

    if (selectedId === id) {
      const next = tasks.find((task) => task.id !== id);

      if (next) {
        setSelectedId(next.id);
      }
    }
  }

  return (
    <main className="tasks-page">
      <header className="tasks-header">
        <div>
          <span className="dashboard-label">
            TASK MANAGER
          </span>

          <h1>وظایف</h1>

          <p>
            مدیریت کارهای مطالعه، برنامه‌ها و وظایف روزانه
          </p>
        </div>

        <button onClick={addTask}>
          + افزودن وظیفه
        </button>
      </header>

      <section className="task-stats">
        <div className="panel task-stat">
          <span>کل وظایف</span>
          <strong>{tasks.length}</strong>
          <small>وظیفه ثبت‌شده</small>
        </div>

        <div className="panel task-stat">
          <span>انجام‌شده</span>
          <strong>{completedCount}</strong>
          <small>وظایف تکمیل‌شده</small>
        </div>

        <div className="panel task-stat">
          <span>در حال انجام</span>
          <strong>{doingCount}</strong>
          <small>وظایف فعال</small>
        </div>

        <div className="panel task-stat">
          <span>زمان برنامه‌ریزی‌شده</span>
          <strong>{totalMinutes}</strong>
          <small>دقیقه</small>
        </div>
      </section>

      <section className="tasks-toolbar panel">
        <div className="task-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="جستجوی وظیفه یا درس..."
          />
        </div>

        <div className="task-filter-group">
          <span>وضعیت:</span>

          <button
            className={
              statusFilter === "all" ? "active" : ""
            }
            onClick={() => setStatusFilter("all")}
          >
            همه
          </button>

          <button
            className={
              statusFilter === "todo" ? "active" : ""
            }
            onClick={() => setStatusFilter("todo")}
          >
            انجام‌نشده
          </button>

          <button
            className={
              statusFilter === "doing" ? "active" : ""
            }
            onClick={() => setStatusFilter("doing")}
          >
            در حال انجام
          </button>

          <button
            className={
              statusFilter === "done" ? "active" : ""
            }
            onClick={() => setStatusFilter("done")}
          >
            انجام‌شده
          </button>
        </div>

        <div className="task-filter-group">
          <span>اولویت:</span>

          <button
            className={
              priorityFilter === "all" ? "active" : ""
            }
            onClick={() => setPriorityFilter("all")}
          >
            همه
          </button>

          <button
            className={
              priorityFilter === "high" ? "active" : ""
            }
            onClick={() => setPriorityFilter("high")}
          >
            بالا
          </button>

          <button
            className={
              priorityFilter === "medium" ? "active" : ""
            }
            onClick={() => setPriorityFilter("medium")}
          >
            متوسط
          </button>

          <button
            className={
              priorityFilter === "low" ? "active" : ""
            }
            onClick={() => setPriorityFilter("low")}
          >
            کم
          </button>
        </div>
      </section>

      <section className="tasks-layout">
        <div className="panel tasks-list-panel">
          <div className="panel-header">
            <div>
              <h2>فهرست وظایف</h2>

              <p>
                {filteredTasks.length} وظیفه نمایش داده می‌شود
              </p>
            </div>
          </div>

          <div className="tasks-list">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`task-list-item ${
                  selectedTask?.id === task.id
                    ? "active"
                    : ""
                } ${
                  task.status === "done"
                    ? "completed"
                    : ""
                }`}
              >
                <button
                  className="task-select-area"
                  onClick={() => setSelectedId(task.id)}
                >
                  <span
                    className={`task-check ${
                      task.status
                    }`}
                  >
                    {task.status === "done"
                      ? "✓"
                      : ""}
                  </span>

                  <div className="task-list-content">
                    <strong>{task.title}</strong>

                    <span>{task.subject}</span>

                    <small>
                      {task.date} · {task.time} ·{" "}
                      {task.duration} دقیقه
                    </small>
                  </div>
                </button>

                <div className="task-list-actions">
                  <span
                    className={`priority-badge ${task.priority}`}
                  >
                    {priorityLabels[task.priority]}
                  </span>

                  <select
                    value={task.status}
                    onChange={(event) =>
                      updateStatus(
                        task.id,
                        event.target.value as TaskStatus
                      )
                    }
                  >
                    <option value="todo">
                      انجام‌نشده
                    </option>

                    <option value="doing">
                      در حال انجام
                    </option>

                    <option value="done">
                      انجام‌شده
                    </option>
                  </select>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="task-empty">
                <span>✓</span>

                <strong>
                  وظیفه‌ای پیدا نشد
                </strong>

                <small>
                  فیلترها را تغییر بده یا یک وظیفه جدید
                  اضافه کن.
                </small>
              </div>
            )}
          </div>
        </div>

        {selectedTask && (
          <aside className="task-details">
            <div className="panel task-detail-header">
              <div>
                <span
                  className={`priority-badge ${selectedTask.priority}`}
                >
                  اولویت{" "}
                  {priorityLabels[selectedTask.priority]}
                </span>

                <h2>{selectedTask.title}</h2>

                <p>
                  {selectedTask.subject} ·{" "}
                  {selectedTask.date}
                </p>
              </div>

              <button
                className="delete-task"
                onClick={() =>
                  deleteTask(selectedTask.id)
                }
              >
                حذف
              </button>
            </div>

            <div className="panel task-status-card">
              <div className="panel-header">
                <div>
                  <h2>وضعیت وظیفه</h2>

                  <p>
                    وضعیت فعلی این کار را مشخص کن
                  </p>
                </div>
              </div>

              <div className="task-status-buttons">
                {(
                  Object.keys(
                    statusLabels
                  ) as TaskStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    className={
                      selectedTask.status === status
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      updateStatus(
                        selectedTask.id,
                        status
                      )
                    }
                  >
                    <span>
                      {status === "done"
                        ? "✓"
                        : status === "doing"
                        ? "◐"
                        : "○"}
                    </span>

                    {statusLabels[status]}
                  </button>
                ))}
              </div>
            </div>

            <div className="task-detail-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>زمان‌بندی</h2>

                    <p>زمان اختصاص‌یافته</p>
                  </div>
                </div>

                <div className="task-info-list">
                  <div>
                    <span>تاریخ</span>

                    <strong>
                      {selectedTask.date}
                    </strong>
                  </div>

                  <div>
                    <span>ساعت</span>

                    <strong>
                      {selectedTask.time}
                    </strong>
                  </div>

                  <div>
                    <span>مدت هدف</span>

                    <strong>
                      {selectedTask.duration} دقیقه
                    </strong>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>درس و اولویت</h2>

                    <p>اطلاعات اصلی وظیفه</p>
                  </div>
                </div>

                <div className="task-info-list">
                  <div>
                    <span>درس</span>

                    <strong>
                      {selectedTask.subject}
                    </strong>
                  </div>

                  <div>
                    <span>اولویت</span>

                    <strong>
                      {priorityLabels[
                        selectedTask.priority
                      ]}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel task-progress-panel">
              <div className="panel-header">
                <div>
                  <h2>پیشرفت</h2>

                  <p>
                    وضعیت اجرای این وظیفه
                  </p>
                </div>

                <strong>
                  {selectedTask.status === "done"
                    ? "۱۰۰٪"
                    : selectedTask.status === "doing"
                    ? "۵۰٪"
                    : "۰٪"}
                </strong>
              </div>

              <div className="task-progress">
                <div
                  style={{
                    width:
                      selectedTask.status === "done"
                        ? "100%"
                        : selectedTask.status === "doing"
                        ? "50%"
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div className="panel task-note-panel">
              <div className="panel-header">
                <div>
                  <h2>یادداشت</h2>

                  <p>
                    توضیحات و نکات مربوط به وظیفه
                  </p>
                </div>
              </div>

              <textarea
                defaultValue={selectedTask.notes}
                rows={5}
                placeholder="توضیحات این وظیفه..."
              />

              <button>
                ذخیره یادداشت
              </button>
            </div>

            {selectedTask.status !== "done" && (
              <div className="panel overdue-panel">
                <div>
                  <strong>
                    نیاز به جابه‌جایی زمان دارد؟
                  </strong>

                  <p>
                    اگر این وظیفه انجام نشد، می‌توانی
                    زمان جدیدی برای آن تعیین کنی.
                  </p>
                </div>

                <button>
                  پیشنهاد زمان جدید
                </button>
              </div>
            )}
          </aside>
        )}
      </section>

      <section className="panel task-summary">
        <div>
          <span>خلاصه وضعیت</span>

          <strong>
            {completedCount} از {tasks.length} وظیفه
            انجام شده
          </strong>
        </div>

        <div className="summary-progress">
          <div
            style={{
              width: `${
                tasks.length
                  ? (completedCount / tasks.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>

        <small>
          {todoCount} وظیفه باقی‌مانده · {doingCount} وظیفه
          در حال انجام
        </small>
      </section>
    </main>
  );
}
