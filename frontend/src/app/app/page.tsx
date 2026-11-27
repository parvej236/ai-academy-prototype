"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Radio, Sparkles } from "lucide-react";
import { BarChart, LineChart, Radar, Ring } from "@/components/charts";
import { Badge, Bar, Cover, Panel, PanelHead, cx, scoreTone } from "@/components/ui";
import { courses, learningPath, lessonCount, liveClasses, recentResults, skills, weeklyActivity } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Dashboard() {
  const { user, enrolled, completed, labResults, examResults } = useStore();
  const my = courses.filter((c) => enrolled.includes(c.slug));
  const pct = (slug: string) => {
    const c = courses.find((x) => x.slug === slug)!;
    return Math.round(((completed[slug]?.length ?? 0) / lessonCount(c)) * 100);
  };
  const current = my.find((c) => pct(c.slug) < 100) ?? my[0];
  const overall = my.length ? Math.round(my.reduce((n, c) => n + pct(c.slug), 0) / my.length) : 0;
  const live = liveClasses.find((l) => l.status === "live");
  const gaps = skills
    .map((s) => ({ ...s, gap: s.score - s.cohort }))
    .sort((a, b) => a.gap - b.gap);
  const avgScore = Math.round(recentResults.reduce((n, r) => n + r.score, 0) / recentResults.length);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold sm:text-[1.7rem]">Good afternoon, {user?.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-muted">You studied 7.1 hours last week, your best week so far.</p>
        </div>
        {live && (
          <Link href={`/app/live/${live.id}`} className="glass flex max-w-full min-w-0 items-center gap-3 !rounded-full py-1.5 pl-2 pr-4 text-sm transition-colors hover:border-rose/40">
            <span className="flex items-center gap-1.5 rounded-full bg-rose/15 px-2.5 py-1 text-xs font-semibold text-rose">
              <Radio size={12} className="live-dot" /> Live
            </span>
            <span className="min-w-0 max-w-[260px] truncate">{live.title}</span>
            <ArrowUpRight size={15} className="shrink-0 text-faint" />
          </Link>
        )}
      </div>

      {/* top row */}
      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        {current && (
          <Panel lit className="overflow-hidden">
            <div className="grid h-full sm:grid-cols-[200px_1fr]">
              <Cover code={current.code} hue={current.hue} category={current.category} className="h-36 sm:h-full" />
              <div className="p-6">
                <h2 className="font-display text-lg font-semibold">{current.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  Next: {current.modules.flatMap((m) => m.lessons).find((l) => !(completed[current.slug] ?? []).includes(l.id))?.title ?? "Course complete"}
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <Bar value={pct(current.slug)} className="flex-1" />
                  <span className="tnum text-sm text-muted">{pct(current.slug)}%</span>
                </div>
                <Link href={`/app/learn/${current.slug}`} className="btn btn-primary mt-5">
                  Resume lesson
                </Link>
              </div>
            </div>
          </Panel>
        )}
        <div className="grid grid-cols-2 gap-5">
          <div className="glass flex flex-col items-center justify-center p-5 text-center">
            <Ring value={overall} size={104} label="Overall progress" />
            <p className="mt-3 text-sm text-muted">Overall progress</p>
          </div>
          <div className="glass flex flex-col justify-between p-5">
            <p className="text-sm text-muted">Average score</p>
            <p className="tnum font-display text-[2rem] font-semibold">{avgScore}%</p>
            <p className="text-xs text-mint">+6 points over 4 weeks</p>
          </div>
          <div className="glass flex flex-col justify-between p-5">
            <p className="text-sm text-muted">Lab cases passed</p>
            <p className="tnum font-display text-[2rem] font-semibold">{Object.values(labResults).filter((r) => r.score >= 60).length}</p>
            <Link href="/app/lab" className="text-xs text-indigo hover:underline">
              Open the lab
            </Link>
          </div>
          <div className="glass flex flex-col justify-between p-5">
            <p className="text-sm text-muted">Exams taken</p>
            <p className="tnum font-display text-[2rem] font-semibold">{Object.keys(examResults).length}</p>
            <Link href="/app/exams" className="text-xs text-indigo hover:underline">
              Next: Mock paper 1
            </Link>
          </div>
        </div>
      </div>

      {/* skills + path */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr_1.1fr]">
        <Panel>
          <PanelHead title="Skill profile" meta="Your scores against learners at the same stage" />
          <div className="px-5 pb-5">
            <Radar data={skills.map((s) => ({ name: s.name, score: s.score, cohort: s.cohort }))} />
          </div>
        </Panel>
        <Panel>
          <PanelHead title="Skill gaps" meta="Points above or below cohort average" />
          <ul className="space-y-1 px-3 pb-4">
            {gaps.map((g) => (
              <li key={g.name} className="flex items-center gap-3 rounded-xl px-2 py-2.5">
                <span className="flex-1 text-sm">{g.name}</span>
                <div className="relative h-1.5 w-24 rounded-full bg-tint/8">
                  <span className="absolute left-1/2 top-[-3px] h-3 w-px bg-tint/30" />
                  <span
                    className={cx("absolute top-0 h-full rounded-full", g.gap < 0 ? "bg-rose" : "bg-mint")}
                    style={g.gap < 0 ? { right: "50%", width: `${Math.min(50, -g.gap * 2.5)}%` } : { left: "50%", width: `${Math.min(50, g.gap * 2.5)}%` }}
                  />
                </div>
                <span className={cx("tnum w-10 text-right text-sm font-semibold", g.gap < 0 ? "text-rose" : "text-mint")}>
                  {g.gap > 0 ? "+" : ""}
                  {g.gap}
                </span>
              </li>
            ))}
          </ul>
          <div className="mx-5 mb-5 flex gap-3 rounded-xl border border-orchid/25 bg-orchid/[0.07] p-3.5 text-[0.82rem]">
            <Sparkles size={16} className="mt-0.5 shrink-0 text-orchid" />
            <p className="text-muted">
              <span className="text-text">Origin</span> and <span className="text-text">valuation</span> are pulling your average down. Your path below now puts them first.
            </p>
          </div>
        </Panel>
        <Panel>
          <PanelHead title="Your learning path" meta="Reordered weekly from your results" />
          <ol className="relative px-5 pb-5">
            {learningPath.map((p, i) => (
              <li key={p.title} className="relative flex gap-4 pb-5 last:pb-0">
                {i < learningPath.length - 1 && <span className="absolute left-[13px] top-7 h-[calc(100%-20px)] w-px bg-line" />}
                <span
                  className={cx(
                    "tnum relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                    p.state === "done" && "border-mint/40 bg-mint/15 text-mint",
                    p.state === "current" && "border-indigo/60 bg-indigo/15 text-indigo",
                    (p.state === "next" || p.state === "later") && "border-line bg-tint/5 text-faint",
                  )}
                >
                  {p.state === "done" ? <Check size={13} /> : i + 1}
                </span>
                <div className="min-w-0 pt-0.5">
                  <Link href={p.href} className={cx("text-sm font-semibold hover:underline", p.state === "later" && "text-muted")}>
                    {p.title}
                  </Link>
                  <p className="text-xs text-faint">{p.reason}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      {/* trends */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHead title="Study hours per week" meta="Last 9 weeks" />
          <div className="px-4 pb-4">
            <BarChart data={weeklyActivity.map((w) => ({ x: w.week, y: w.hours }))} unit=" h" label="Study hours per week" />
          </div>
        </Panel>
        <Panel>
          <PanelHead title="Average assessment score" meta="Rolling, all quizzes, labs and exams" />
          <div className="px-4 pb-4">
            <LineChart data={weeklyActivity.map((w) => ({ x: w.week, y: w.score }))} unit="%" max={100} label="Average assessment score" />
          </div>
        </Panel>
      </div>

      <Panel>
        <PanelHead title="Recent results" action={<Link href="/app/exams" className="btn btn-ghost btn-sm">All results</Link>} />
        <div className="overflow-x-auto">
          <table className="tbl tbl-fit">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Type</th>
                <th>Date</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((r) => (
                <tr key={r.title}>
                  <td className="font-medium">{r.title}</td>
                  <td>
                    <Badge>{r.kind}</Badge>
                  </td>
                  <td className="text-muted">{new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                  <td className="text-right">
                    <Badge tone={scoreTone(r.score)}>{r.score}%</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
