"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo, cx } from "@/components/ui";
import { useStore } from "@/lib/store";
import { LangToggle, useT } from "@/lib/i18n";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/live", label: "Live classes" },
  { href: "/#lab", label: "Practical lab" },
  { href: "/pricing", label: "Pricing" },
  { href: "/verify", label: "Verify certificate" },
];

export function portalHome(role?: string) {
  return role === "admin" ? "/admin" : role === "mentor" ? "/mentor" : "/app";
}

export function SiteHeader() {
  const path = usePathname();
  const { user, ready } = useStore();
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6">
      <nav className="glass mx-auto flex h-14 max-w-7xl items-center justify-between !rounded-full pl-3 pr-2 sm:pl-4">
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cx(
                  "rounded-full px-3.5 py-2 text-[0.86rem] font-medium transition-colors",
                  path.startsWith(l.href) ? "bg-tint/[0.06] text-text" : "text-muted hover:text-text",
                )}
              >
                {t(l.label)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5">
          <LangToggle className="hidden sm:flex" />
          {ready && user ? (
            <Link href={portalHome(user.role)} className="btn btn-primary btn-sm">
              {t("Open my workspace")}
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm hidden sm:inline-flex">
                {t("Log in")}
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                {t("Start learning")}
              </Link>
            </>
          )}
          <button className="btn btn-ghost btn-sm !px-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass-strong pop mx-auto mt-2 max-w-7xl p-2 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-muted hover:bg-tint/5 hover:text-text">
              {t(l.label)}
            </Link>
          ))}
          {!user && (
            <Link href="/login" onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-sm text-muted hover:bg-tint/5">
              {t("Log in")}
            </Link>
          )}
          <div className="px-4 py-3">
            <LangToggle className="w-fit" />
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useT();
  const cols = [
    { h: "Learn", l: [["Courses", "/courses"], ["Live classes", "/live"], ["Practical lab", "/#lab"], ["Pricing", "/pricing"]] },
    { h: "Community", l: [["Importers", "/signup"], ["C&F Agents", "/signup"], ["Tax practitioners", "/signup"]] },
    { h: "Company", l: [["Tradevics AI", "/"], ["Verify a certificate", "/verify"], ["Terms", "/"], ["Privacy", "/"]] },
  ];
  return (
    <footer className="mt-28 border-t border-line bg-white/60 px-4 pb-10 pt-14 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            {t("Trade and customs training for people who clear goods, file returns and answer to assessing officers. A Tradevics AI company.")}
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h3 className="text-sm font-semibold">{t(c.h)}</h3>
            <ul className="mt-3 space-y-2">
              {c.l.map(([label, h]) => (
                <li key={label}>
                  <Link href={h} className="text-sm text-muted hover:text-text">
                    {t(label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-12 max-w-7xl text-xs text-faint">© 2026 Tradevics AI. {t("AI Academy is Module 13 of the Tradevics AI platform.")}</p>
    </footer>
  );
}
