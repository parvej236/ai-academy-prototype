"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, ChevronLeft, Download, Lock, Pause, Play, Sparkles, Volume2, Maximize } from "lucide-react";
import { Badge, Bar, Tabs, cx, kindIcon } from "@/components/ui";
import { documents, getCourse, lessonCount } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Player() {
  const { slug } = useParams<{ slug: string }>();
  const c = getCourse(slug);
  const { completed, toggleLesson, hasAccess, toast, user } = useStore();
  const lessons = c?.modules.flatMap((m) => m.lessons) ?? [];
  const done = completed[slug] ?? [];
  const [active, setActive] = useState(() => lessons.find((l) => !done.includes(l.id))?.id ?? lessons[0]?.id);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [tab, setTab] = useState<"notes" | "transcript" | "resources" | "ask">("notes");
  const [q, setQ] = useState("");
  const [answers, setAnswers] = useState<{ q: string; a: string }[]>([]);

  const lesson = lessons.find((l) => l.id === active) ?? lessons[0];
  const total = (lesson?.minutes ?? 1) * 60;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => Math.min(total, x + 7)), 250);
    return () => clearInterval(id);
  }, [playing, total]);

  if (!c || !lesson) notFound();

  const locked = !hasAccess && !lesson.preview;
  const idx = lessons.findIndex((l) => l.id === lesson.id);
  const pct = Math.round((done.length / lessonCount(c)) * 100);
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const pick = (id: string) => {
    setActive(id);
    setT(0);
    setPlaying(false);
  };
  const completeAndNext = () => {
    if (!done.includes(lesson.id)) toggleLesson(slug, lesson.id);
    toast(`Marked "${lesson.title}" complete`);
    if (idx < lessons.length - 1) pick(lessons[idx + 1].id);
  };
  const ask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setAnswers([
      ...answers,
      {
        q,
        a: `Based on this lesson: ${lesson.title.toLowerCase()} is assessed against the legal notes first. In practice, cite the rule, the note you relied on, and the heading text. If the officer disagrees, ask for the reasoning in writing so you can respond formally.`,
      },
    ]);
    setQ("");
  };

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/app/courses" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
            <ChevronLeft size={15} /> My courses
          </Link>
          <h1 className="mt-1 truncate text-lg font-semibold">{c.title}</h1>
        </div>
        <div className="flex w-48 items-center gap-3">
          <Bar value={pct} className="flex-1" />
          <span className="tnum text-sm text-muted">{pct}%</span>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-5">
          {/* player */}
          <div className="glass overflow-hidden">
            <div className="relative aspect-video on-dark bg-[#0a0f33]">
              {locked ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <Lock className="text-indigo" />
                  <p className="mt-3 font-semibold">This lesson is part of the paid course</p>
                  <p className="mt-1 text-sm text-muted">Preview lessons are free. Subscribe to watch the rest.</p>
                  <Link href="/pricing" className="btn btn-primary mt-5">
                    See plans
                  </Link>
                </div>
              ) : (
                <>
                  <div
                    className="absolute inset-0"
                    style={{ background: `hsl(${c.hue} 42% 18%)` }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-center p-8 sm:p-14">
                    <p className="text-sm text-muted">{c.instructor}</p>
                    <p className="font-display mt-2 max-w-xl text-xl font-semibold sm:text-3xl">{lesson.title}</p>
                  </div>
                  <span className="pointer-events-none absolute right-4 top-4 text-[0.7rem] text-white/25">{user?.email}</span>
                  {!playing && (
                    <button onClick={() => setPlaying(true)} className="absolute inset-0 flex items-center justify-center" aria-label="Play">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-tint/25 bg-tint/10 backdrop-blur-md transition-transform hover:scale-105">
                        <Play className="ml-1" fill="currentColor" />
                      </span>
                    </button>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/45 px-4 pb-3 pt-10">
                    <input
                      type="range"
                      min={0}
                      max={total}
                      value={t}
                      onChange={(e) => setT(+e.target.value)}
                      className="w-full"
                      aria-label="Seek"
                    />
                    <div className="mt-1 flex items-center gap-3 text-sm">
                      <button onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause" : "Play"}>
                        {playing ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <Volume2 size={17} className="text-muted" />
                      <span className="tnum text-xs text-muted">
                        {mmss(t)} / {mmss(total)}
                      </span>
                      <span className="ml-auto text-xs text-muted">1×</span>
                      <Maximize size={16} className="text-muted" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-xs text-faint">
                  Lesson {idx + 1} of {lessons.length}, {lesson.minutes} min
                </p>
                <p className="font-semibold">{lesson.title}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-glass btn-sm" disabled={idx === 0} onClick={() => pick(lessons[idx - 1].id)}>
                  Previous
                </button>
                <button className="btn btn-primary btn-sm" disabled={locked} onClick={completeAndNext}>
                  {done.includes(lesson.id) ? "Next lesson" : "Mark complete and continue"}
                </button>
              </div>
            </div>
          </div>

          {/* tabs */}
          <div className="glass p-5">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: "notes", label: "AI lecture notes" },
                { id: "transcript", label: "Transcript" },
                { id: "resources", label: "Resources" },
                { id: "ask", label: "Ask about this lesson" },
              ]}
            />
            <div className="mt-5 text-sm leading-relaxed">
              {tab === "notes" && (
                <div className="max-w-3xl space-y-3">
                  <p className="flex items-center gap-2 text-xs text-faint">
                    <Sparkles size={13} className="text-orchid" /> Generated from the lesson transcript and reviewed by the instructor
                  </p>
                  <ul className="list-disc space-y-2 pl-5 text-muted marker:text-indigo">
                    <li>Start with the legal text: heading terms and section or chapter notes decide most cases.</li>
                    <li>Bangladesh adds two national digits to the six-digit HS code; the operative tariff for FY27 is the reference.</li>
                    <li>Record the reasoning you used. An assessing officer will ask for it, and the Bill of Entry can&apos;t be amended for free once assessed.</li>
                    <li>When in doubt, apply for an advance ruling before shipment rather than arguing at the port.</li>
                  </ul>
                </div>
              )}
              {tab === "transcript" && (
                <div className="max-w-3xl space-y-3 text-muted">
                  {[
                    ["00:00", "Welcome back. In this lesson we work through the structure of the tariff before touching any rules."],
                    ["01:12", "There are 21 sections and 97 chapters. Chapter 77 is reserved, so you'll never see it used."],
                    ["03:40", "The legal notes carry the same weight as the heading text. That's GIR 1, and it's the rule people skip."],
                    ["06:05", "Let's open the Bangladesh operative tariff and find heading 84.71 together."],
                  ].map(([ts, line]) => (
                    <p key={ts} className="flex gap-4">
                      <button className="tnum shrink-0 text-indigo hover:underline" onClick={() => setT(+ts.split(":")[0] * 60 + +ts.split(":")[1])}>
                        {ts}
                      </button>
                      {line}
                    </p>
                  ))}
                </div>
              )}
              {tab === "resources" && (
                <ul className="divide-y divide-line">
                  {documents.filter((d) => d.access !== "Examiners only").slice(0, 4).map((d) => (
                    <li key={d.id} className="flex items-center justify-between gap-4 py-3">
                      <span>
                        {d.name}
                        <span className="ml-2 text-xs text-faint">{d.size}</span>
                      </span>
                      <button className="btn btn-ghost btn-sm" onClick={() => toast(`Downloading ${d.name}`)}>
                        <Download size={14} /> Download
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {tab === "ask" && (
                <div className="max-w-3xl">
                  <div className="space-y-4">
                    {answers.map((a, i) => (
                      <div key={i} className="space-y-2">
                        <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-indigo/25 px-4 py-2.5">{a.q}</p>
                        <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-md border border-line bg-tint/5 px-4 py-2.5 text-muted">{a.a}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={ask} className="mt-4 flex gap-2">
                    <input value={q} onChange={(e) => setQ(e.target.value)} className="field !rounded-full" placeholder="e.g. Does a chapter note override GIR 3?" />
                    <button className="btn btn-primary">Ask</button>
                  </form>
                  <p className="mt-2 text-xs text-faint">Answers come only from this course&apos;s material. For case-specific advice, ask your mentor.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* curriculum */}
        <aside className="glass h-fit overflow-hidden xl:sticky xl:top-24">
          <p className="border-b border-line px-5 py-4 text-sm font-semibold">Course content</p>
          <div className="thin-scroll max-h-[70vh] overflow-y-auto">
            {c.modules.map((m) => (
              <div key={m.title} className="border-b border-line last:border-0">
                <p className="px-5 pb-1 pt-4 text-xs font-semibold text-faint">{m.title}</p>
                <ul className="pb-2">
                  {m.lessons.map((l) => {
                    const Icon = kindIcon[l.kind];
                    const isDone = done.includes(l.id);
                    const isLocked = !hasAccess && !l.preview;
                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => pick(l.id)}
                          className={cx("flex w-full items-center gap-3 px-5 py-2.5 text-left text-[0.84rem] transition-colors", l.id === lesson.id ? "bg-tint/[0.07]" : "hover:bg-tint/[0.03]")}
                        >
                          <span
                            role="checkbox"
                            aria-checked={isDone}
                            aria-label={`Mark ${l.title} complete`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isLocked) toggleLesson(slug, l.id);
                            }}
                            className={cx("flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border", isDone ? "border-mint bg-mint/20 text-mint" : "border-tint/20")}
                          >
                            {isDone && <Check size={12} />}
                          </span>
                          <span className={cx("flex-1", l.id === lesson.id && "text-text", isDone && l.id !== lesson.id && "text-muted")}>{l.title}</span>
                          {isLocked ? <Lock size={12} className="text-faint" /> : <Icon size={14} className="text-faint" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          {pct === 100 && (
            <div className="border-t border-line p-4">
              <Badge tone="mint">Course complete</Badge>
              <Link href="/app/certificates" className="btn btn-primary btn-sm mt-3 w-full">
                Get your certificate
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
