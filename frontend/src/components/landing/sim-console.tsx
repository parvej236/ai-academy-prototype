"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { labCases } from "@/lib/data";
import { Badge, cx } from "@/components/ui";

/* A playable slice of the practical lab: the first question from the
   laptop case, with the Evaluation Engine's verdict. */
export function SimConsole() {
  const c = labCases[0];
  const step = c.steps[0];
  const [pick, setPick] = useState<number | null>(null);
  const chosen = pick !== null ? step.options[pick] : null;

  return (
    <div className="glass-strong edge-lit relative overflow-hidden">
      {/* title bar */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="live-dot h-2 w-2 rounded-full bg-mint" />
          <span className="text-[0.8rem] font-semibold">Simulator Agent</span>
          <span className="hidden text-[0.8rem] text-faint sm:inline">{c.port}</span>
        </div>
        <Badge tone="amber">{c.difficulty}</Badge>
      </div>

      <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
        {/* the document */}
        <div className="border-b border-line p-5 md:border-b-0 md:border-r">
          <p className="text-[0.75rem] text-faint">Examination report</p>
          <dl className="mt-3 space-y-2.5 text-[0.82rem]">
            {c.docs[2].rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-faint">{k}</dt>
                <dd className="text-text">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 rounded-xl border border-amber/25 bg-amber/[0.07] px-3 py-2 text-[0.78rem] text-amber">Declared under 8473.30.00 as parts</div>
        </div>

        {/* the conversation */}
        <div className="flex flex-col p-5">
          <p className="text-[0.75rem] text-faint">{step.officer}</p>
          <p className="mt-1.5 text-[0.92rem] leading-relaxed">{step.prompt}</p>

          <div className="mt-4 space-y-2">
            {step.options.map((o, i) => {
              const isPick = pick === i;
              const best = o.score === 100;
              return (
                <button
                  key={i}
                  disabled={pick !== null}
                  onClick={() => setPick(i)}
                  className={cx(
                    "w-full rounded-xl border px-3.5 py-2.5 text-left text-[0.8rem] leading-snug transition-colors",
                    pick === null && "border-line bg-tint/[0.03] hover:border-indigo/40 hover:bg-indigo/[0.06]",
                    pick !== null && isPick && best && "border-mint/50 bg-mint/10",
                    pick !== null && isPick && !best && "border-rose/40 bg-rose/10",
                    pick !== null && !isPick && best && "border-mint/30 bg-transparent",
                    pick !== null && !isPick && !best && "border-line opacity-50",
                  )}
                >
                  {o.text}
                </button>
              );
            })}
          </div>

          {chosen && (
            <div className="pop mt-4 rounded-xl border border-line bg-tint/[0.04] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[0.75rem] text-faint">Evaluation Engine on {step.criterion.toLowerCase()}</span>
                <span className={cx("tnum font-display text-lg font-semibold", chosen.score >= 75 ? "text-mint" : chosen.score >= 40 ? "text-amber" : "text-rose")}>
                  {chosen.score}
                </span>
              </div>
              <p className="mt-1.5 flex gap-2 text-[0.8rem] text-muted">
                {chosen.score === 100 && <Check size={14} className="mt-0.5 shrink-0 text-mint" />}
                {chosen.feedback}
              </p>
              <button onClick={() => setPick(null)} className="mt-2.5 inline-flex items-center gap-1.5 text-[0.75rem] text-indigo hover:underline">
                <RotateCcw size={12} /> Try another answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
