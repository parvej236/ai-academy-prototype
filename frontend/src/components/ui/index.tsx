"use client";

import Link from "next/link";
import { FileText, FlaskConical, ListChecks, PlayCircle, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { CategoryGlyph, EmptyArt } from "@/components/illustrations";
import type { PublishState } from "@/lib/data";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/* ---------- Panel ---------- */
export function Panel({
  children,
  className,
  lit,
  as: As = "section",
}: {
  children: ReactNode;
  className?: string;
  lit?: boolean;
  as?: "section" | "div" | "article" | "aside";
}) {
  return <As className={cx("glass", lit && "edge-lit", className)}>{children}</As>;
}

export function PanelHead({ title, meta, action }: { title: ReactNode; meta?: ReactNode; action?: ReactNode }) {
  const { t } = useT();
  if (typeof title === "string") title = t(title);
  if (typeof meta === "string") meta = t(meta);
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
      <div className="min-w-0">
        <h2 className="text-[0.95rem] font-semibold text-text">{title}</h2>
        {meta && <p className="mt-0.5 text-[0.8rem] text-muted">{meta}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ---------- Page header for portal screens ---------- */
export function PageHeader({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  const { t } = useT();
  title = t(title);
  if (typeof sub === "string") sub = t(sub);
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-semibold text-text sm:text-[1.7rem]">{title}</h1>
        {sub && <p className="mt-1.5 max-w-2xl text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/* ---------- Badge ---------- */
const tones = {
  neutral: "bg-tint/6 text-muted border-tint/10",
  cyan: "bg-cyan/10 text-cyan border-cyan/25",
  orchid: "bg-orchid/10 text-orchid border-orchid/25",
  indigo: "bg-indigo/15 text-indigo border-indigo/30",
  mint: "bg-mint/10 text-mint border-mint/25",
  amber: "bg-amber/10 text-amber border-amber/25",
  rose: "bg-rose/10 text-rose border-rose/25",
};
export type Tone = keyof typeof tones;
export function Badge({ children, tone = "neutral", dot, className }: { children: ReactNode; tone?: Tone; dot?: boolean; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[0.72rem] font-semibold", tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

const stateTone: Record<PublishState, Tone> = {
  draft: "neutral",
  review: "amber",
  scheduled: "indigo",
  published: "mint",
  archived: "rose",
};
export function StateBadge({ state }: { state: PublishState }) {
  return (
    <Badge tone={stateTone[state]} dot>
      {state[0].toUpperCase() + state.slice(1)}
    </Badge>
  );
}

/* ---------- Progress bar ---------- */
export function Bar({ value, tone = "cyan", className }: { value: number; tone?: "cyan" | "orchid" | "mint" | "amber" | "rose" | "indigo"; className?: string }) {
  const color = { cyan: "var(--cyan)", orchid: "var(--orchid)", mint: "var(--mint)", amber: "var(--amber)", rose: "var(--rose)", indigo: "var(--indigo)" }[tone];
  return (
    <div className={cx("h-1.5 w-full overflow-hidden rounded-full bg-tint/8", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full w-full origin-left rounded-full transition-transform duration-500 ease-[var(--ease-out)]" style={{ transform: `scaleX(${Math.max(0, Math.min(100, value)) / 100})`, background: color }} />
    </div>
  );
}

export const scoreTone = (s: number): "mint" | "amber" | "rose" => (s >= 75 ? "mint" : s >= 55 ? "amber" : "rose");

/* ---------- Stat ---------- */
export function Stat({ label, value, delta, foot }: { label: string; value: ReactNode; delta?: { v: string; up: boolean }; foot?: ReactNode }) {
  const { t } = useT();
  label = t(label);
  if (typeof foot === "string") foot = t(foot);
  return (
    <div className="glass p-5">
      <p className="text-[0.8rem] text-muted">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="tnum font-display text-[1.6rem] font-semibold text-text">{value}</span>
        {delta && <span className={cx("tnum text-xs font-semibold", delta.up ? "text-mint" : "text-rose")}>{delta.v}</span>}
      </div>
      {foot && <div className="mt-2 text-xs text-faint">{foot}</div>}
    </div>
  );
}

/* ---------- Tabs ---------- */
export function Tabs<T extends string>({ tabs, value, onChange, className }: { tabs: { id: T; label: ReactNode }[]; value: T; onChange: (v: T) => void; className?: string }) {
  const { t: tr } = useT();
  return (
    <div role="tablist" className={cx("inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-tint/[0.035] p-1 thin-scroll", className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            "h-8 shrink-0 rounded-full px-3.5 text-[0.82rem] font-semibold transition-colors",
            value === t.id ? "bg-tint/12 text-text shadow-sm" : "text-muted hover:text-text",
          )}
        >
          {typeof t.label === "string" ? tr(t.label) : t.label}
        </button>
      ))}
    </div>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="fade-in absolute inset-0 bg-[#1b2266]/20 backdrop-blur-sm" onClick={onClose} />
      <div className={cx("glass-strong pop relative max-h-[88vh] w-full overflow-y-auto thin-scroll", wide ? "max-w-3xl" : "max-w-lg")}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-tint/80 px-6 py-4 backdrop-blur-xl">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm !px-2" aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Switch ---------- */
export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cx("relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-150", on ? "border-indigo bg-indigo" : "border-line bg-tint/10")}
    >
      <span className={cx("absolute left-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform duration-200 ease-[var(--ease-out)]", on && "translate-x-5")} />
    </button>
  );
}

/* ---------- Toasts ---------- */
export function Toaster() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cx(
            "glass-strong toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 text-sm",
            t.tone === "err" && "!border-rose/40",
            t.tone === "warn" && "!border-amber/40",
          )}
        >
          <span className={cx("h-2 w-2 shrink-0 rounded-full", t.tone === "ok" ? "bg-mint" : t.tone === "warn" ? "bg-amber" : "bg-rose")} />
          {t.text}
        </div>
      ))}
    </div>
  );
}

