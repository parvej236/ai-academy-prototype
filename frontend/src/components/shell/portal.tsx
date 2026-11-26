"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  BotMessageSquare,
  Building2,
  CalendarRange,
  ClipboardCheck,
  CreditCard,
  FileStack,
  FlaskConical,
  GraduationCap,
  KeyRound,
  LayoutGrid,
  LibraryBig,
  LogOut,
  Menu,
  MessagesSquare,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  UserRoundCog,
  Users,
  X,
  Lock,
  BellRing,
  ListChecks,
  Gavel,
} from "lucide-react";
import { Avatar, Logo, cx } from "@/components/ui";
import { useStore } from "@/lib/store";
import { LangToggle, useT } from "@/lib/i18n";
import type { Role } from "@/lib/data";

type NavItem = { href: string; label: string; icon: typeof LayoutGrid; exact?: boolean };
type NavGroup = { title?: string; items: NavItem[] };

const nav: Record<Role, NavGroup[]> = {
  student: [
    {
      items: [
        { href: "/app", label: "Dashboard", icon: LayoutGrid, exact: true },
        { href: "/app/courses", label: "My courses", icon: BookOpen },
        { href: "/app/lab", label: "Practical lab", icon: FlaskConical },
        { href: "/app/exams", label: "Exams", icon: ClipboardCheck },
        { href: "/app/live", label: "Live classes", icon: Radio },
      ],
    },
    {
      title: "People",
      items: [
        { href: "/app/community", label: "Community", icon: MessagesSquare },
        { href: "/app/mentor", label: "My mentor", icon: GraduationCap },
      ],
    },
    {
      title: "Account",
      items: [
        { href: "/app/certificates", label: "Certificates", icon: Award },
        { href: "/app/settings", label: "Plan and settings", icon: Settings },
      ],
    },
  ],
  mentor: [
    {
      items: [
        { href: "/mentor", label: "Overview", icon: LayoutGrid, exact: true },
        { href: "/mentor/students", label: "My students", icon: Users },
        { href: "/mentor/reports", label: "Reports", icon: FileStack },
        { href: "/mentor/sessions", label: "Sessions", icon: CalendarRange },
        { href: "/app/community", label: "Community", icon: MessagesSquare },
      ],
    },
  ],
  admin: [
    { items: [{ href: "/admin", label: "Overview", icon: LayoutGrid, exact: true }] },
    {
      title: "Course management",
      items: [
        { href: "/admin/courses", label: "Courses and CMS", icon: LibraryBig },
        { href: "/admin/schedule", label: "Master schedule", icon: CalendarRange },
        { href: "/admin/documents", label: "Documents", icon: FileStack },
        { href: "/admin/enrolments", label: "Enrolments", icon: Users },
        { href: "/admin/live", label: "Live and video", icon: Radio },
      ],
    },
    {
      title: "Assessment",
      items: [
        { href: "/admin/lab", label: "Lab and simulator", icon: FlaskConical },
        { href: "/admin/questions", label: "Question bank", icon: ListChecks },
        { href: "/admin/exams", label: "Exams and grading", icon: Gavel },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ],
    },
    {
      title: "People",
      items: [
        { href: "/admin/mentors", label: "Mentors and tutors", icon: UserRoundCog },
        { href: "/admin/community", label: "Community", icon: MessagesSquare },
        { href: "/admin/certificates", label: "Certificates", icon: Award },
      ],
    },
    {
      title: "Platform",
      items: [
        { href: "/admin/access", label: "Roles and tenants", icon: Building2 },
        { href: "/admin/billing", label: "Subscriptions and billing", icon: CreditCard },
        { href: "/admin/security", label: "Security", icon: ShieldCheck },
        { href: "/admin/notifications", label: "Notifications", icon: BellRing },
        { href: "/admin/integrations", label: "API keys and integrations", icon: KeyRound },
        { href: "/admin/ai", label: "AI agents", icon: BotMessageSquare },
      ],
    },
  ],
};

const roleName: Record<Role, string> = { student: "Student", mentor: "Mentor", admin: "Admin" };

