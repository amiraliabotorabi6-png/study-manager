"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Clock3,
  GraduationCap,
  Home,
  LayoutDashboard,
  ListTodo,
  Menu,
  Settings,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const mainItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "داشبورد",
    icon: LayoutDashboard,
  },
  {
    href: "/today",
    label: "امروز",
    icon: Home,
  },
  {
    href: "/timer",
    label: "تایمر",
    icon: Clock3,
  },
  {
    href: "/planner",
    label: "برنامه‌ریزی",
    icon: CalendarDays,
  },
];

const studyItems: NavItem[] = [
  {
    href: "/subjects",
    label: "درس‌ها",
    icon: BookOpen,
  },
  {
    href: "/exams",
    label: "امتحان‌ها",
    icon: GraduationCap,
  },
  {
    href: "/tests",
    label: "آزمون‌ها",
    icon: CheckSquare,
  },
  {
    href: "/tasks",
    label: "کارها",
    icon: ListTodo,
  },
  {
    href: "/goals",
    label: "اهداف",
    icon: Target,
  },
];

const analysisItems: NavItem[] = [
  {
    href: "/analytics",
    label: "تحلیل عملکرد",
    icon: BarChart3,
  },
  {
    href: "/journal",
    label: "ژورنال",
    icon: BookOpen,
  },
  {
    href: "/calendar",
    label: "تقویم",
    icon: CalendarDays,
  },
];

const systemItems: NavItem[] = [
  {
    href: "/notifications",
    label: "اعلان‌ها",
    icon: Bell,
  },
  {
    href: "/settings",
    label: "تنظیمات",
    icon: Settings,
  },
];

function NavLink({
  item,
  onClick,
}: {
  item: NavItem;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;

  const active =
    pathname === item.href ||
    pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`sidebar-link ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <Icon size={19} />
      <span>{item.label}</span>
    </Link>
  );
}

function SidebarContent({
  onLinkClick,
}: {
  onLinkClick?: () => void;
}) {
  return (
    <>
      <div className="sidebar-brand">
        <Link href="/dashboard" onClick={onLinkClick}>
          <div className="brand-mark">
            <BookOpen size={20} />
          </div>

          <div>
            <strong>Study Manager</strong>
            <span>مدیریت مطالعه</span>
          </div>
        </Link>
      </div>

      <div className="sidebar-scroll">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">
              اصلی
            </span>

            {mainItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onClick={onLinkClick}
              />
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">
              مطالعه
            </span>

            {studyItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onClick={onLinkClick}
              />
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">
              تحلیل
            </span>

            {analysisItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onClick={onLinkClick}
              />
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-title">
              سیستم
            </span>

            {systemItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                onClick={onLinkClick}
              />
            ))}
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className="status-dot" />
          <span>ذخیره‌سازی فعال</span>
        </div>
      </div>
    </>
  );
}

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const pathname = usePathname();

  const isPublic =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-email";

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      <aside className="desktop-sidebar">
        <SidebarContent />
      </aside>

      <div className="mobile-header">
        <Link
          href="/dashboard"
          className="mobile-brand"
        >
          <div className="brand-mark">
            <BookOpen size={19} />
          </div>

          <strong>Study Manager</strong>
        </Link>

        <button
          className="icon-button"
          onClick={() => setMobileOpen(true)}
          aria-label="باز کردن منو"
        >
          <Menu size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="mobile-menu-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setMobileOpen(false);
            }
          }}
        >
          <aside className="mobile-sidebar">
            <div className="mobile-sidebar-header">
              <strong>منوی برنامه</strong>

              <button
                className="icon-button"
                onClick={() =>
                  setMobileOpen(false)
                }
                aria-label="بستن منو"
              >
                <X size={21} />
              </button>
            </div>

            <SidebarContent
              onLinkClick={() =>
                setMobileOpen(false)
              }
            />
          </aside>
        </div>
      )}

      <div className="app-main">
        {children}
      </div>

      <nav className="mobile-bottom-nav">
        {[
          mainItems[0],
          mainItems[1],
          mainItems[2],
          mainItems[3],
        ].map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`
            );

          return (
            <Link
              href={item.href}
              key={item.href}
              className={
                active ? "active" : ""
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
                           }
