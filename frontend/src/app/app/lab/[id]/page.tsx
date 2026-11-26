"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bot, ChevronLeft, FileText, RotateCcw, Send } from "lucide-react";
import { Paywall } from "@/components/shell/portal";
import { Ring } from "@/components/charts";
import { Avatar, Badge, Bar, Tabs, cx, scoreTone } from "@/components/ui";
import { getCase } from "@/lib/data";
import { useStore } from "@/lib/store";

type Msg = { from: "officer" | "you" | "engine"; text: string; score?: number; criterion?: string };

export default function LabSession() {
  const { id } = useParams<{ id: string }>();
  const c = getCase(id);
  const { user, saveLab, toast } = useStore();
  const [doc, setDoc] = useState(0);
  const [step, setStep] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(true);
  const [scores, setScores] = useState<{ criterion: string; score: number }[]>([]);
  const [free, setFree] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const finished = c ? step >= c.steps.length : false;

  // officer "types" the first question
  useEffect(() => {
    if (!c) return;
    const t = setTimeout(() => {
      setMsgs([{ from: "officer", text: c.steps[0].prompt }]);
      setTyping(false);
    }, 900);
    return () => clearTimeout(t);
  }, [c]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, typing]);

  if (!c) notFound();

  const total = (() => {
    if (!scores.length) return 0;
    const byCrit = c.criteria.map((cr) => {
      const s = scores.filter((x) => x.criterion === cr.name);
      return { w: cr.weight, v: s.length ? s.reduce((n, x) => n + x.score, 0) / s.length : null };
    });
    const answered = byCrit.filter((b) => b.v !== null);
    const w = answered.reduce((n, b) => n + b.w, 0);
    return Math.round(answered.reduce((n, b) => n + (b.v as number) * b.w, 0) / w);
  })();

  const answer = (text: string, score: number, feedback: string) => {
    const s = c.steps[step];
    const nextScores = [...scores, { criterion: s.criterion, score }];
    setScores(nextScores);
    setMsgs((m) => [...m, { from: "you", text }, { from: "engine", text: feedback, score, criterion: s.criterion }]);
    setTyping(true);
    const next = step + 1;
    setTimeout(() => {
      setTyping(false);
      setStep(next);
      if (next < c.steps.length) {
        setMsgs((m) => [...m, { from: "officer", text: c.steps[next].prompt }]);
      } else {
        setMsgs((m) => [...m, { from: "officer", text: "Thank you. I have what I need. The assessment will be recorded." }]);
      }
    }, 1100);
  };

  const submitFree = (e: React.FormEvent) => {
    e.preventDefault();
    if (free.trim().length < 15) return toast("Write a fuller answer: name the rule and the heading.", "warn");
    // crude stand-in for the Evaluation Engine: reward legal references
    const t = free.toLowerCase();
    const hits = ["gir", "section", "8471", "heading", "essential character", "amend", "transaction value", "evidence", "consult"].filter((k) => t.includes(k)).length;
    const score = Math.min(100, 30 + hits * 18);
    answer(free, score, score >= 75 ? "Well reasoned and grounded in the law." : "Partly right. Cite the specific rule or section the officer will rely on.");
    setFree("");
  };

  const finish = () => {
    saveLab(c.id, total);
    toast(`Lab attempt saved with ${total}%`);
  };

  const restart = () => {
    setStep(0);
    setScores([]);
    setMsgs([{ from: "officer", text: c.steps[0].prompt }]);
  };

  return (
    <Paywall what="The practical lab">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/app/lab" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
            <ChevronLeft size={15} /> Practical lab
          </Link>
          <h1 className="mt-1 text-lg font-semibold">{c.title}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <span className="tnum whitespace-nowrap">
            Question {Math.min(step + 1, c.steps.length)} of {c.steps.length}
          </span>
          <Bar value={(Math.min(step, c.steps.length) / c.steps.length) * 100} className="w-32" />
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.3fr_0.75fr]">
        {/* case file */}
        <aside className="glass h-fit p-5 xl:sticky xl:top-24">
          <p className="text-sm font-semibold">Case file</p>
          <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">{c.brief}</p>
          <Tabs className="mt-5" value={String(doc)} onChange={(v) => setDoc(+v)} tabs={c.docs.map((d, i) => ({ id: String(i), label: d.name }))} />
          <div className="glass-inset mt-3 p-4">
            <p className="flex items-center gap-2 text-xs text-faint">
              <FileText size={13} /> {c.docs[doc].name}
            </p>
            <dl className="mt-3 divide-y divide-line text-[0.82rem]">
              {c.docs[doc].rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2">
                  <dt className="text-faint">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>

        {/* conversation */}
        <section className="glass flex min-h-[560px] flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-line px-5 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo/15 text-indigo">
              <Bot size={16} />
            </span>
            <div>
              <p className="text-sm font-semibold">{c.steps[Math.min(step, c.steps.length - 1)].officer}</p>
              <p className="text-xs text-faint">Played by the Simulator Agent at {c.port}</p>
            </div>
          </div>

          <div className="thin-scroll flex-1 space-y-4 overflow-y-auto p-5">
            {msgs.map((m, i) =>
              m.from === "engine" ? (
                <div key={i} className="pop mx-auto flex max-w-[92%] items-start gap-3 rounded-xl border border-line bg-tint/[0.04] px-4 py-3 text-[0.82rem]">
                  <Badge tone={scoreTone(m.score!)}>{m.score}</Badge>
                  <p className="text-muted">
                    <span className="text-faint">Evaluation Engine, {m.criterion?.toLowerCase()}: </span>
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={i} className={cx("pop flex gap-3", m.from === "you" && "flex-row-reverse")}>
                  {m.from === "you" ? (
                    <Avatar name={user?.name ?? "You"} size={30} />
                  ) : (
                    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-indigo/15 text-indigo">
                      <Bot size={15} />
                    </span>
                  )}
                  <p
                    className={cx(
                      "max-w-[80%] rounded-2xl px-4 py-3 text-[0.9rem] leading-relaxed",
                      m.from === "you" ? "rounded-tr-md bg-indigo/25" : "rounded-tl-md border border-line bg-tint/[0.05]",
                    )}
                  >
                    {m.text}
                  </p>
                </div>
              ),
            )}
            {typing && (
              <div className="flex gap-3">
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-indigo/15 text-indigo">
                  <Bot size={15} />
                </span>
                <span className="flex items-center gap-1 rounded-2xl border border-line bg-tint/5 px-4">
                  {[0, 1, 2].map((d) => (
                    <span key={d} className="live-dot h-1.5 w-1.5 rounded-full bg-muted" style={{ animationDelay: `${d * 0.2}s` }} />
                  ))}
                </span>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {!finished && !typing && (
            <div className="border-t border-line p-4">
              <p className="mb-2 text-xs text-faint">Choose a response, or write your own</p>
              <div className="space-y-2">
                {c.steps[step].options.map((o, i) => (
                  <button
                    key={i}
                    onClick={() => answer(o.text, o.score, o.feedback)}
                    className="w-full rounded-xl border border-line bg-tint/[0.03] px-4 py-2.5 text-left text-[0.84rem] leading-snug transition-colors hover:border-indigo/40 hover:bg-indigo/[0.06]"
                  >
                    {o.text}
                  </button>
                ))}
              </div>
              <form onSubmit={submitFree} className="mt-3 flex gap-2">
                <input value={free} onChange={(e) => setFree(e.target.value)} className="field !rounded-full" placeholder="Type your answer to the officer" aria-label="Your answer" />
                <button className="btn btn-primary !px-3" aria-label="Send">
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}
          {finished && !typing && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4">
              <p className="text-sm text-muted">Case complete. Save the attempt to add it to your record.</p>
              <div className="flex gap-2">
                <button onClick={restart} className="btn btn-glass btn-sm">
                  <RotateCcw size={14} /> Restart
                </button>
                <button onClick={finish} className="btn btn-primary btn-sm">
                  Save attempt
                </button>
              </div>
            </div>
          )}
        </section>

        {/* live scoring */}
        <aside className="glass h-fit p-5 xl:sticky xl:top-24">
          <p className="text-sm font-semibold">Live score</p>
          <div className="mt-4 flex justify-center">
            <Ring value={total} size={120} label="Lab score" />
          </div>
          <ul className="mt-6 space-y-4">
            {c.criteria.map((cr) => {
              const s = scores.filter((x) => x.criterion === cr.name);
              const v = s.length ? Math.round(s.reduce((n, x) => n + x.score, 0) / s.length) : null;
              return (
                <li key={cr.name}>
                  <div className="mb-1.5 flex justify-between text-[0.8rem]">
                    <span>{cr.name}</span>
                    <span className="tnum text-faint">
                      {v ?? "–"} <span className="text-faint/70">({cr.weight}%)</span>
                    </span>
                  </div>
                  <Bar value={v ?? 0} tone={v === null ? "cyan" : scoreTone(v)} />
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t border-line pt-4">
            <p className="text-xs font-semibold text-muted">Audit trail</p>
            <ol className="mt-2 space-y-1.5 text-xs text-faint">
              <li>Case loaded, {c.docs.length} documents</li>
              {scores.map((s, i) => (
                <li key={i} className="tnum">
                  Answer {i + 1} scored {s.score} on {s.criterion.toLowerCase()}
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </Paywall>
  );
}