export function PortalShell({ role, children }: { role: Role; children: ReactNode }) {
  const { user, ready, logout, login, notifications, markAllRead } = useStore();
  const { t } = useT();
  const router = useRouter();
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [bell, setBell] = useState(false);
  const [menu, setMenu] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [ready, user, router, path]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close overlays on route change
    setDrawer(false);
    setBell(false);
    setMenu(false);
  }, [path]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBell(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!ready || !user) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 rotate-45 animate-pulse rounded-lg border border-indigo/40 bg-indigo/10" />
      </div>
    );
  }

  // Role guard: the admin portal is admin-only; the mentor portal needs a mentor or admin.
  const allowed = role === "student" || user.role === "admin" || (role === "mentor" && user.role === "mentor");
  if (!allowed) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <div className="glass-strong max-w-md p-8 text-center">
          <h1 className="font-display text-xl font-semibold">{t("You don't have access to this area")}</h1>
          <p className="mt-2 text-sm text-muted">
            {t("You're signed in as")} {user.name} ({t(roleName[user.role])}).
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <Link href={user.role === "mentor" ? "/mentor" : "/app"} className="btn btn-glass">
              {t("Back to my workspace")}
            </Link>
            <button
              className="btn btn-primary"
              onClick={() => login(role)}
            >
              {t("Switch demo account")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groups = nav[role];
  const unread = notifications.filter((n) => !n.read).length;
  const isActive = (i: NavItem) => (i.exact ? path === i.href : path.startsWith(i.href));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <Logo href={role === "admin" ? "/admin" : role === "mentor" ? "/mentor" : "/app"} />
        <button className="btn btn-ghost btn-sm !px-2 lg:hidden" onClick={() => setDrawer(false)} aria-label="Close menu">
          <X size={16} />
        </button>
      </div>
      <div className="mx-4 mb-3 rounded-xl border border-line bg-tint/[0.035] px-3 py-2 text-xs text-muted">
        {t(role === "admin" ? "Admin portal" : role === "mentor" ? "Mentor and tutor portal" : "Learning workspace")}
      </div>
      <nav className="thin-scroll flex-1 overflow-y-auto px-3 pb-4" aria-label="Main">
        {groups.map((g, gi) => (
          <div key={gi} className={gi ? "mt-5" : ""}>
            {g.title && <p className="mb-1.5 px-3 text-[0.72rem] font-semibold text-faint">{t(g.title)}</p>}
            <ul className="space-y-0.5">
              {g.items.map((i) => {
                const active = isActive(i);
                return (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      aria-current={active ? "page" : undefined}
                      className={cx(
                        "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[0.86rem] font-medium transition-colors",
                        active ? "bg-tint/[0.09] text-text shadow-sm" : "text-muted hover:bg-tint/[0.04] hover:text-text",
                      )}
                    >
                      {active && <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-indigo" />}
                      <i.icon size={17} strokeWidth={1.8} className={active ? "text-indigo" : "text-faint group-hover:text-muted"} />
                      {t(i.label)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      {role === "student" && user.plan === "none" && (
        <div className="m-3 rounded-2xl border border-indigo/30 bg-indigo/10 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Lock size={14} /> {t("No active plan")}
          </p>
          <p className="mt-1 text-xs text-muted">{t("Lessons beyond previews, labs and live classes need a subscription.")}</p>
          <Link href="/pricing" className="btn btn-primary btn-sm mt-3 w-full">
            {t("See plans")}
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-dvh lg:pl-[264px]">
      {/* sidebar */}
      <aside className="glass fixed inset-y-3 left-3 z-30 hidden w-[248px] !rounded-[24px] lg:block">{sidebar}</aside>
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[#1b2266]/20 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="glass-strong pop absolute inset-y-2 left-2 w-[272px]">{sidebar}</aside>
        </div>
      )}

      {/* top bar */}
      <header className="sticky top-0 z-20 px-3 pt-3 sm:px-5">
        <div className="glass flex h-14 items-center gap-2 !rounded-2xl px-2 sm:px-3">
          <button className="btn btn-ghost btn-sm !px-2 lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Menu size={18} />
          </button>
          <label className="relative hidden max-w-sm flex-1 sm:block">
            <span className="sr-only">Search</span>
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
            <input className="field !h-9 !rounded-full !bg-tint/[0.04] pl-9 text-sm" placeholder={t("Search courses, cases, threads")} />
          </label>
          <div className="ml-auto flex items-center gap-1">
            <LangToggle className="mr-1" />
            {/* demo role switcher */}
            <div className="mr-1 hidden items-center rounded-full border border-line bg-tint/[0.04] p-0.5 md:flex" title="Demo: switch portal">
              {(["student", "mentor", "admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    login(r);
                    router.push(r === "admin" ? "/admin" : r === "mentor" ? "/mentor" : "/app");
                  }}
                  className={cx("h-7 rounded-full px-3 text-xs font-semibold", role === r ? "bg-tint/12 text-text" : "text-faint hover:text-muted")}
                >
                  {t(roleName[r])}
                </button>
              ))}
            </div>
            <div className="relative" ref={bellRef}>
              <button className="btn btn-ghost btn-sm relative !px-2.5" onClick={() => setBell(!bell)} aria-label={`Notifications, ${unread} unread`}>
                <Bell size={17} />
                {unread > 0 && <span className="absolute right-1.5 top-1 h-2 w-2 rounded-full bg-orchid" />}
              </button>
              {bell && (
                <div className="glass-strong pop absolute right-0 top-11 w-[min(88vw,360px)] p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-sm font-semibold">{t("Notifications")}</span>
                    <button className="text-xs text-indigo hover:underline" onClick={markAllRead}>
                      {t("Mark all read")}
                    </button>
                  </div>
                  {notifications.map((n) => (
                    <Link key={n.id} href={n.href} className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-tint/5">
                      <span className={cx("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-tint/15" : "bg-indigo")} />
                      <span className="min-w-0">
                        <span className="block text-sm leading-snug">{n.title}</span>
                        <span className="block text-xs text-muted">{n.body}</span>
                        <span className="mt-0.5 block text-[0.7rem] text-faint">{n.at}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-tint/5" aria-expanded={menu}>
                <Avatar name={user.name} size={30} />
                <span className="hidden text-left leading-tight sm:block">
                  <span className="block text-[0.82rem] font-semibold">{user.name}</span>
                  <span className="block text-[0.7rem] text-faint">{user.org}</span>
                </span>
              </button>
              {menu && (
                <div className="glass-strong pop absolute right-0 top-12 w-56 p-1.5">
                  <Link href="/" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-tint/5 hover:text-text">
                    {t("Public site")}
                  </Link>
                  {role === "student" && (
                    <Link href="/app/settings" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-tint/5 hover:text-text">
                      {t("Plan and settings")}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose hover:bg-rose/10"
                  >
                    <LogOut size={14} /> {t("Log out")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-3 pb-16 pt-6 sm:px-5 lg:pt-8">{children}</main>
    </div>
  );
}

/* Gate for paid features — Module 13 requires a subscription. */
export function Paywall({ children, what }: { children: ReactNode; what: string }) {
  const { hasAccess } = useStore();
  const { t, lang } = useT();
  if (hasAccess) return <>{children}</>;
  return (
    <div className="glass edge-lit mx-auto max-w-xl p-8 text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 rotate-45 items-center justify-center rounded-xl border border-indigo/40 bg-indigo/15">
        <Lock size={18} className="-rotate-45 text-indigo" />
      </div>
      <h2 className="font-display text-xl font-semibold">{lang === "bn" ? `${t(what)} ${t("needs a subscription")}` : `${what} needs a subscription`}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        {t("AI Academy is a paid platform. Pick a plan to unlock full lessons, the practical lab, exams and expert-led live classes.")}
      </p>
      <Link href="/pricing" className="btn btn-primary mt-6">
        {t("Compare plans")}
      </Link>
    </div>
  );
}
