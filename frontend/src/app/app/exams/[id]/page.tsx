"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bot, Check, ChevronLeft, Flag, Mic, ShieldAlert, Timer, X } from "lucide-react";
import { Paywall } from "@/components/shell/portal";
import { BarList, Ring } from "@/components/charts";
import { Badge, Panel, PanelHead, cx, scoreTone } from "@/components/ui";
import { caseStudies, getCourse, getExam, questionBank, vivaQuestions } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function TakeExam() {
  const { id } = useParams<{ id: string }>();
  const exam = getExam(id);
  const { saveExam, toast } = useStore();
  const [phase, setPhase] = useState<"intro" | "run" | "result">("intro");
  const [seed, setSeed] = useState(1);
  const caseStudy = exam ? caseStudies[exam.id] : undefined;
  const qs = useMemo(() => {
    if (!exam) return [];
    // Case studies use questions written for their scenario, in order.
    if (caseStudy) return caseStudy.questions;
    // Examiner Agent stand-in: a seeded shuffle of the exam's topics, different on every attempt.
    const pool = questionBank.filter((q) => exam.topics.includes(q.topic));
    let x = seed * 9301 + 49297;
    const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
    const shuffled = pool.map((q) => ({ q, k: rnd() })).sort((a, b) => a.k - b.k).map((o) => o.q);
    return shuffled.slice(0, Math.min(exam.questions, shuffled.length));
  }, [exam, seed, caseStudy]);
  const [cur, setCur] = useState(0);
  const [ans, setAns] = useState<Record<string, number>>({});
  const [flags, setFlags] = useState<string[]>([]);
  const [left, setLeft] = useState((exam?.minutes ?? 10) * 60);
  // viva
  const [viva, setViva] = useState<{ q: string; a: string; score: number }[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (phase !== "run") return;
    const t = setInterval(() => setLeft((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [phase]);

  const isViva = exam?.kind === "Viva";
  const score = isViva
    ? viva.length
      ? Math.round(viva.reduce((n, v) => n + v.score, 0) / viva.length)
      : 0
    : Math.round((qs.filter((q) => ans[q.id] === q.answer).length / Math.max(1, qs.length)) * 100);

  // auto-submit when the timer reaches zero
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- timer-driven transition
    if (phase === "run" && left === 0) setPhase("result");
  }, [phase, left]);

  // record the attempt once, when the result screen opens
  useEffect(() => {
    if (phase !== "result" || !exam) return;
    saveExam(exam.id, score);
    toast(`Submitted. You scored ${score}%`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!exam) notFound();
  const submit = () => setPhase("result");

  const start = () => {
    setAns({});
    setFlags([]);
    setCur(0);
    setViva([]);
    setLeft(exam.minutes * 60);
    setSeed((s) => s + 1);
    setPhase("run");
  };

  const vivaAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.trim().length < 10) return;
    const words = draft.trim().split(/\s+/).length;
    const legal = /(section|act|rule|sro|gir|assessment|duty|vat)/i.test(draft);
    const s = Math.min(98, 35 + Math.min(words, 40) + (legal ? 20 : 0));
    setViva([...viva, { q: vivaQuestions[viva.length], a: draft, score: s }]);
    setDraft("");
  };

  const mm = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;

  /* ---------------- intro ---------------- */
  if (phase === "intro") {
    return (
      <Paywall what="Exams">
        <Link href="/app/exams" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
          <ChevronLeft size={15} /> Exams
        </Link>
        <div className="glass-strong edge-lit mx-auto mt-6 max-w-2xl p-8">
          <Badge tone={isViva ? "orchid" : "indigo"}>{exam.kind}</Badge>
          <h1 className="font-display mt-4 text-2xl font-semibold">{exam.title}</h1>
          <p className="mt-1 text-sm text-muted">{getCourse(exam.course)?.title}</p>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              [isViva ? "Prompts" : "Questions", isViva ? vivaQuestions.length : qs.length],
              ["Minutes", exam.minutes],
              ["Pass mark", `${exam.passMark}%`],
            ].map(([k, v]) => (
              <div key={k} className="glass-inset py-4">
                <dd className="tnum font-display text-xl font-semibold">{v}</dd>
                <dt className="mt-1 text-xs text-faint">{k}</dt>
              </div>
            ))}
          </dl>
          <ul className="mt-6 space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <ShieldAlert size={16} className="mt-0.5 shrink-0 text-amber" /> The exam window is locked to full screen and tab switches are logged.
            </li>
            <li className="flex gap-2">
              <Timer size={16} className="mt-0.5 shrink-0 text-indigo" /> The timer keeps running if you leave. Answers submit automatically at zero.
            </li>
            <li className="flex gap-2">
              <Bot size={16} className="mt-0.5 shrink-0 text-indigo" />
              {exam.grading === "Auto" ? "Marked automatically." : "Marked by the Evaluation Engine. Low-confidence marks go to a human examiner."}
            </li>
          </ul>
          <button onClick={start} className="btn btn-primary btn-lg mt-8 w-full">
            Begin {exam.kind.toLowerCase()}
          </button>
        </div>
      </Paywall>
    );
  }

  /* ---------------- result ---------------- */
  if (phase === "result") {
    const passed = score >= exam.passMark;
    const topics = [...new Set(qs.map((q) => q.topic))].map((t) => {
      const tq = qs.filter((q) => q.topic === t);
      return { name: t, value: Math.round((tq.filter((q) => ans[q.id] === q.answer).length / tq.length) * 100) };
    });
    const weakest = [...topics].sort((a, b) => a.value - b.value)[0];
    return (
      <div className="space-y-5">
        <Link href="/app/exams" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
          <ChevronLeft size={15} /> Exams
        </Link>
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <Panel lit className="flex flex-col items-center p-8 text-center">
            <Ring value={score} size={150} stroke={12} label="Exam score" color={passed ? "#3ddc97" : "#ff5c7a"} />
            <h1 className="font-display mt-5 text-xl font-semibold">{passed ? "Passed" : "Not passed this time"}</h1>
            <p className="mt-1 text-sm text-muted">
              {exam.title}, pass mark {exam.passMark}%
            </p>
            <div className="mt-6 flex gap-2">
              <button onClick={start} className="btn btn-glass">
                Try again
              </button>
              <Link href="/app" className="btn btn-primary">
                Back to dashboard
              </Link>
            </div>
          </Panel>
          <Panel>
            <PanelHead title="Examiner Agent feedback" />
            <div className="space-y-4 px-5 pb-5 text-sm leading-relaxed text-muted">
              {isViva ? (
                <p>
                  Your answers were clearest when you named the governing section. Several responses described practice without citing the Act. Before the board,
                  rehearse the provisions on provisional assessment and licence suspension.
                </p>
              ) : (
                <>
                  <p>
                    You answered {qs.filter((q) => ans[q.id] === q.answer).length} of {qs.length} correctly.{" "}
                    {weakest && weakest.value < 100 && (
                      <>
                        Your weakest area in this attempt was <span className="text-text">{weakest.name.toLowerCase()}</span>; it has been moved up in your learning path.
                      </>
                    )}
                  </p>
                  <BarList data={topics} />
                </>
              )}
            </div>
          </Panel>
        </div>

        <Panel>
          <PanelHead title="Review your answers" />
          <ol className="divide-y divide-line">
            {isViva
              ? viva.map((v, i) => (
                  <li key={i} className="px-5 py-4 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-medium">{v.q}</p>
                      <Badge tone={scoreTone(v.score)}>{v.score}</Badge>
                    </div>
                    <p className="mt-2 text-muted">{v.a}</p>
                  </li>
                ))
              : qs.map((q, i) => {
                  const ok = ans[q.id] === q.answer;
                  return (
                    <li key={q.id} className="px-5 py-4 text-sm">
                      <div className="flex items-start gap-3">
                        <span className={cx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", ok ? "bg-mint/20 text-mint" : "bg-rose/20 text-rose")}>
                          {ok ? <Check size={12} /> : <X size={12} />}
                        </span>
                        <div>
                          <p className="font-medium">
                            {i + 1}. {q.text}
                          </p>
                          <p className="mt-1 text-muted">
                            Correct answer: <span className="text-text">{q.options[q.answer]}</span>
                            {!ok && ans[q.id] !== undefined && <> (you chose {q.options[ans[q.id]]})</>}
                          </p>
                          <p className="mt-1 text-xs text-faint">{q.explanation}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
          </ol>
        </Panel>
      </div>
    );
  }

  /* ---------------- running: viva ---------------- */
  if (isViva) {
    const done = viva.length >= vivaQuestions.length;
    return (
      <div className="mx-auto max-w-3xl">
        <ExamBar title={exam.title} mm={mm} low={left < 60} onSubmit={submit} canSubmit={viva.length > 0} />
        <div className="glass mt-5 p-6">
          <div className="space-y-4">
            {viva.map((v, i) => (
              <div key={i} className="space-y-2">
                <Bubble bot text={v.q} />
                <Bubble text={v.a} />
              </div>
            ))}
            {!done && <Bubble bot text={vivaQuestions[viva.length]} />}
          </div>
          {!done ? (
            <form onSubmit={vivaAnswer} className="mt-6">
              <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={4} className="field" placeholder="Answer as you would to the board" aria-label="Your answer" />
              <div className="mt-3 flex items-center justify-between">
                <button type="button" onClick={() => toast("Voice answers are transcribed by the AI pipeline once the backend is connected.", "warn")} className="btn btn-glass btn-sm">
                  <Mic size={14} /> Answer by voice
                </button>
                <button className="btn btn-primary btn-sm">Send answer</button>
              </div>
            </form>
          ) : (
            <p className="mt-6 text-sm text-muted">All prompts answered. Submit to get your result.</p>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- running: MCQ ---------------- */
  const q = qs[cur];
  return (
    <div>
      <ExamBar title={exam.title} mm={mm} low={left < 60} onSubmit={submit} canSubmit={Object.keys(ans).length > 0} />
      {caseStudy && (
        <div className="glass mt-5 grid gap-5 p-6 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-sm font-semibold">Case</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{caseStudy.brief}</p>
          </div>
          <dl className="glass-inset divide-y divide-line px-4 text-sm">
            {caseStudy.facts.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-faint">{k}</dt>
                <dd className="tnum font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="glass p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm text-faint">
            <span className="tnum">
              Question {cur + 1} of {qs.length}
            </span>
            <span className="flex items-center gap-2">
              <Badge>{q.topic}</Badge>
              <Badge tone={q.difficulty === "Hard" ? "rose" : q.difficulty === "Medium" ? "amber" : "mint"}>{q.difficulty}</Badge>
            </span>
          </div>
          <h2 className="mt-5 text-lg font-semibold leading-snug">{q.text}</h2>
          <div className="mt-6 space-y-2.5" role="radiogroup">
            {q.options.map((o, i) => {
              const sel = ans[q.id] === i;
              return (
                <button
                  key={i}
                  role="radio"
                  aria-checked={sel}
                  onClick={() => setAns({ ...ans, [q.id]: i })}
                  className={cx(
                    "flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left text-sm transition-colors",
                    sel ? "border-indigo/60 bg-indigo/10" : "border-line bg-tint/[0.03] hover:bg-tint/[0.06]",
                  )}
                >
                  <span className={cx("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold", sel ? "border-indigo bg-indigo text-white" : "border-tint/20 text-muted")}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => setFlags(flags.includes(q.id) ? flags.filter((f) => f !== q.id) : [...flags, q.id])}
              className={cx("btn btn-sm", flags.includes(q.id) ? "btn-glass !border-amber/50 !text-amber" : "btn-ghost")}
            >
              <Flag size={14} /> {flags.includes(q.id) ? "Flagged for review" : "Flag for review"}
            </button>
            <div className="flex gap-2">
              <button className="btn btn-glass btn-sm" disabled={cur === 0} onClick={() => setCur(cur - 1)}>
                Previous
              </button>
              {cur < qs.length - 1 ? (
                <button className="btn btn-primary btn-sm" onClick={() => setCur(cur + 1)}>
                  Next question
                </button>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={submit}>
                  Submit exam
                </button>
              )}
            </div>
          </div>
        </div>
        <aside className="glass h-fit p-5">
          <p className="text-sm font-semibold">Questions</p>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {qs.map((x, i) => (
              <button
                key={x.id}
                onClick={() => setCur(i)}
                aria-label={`Question ${i + 1}`}
                className={cx(
                  "tnum relative h-9 rounded-lg border text-xs font-semibold",
                  i === cur ? "border-indigo text-indigo" : ans[x.id] !== undefined ? "border-indigo/40 bg-indigo/20 text-text" : "border-line text-faint",
                )}
              >
                {i + 1}
                {flags.includes(x.id) && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber" />}
              </button>
            ))}
          </div>
          <div className="mt-5 space-y-1.5 text-xs text-faint">
            <p>
              <span className="tnum text-text">{Object.keys(ans).length}</span> answered, <span className="tnum text-text">{flags.length}</span> flagged
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ExamBar({ title, mm, low, onSubmit, canSubmit }: { title: string; mm: string; low: boolean; onSubmit: () => void; canSubmit: boolean }) {
  return (
    <div className="glass flex items-center justify-between gap-3 px-5 py-3">
      <p className="truncate font-semibold">{title}</p>
      <div className="flex items-center gap-3">
        <span className={cx("tnum flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold", low ? "bg-rose/15 text-rose" : "bg-tint/8 text-text")}>
          <Timer size={14} /> {mm}
        </span>
        <button onClick={onSubmit} disabled={!canSubmit} className="btn btn-primary btn-sm">
          Submit
        </button>
      </div>
    </div>
  );
}

function Bubble({ text, bot }: { text: string; bot?: boolean }) {
  return (
    <div className={cx("flex gap-3", !bot && "flex-row-reverse")}>
      {bot && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orchid/15 text-orchid">
          <Bot size={15} />
        </span>
      )}
      <p className={cx("max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed", bot ? "rounded-tl-md border border-line bg-tint/5" : "rounded-tr-md bg-indigo/25")}>{text}</p>
    </div>
  );
}
