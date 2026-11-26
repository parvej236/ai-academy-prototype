"use client";

import Link from "next/link";
import { Award, BookOpen, ClipboardCheck, FlaskConical, Radio, Star } from "lucide-react";
import { SimConsole } from "@/components/landing/sim-console";
import { Avatar, Badge, Cover } from "@/components/ui";
import { courses, fmtBDT, fmtDateTime, forumGroups, lessonCount, liveClasses, mentorReports, plans } from "@/lib/data";
import { useT } from "@/lib/i18n";

export default function Home() {
  const { t, n } = useT();
  const featured = courses.filter((c) => c.status === "published");
  const lead = featured[0];
  const rest = featured.slice(1, 5);
  const upcoming = liveClasses.filter((l) => l.status !== "recorded").slice(0, 3);
  const report = mentorReports[0];

  const h2 = "font-display text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-[2.15rem]";

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="px-4 pb-24 pt-14 sm:px-6 lg:pt-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1.12fr]">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-[0.8rem] text-muted" style={{ animationDelay: "0ms" }}>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo" /> {t("Module 13 of the Tradevics AI platform")}
            </p>
            <h1 className="rise font-display mt-6 text-[2.4rem] font-semibold leading-[1.08] sm:text-[3.2rem] lg:text-[3.6rem]" style={{ animationDelay: "80ms" }}>
              {t("Rehearse the assessment before the officer asks.")}
            </h1>
            <p className="rise mt-6 max-w-[34rem] text-[1.06rem] leading-relaxed text-muted" style={{ animationDelay: "160ms" }}>
              {t(
                "Customs and trade training for importers, C&F agents and tax practitioners in Bangladesh. Learn classification, valuation and VAT from people who have sat on the other side of the counter, then argue real cases with an AI examiner until you get them right.",
              )}
            </p>
            <div className="rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
              <Link href="/signup" className="btn btn-primary btn-lg">
                {t("Create your account")}
              </Link>
              <Link href="/courses" className="btn btn-glass btn-lg">
                {t("Browse courses")}
              </Link>
            </div>
            <dl className="rise mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6 text-sm" style={{ animationDelay: "320ms" }}>
              {[
                ["Practitioners trained", "14,800"],
                ["Lab attempts graded", "212,000"],
                ["Licensing exam pass rate", "78%"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dd className="tnum font-display text-xl font-semibold">{n(v)}</dd>
                  <dt className="mt-1 text-xs leading-snug text-faint">{t(k)}</dt>
                </div>
              ))}
            </dl>
          </div>
          <div className="rise" style={{ animationDelay: "200ms" }}>
            <SimConsole />
            <p className="mt-3 text-center text-xs text-faint">{t("Pick an answer. This is the first question of a real lab case.")}</p>
          </div>
        </div>
      </section>

      {/* ---------- Audience ---------- */}
      <section className="px-4 sm:px-6">
        <div className="glass mx-auto grid max-w-7xl divide-y divide-line overflow-hidden md:grid-cols-5 md:divide-x md:divide-y-0">
          {forumGroups.map((g) => (
            <div key={g.id} className="p-6">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rotate-45 rounded-[2px]" style={{ background: `hsl(${g.hue} 60% 45%)` }} />
                <h3 className="text-sm font-semibold">{g.name}</h3>
              </div>
              <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{g.description}</p>
              <p className="tnum mt-3 text-xs text-faint">
                {n(g.members.toLocaleString())} {t("members in the forum")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works (a real sequence) ---------- */}
      <section className="px-4 pt-32 sm:px-6" id="lab">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className={h2}>{t("From first lesson to a certificate an employer can check")}</h2>
            <p className="mt-4 text-muted">{t("Every course follows the same path. You can't skip to the certificate.")}</p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-4">
            {[
              { icon: BookOpen, h: "Learn", d: "Short video lessons, readings and the legal texts you will cite, written by former officials and senior practitioners." },
              { icon: FlaskConical, h: "Practise in the lab", d: "The Simulator Agent plays the assessing officer on a real consignment. You answer; it pushes back." },
              { icon: ClipboardCheck, h: "Get examined", d: "Timed MCQs, mock papers, case studies and a viva board. The Examiner Agent sets fresh questions each attempt." },
              { icon: Award, h: "Get certified", d: "Pass and receive a certificate with a public serial number anyone can verify." },
            ].map((s, i) => (
              <li key={s.h} className="bg-white/90 p-7">
                <div className="flex items-center justify-between">
                  <s.icon size={20} className="text-indigo" strokeWidth={1.8} />
                  <span className="tnum text-sm font-semibold text-faint">{n(String(i + 1).padStart(2, "0"))}</span>
                </div>
                <h3 className="mt-6 font-semibold">{t(s.h)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(s.d)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- AI architecture ---------- */}
      <section className="px-4 pt-32 sm:px-6">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className={h2}>{t("Three agents, one standard of marking")}</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted">
              {t(
                "Questions, simulations and grading are handled by separate agents so no single model marks its own homework. Every score keeps an audit trail an examiner can review and override.",
              )}
            </p>
            <ul className="mt-8 space-y-6">
              {[
                ["Examiner Agent", "Builds question sets from the bank, runs viva follow-ups and adapts difficulty to your weak areas."],
                ["Simulator Agent", "Plays officers, clients and bankers inside lab cases, using the case documents as its only source of facts."],
                ["Evaluation Engine", "Scores each answer against the examiner's rubric and flags low-confidence marks for a human."],
              ].map(([h, d]) => (
                <li key={h} className="flex gap-4">
                  <span className="mt-2 h-2 w-2 shrink-0 rotate-45 rounded-[2px] bg-indigo" />
                  <div>
                    <p className="font-semibold">{t(h)}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{t(d)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <AgentDiagram />
        </div>
      </section>

      {/* ---------- Courses ---------- */}
      <section className="px-4 pt-32 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className={h2}>{t("Courses practitioners ask for")}</h2>
            <Link href="/courses" className="btn btn-glass">
              {t("All courses")}
            </Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
            <Link href={`/courses/${lead.slug}`} className="glass group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
              <Cover code={lead.code} hue={lead.hue} className="h-56" />
              <div className="flex flex-1 flex-col p-7">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="indigo">{lead.category}</Badge>
                  <Badge>{lead.level}</Badge>
                </div>
                <h3 className="font-display mt-4 text-xl font-semibold">{lead.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{lead.summary}</p>
                <div className="mt-auto flex items-center gap-3 pt-6">
                  <Avatar name={lead.instructor} size={36} />
                  <div className="text-sm">
                    <p className="font-semibold">{lead.instructor}</p>
                    <p className="text-xs text-faint">{lead.instructorTitle}</p>
                  </div>
                </div>
              </div>
            </Link>
            <ul className="glass divide-y divide-line overflow-hidden">
              {rest.map((c) => (
                <li key={c.slug}>
                  <Link href={`/courses/${c.slug}`} className="flex items-center gap-4 p-5 transition-colors hover:bg-tint/[0.025]">
                    <Cover code={c.code} hue={c.hue} className="h-14 w-14 shrink-0 rounded-xl [&>span:last-child]:hidden" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{c.title}</p>
                      <p className="mt-1 text-xs text-faint">
                        {c.hours} h, {lessonCount(c)} lessons, {c.level.toLowerCase()}
                      </p>
                    </div>
                    <span className="tnum hidden items-center gap-1 text-sm text-muted sm:flex">
                      <Star size={13} className="fill-amber text-amber" /> {c.rating}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Live + mentor ---------- */}
      <section className="px-4 pt-32 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass p-7 sm:p-9">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Radio size={16} className="text-orchid" /> {t("Expert-led live classes")}
            </div>
            <h2 className="font-display mt-4 text-2xl font-semibold tracking-tight">{t("When the rules change, an expert explains them that week")}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
              {t(
                "Every subscriber is notified when a session is scheduled. Recordings come with an AI transcript, lecture notes and slides, produced on the same pipeline the rest of the academy uses.",
              )}
            </p>
            <ul className="mt-7 space-y-2">
              {upcoming.map((l) => (
                <li key={l.id} className="glass-inset flex items-center gap-4 px-4 py-3">
                  {l.status === "live" ? (
                    <Badge tone="rose" dot>
                      {t("Live")}
                    </Badge>
                  ) : (
                    <span className="tnum w-24 shrink-0 text-xs text-faint">{fmtDateTime(l.start)}</span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{l.title}</p>
                    <p className="text-xs text-faint">{l.expert}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <figure className="glass flex flex-col p-7 sm:p-9">
            <figcaption className="text-sm text-muted">{t("From a mentor's monthly report")}</figcaption>
            <blockquote className="mt-5 flex-1 text-[1.02rem] leading-relaxed">&ldquo;{report.summary}&rdquo;</blockquote>
            <div className="mt-7 flex items-center gap-3">
              <Avatar name={report.author} size={38} />
              <div className="text-sm">
                <p className="font-semibold">{report.author}</p>
                <p className="text-xs text-faint">{t("Mentor, licensed C&F agent")}</p>
              </div>
            </div>
          </figure>
        </div>
      </section>

      {/* ---------- Pricing teaser ---------- */}
      <section className="px-4 pt-32 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#0f1433] p-8 text-white sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <h2 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight">{t("One subscription covers courses, the lab, exams and live classes")}</h2>
              <p className="mt-3 text-white/65">{t("Pay with bKash, Nagad, card or bank transfer. Firms get one invoice for every seat.")}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {plans.map((p) => (
                <Link
                  key={p.id}
                  href="/pricing"
                  className={`rounded-2xl border p-5 transition-colors ${p.id === "professional" ? "border-white/30 bg-white/12" : "border-white/12 bg-white/[0.04] hover:bg-white/[0.08]"}`}
                >
                  <p className="text-sm font-semibold">{t(p.name)}</p>
                  <p className="tnum font-display mt-3 text-2xl font-semibold">{n(fmtBDT(p.price))}</p>
                  <p className="text-xs text-white/55">
                    {t("per")} {t(p.period)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function AgentDiagram() {
  const { t } = useT();
  const node = "rounded-2xl border border-line bg-white px-4 py-3.5 text-center";
  return (
    <div
      className="glass relative p-6 sm:p-9"
      role="img"
      aria-label="Diagram: learner answers flow from the Simulator and Examiner agents to the Evaluation Engine, then to a human examiner when confidence is low"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className={node}>
          <p className="text-sm font-semibold">{t("Examiner Agent")}</p>
          <p className="mt-0.5 text-xs text-faint">sets questions</p>
        </div>
        <div className={node}>
          <p className="text-sm font-semibold">{t("Simulator Agent")}</p>
          <p className="mt-0.5 text-xs text-faint">runs the case</p>
        </div>
      </div>
      <svg viewBox="0 0 400 60" className="my-1 w-full" aria-hidden>
        <path d="M100 0 C100 35, 200 25, 200 60" stroke="#4646e8" strokeOpacity=".35" strokeWidth="1.5" fill="none" />
        <path d="M300 0 C300 35, 200 25, 200 60" stroke="#4646e8" strokeOpacity=".35" strokeWidth="1.5" fill="none" />
      </svg>
      <div className="mx-auto max-w-[260px] rounded-2xl bg-indigo px-4 py-4 text-center text-white">
        <p className="text-sm font-semibold">{t("Evaluation Engine")}</p>
        <p className="mt-0.5 text-xs text-white/70">scores against the rubric</p>
      </div>
      <svg viewBox="0 0 400 40" className="my-1 w-full" aria-hidden>
        <path d="M200 0 V40" stroke="#4646e8" strokeOpacity=".4" strokeWidth="1.5" strokeDasharray="4 4" />
      </svg>
      <div className="grid grid-cols-2 gap-4">
        <div className={node}>
          <p className="text-sm font-semibold">Your result</p>
          <p className="mt-0.5 text-xs text-faint">score and feedback</p>
        </div>
        <div className={`${node} !border-amber/40`}>
          <p className="text-sm font-semibold">Human examiner</p>
          <p className="mt-0.5 text-xs text-faint">when confidence is low</p>
        </div>
      </div>
    </div>
  );
}