/* ---------- Empty state ---------- */
export function Empty({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  const { t } = useT();
  title = t(title);
  if (body) body = t(body);
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <EmptyArt className="mb-4 h-20 w-auto" />
      <p className="font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- Avatar (initials) ---------- */
export function Avatar({ name, size = 32, hue }: { name: string; size?: number; hue?: number }) {
  const initials = name
    .replace(/^(Dr\.|Md\.)\s*/, "")
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  const h = hue ?? [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `hsl(${h} 45% 42%)`,
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}

/* ---------- Course cover: generated, no stock imagery ---------- */
export function Cover({ code, hue, category, className }: { code: string; hue: number; category?: string; className?: string }) {
  return (
    <div className={cx("on-dark relative overflow-hidden", className)} style={{ background: `hsl(${hue} 45% 24%)` }} aria-hidden>
      {category && <CategoryGlyph category={category} className="absolute left-1/2 top-1/2 h-[44%] max-h-24 min-h-6 w-auto -translate-x-1/2 -translate-y-1/2 opacity-90" />}
      <span className="font-display absolute bottom-2 right-3 text-[2.6rem] font-bold leading-none text-white/[0.14]">{code}</span>
      <span className="absolute left-4 top-4 h-5 w-5 rotate-45 rounded-[5px] border border-white/35 bg-white/10" />
    </div>
  );
}

/* ---------- Logo ---------- */
export function Logo({ compact, href = "/" }: { compact?: boolean; href?: string }) {
  const { t } = useT();
  return (
    <Link href={href} className="group flex items-center gap-2.5" aria-label="AI Academy home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mark.png" alt="" width={34} height={34} className="h-[34px] w-[34px] rounded-lg " />
      {!compact && (
        <span className="leading-none">
          <span className="font-display block text-[0.95rem] font-semibold tracking-tight text-text">{t("AI Academy")}</span>
          <span className="mt-0.5 block text-[0.66rem] text-faint">{t("by Tradevics AI")}</span>
        </span>
      )}
    </Link>
  );
}

/* ---------- small hook ---------- */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}

export const kindIcon = { video: PlayCircle, reading: FileText, quiz: ListChecks, lab: FlaskConical };
