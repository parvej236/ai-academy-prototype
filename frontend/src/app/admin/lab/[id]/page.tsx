"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Plus, Sparkles, Trash2 } from "lucide-react";
import { Panel, PanelHead, StateBadge, Switch, Tabs, cx } from "@/components/ui";
import { getCase, type CaseStep, type LabCase, type PublishState } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function CaseBuilder() {
  const { id } = useParams<{ id: string }>();
  const blank: LabCase = {
    id: "new",
    title: "Untitled case",
    brief: "",
    port: "Chattogram Custom House",
    course: "hs-classification",
    difficulty: "Medium",
    minutes: 20,
    attempts: 0,
    avgScore: 0,
    status: "draft",
    criteria: [
      { name: "Technical reasoning", weight: 50 },
      { name: "Legal basis cited", weight: 30 },
      { name: "Professional conduct", weight: 20 },
    ],
    docs: [{ name: "Commercial invoice", rows: [["Description", ""], ["Quantity", ""], ["Unit price", ""], ["Declared HS", ""]] }],
    steps: [{ officer: "Assistant Commissioner (Assessment)", criterion: "Technical reasoning", prompt: "", options: [{ text: "", score: 100, feedback: "" }] }],
  };
  const c = id === "new" ? blank : getCase(id);
  const { toast } = useStore();
  const [tab, setTab] = useState<"brief" | "steps" | "rubric" | "ai">("brief");
  const [brief, setBrief] = useState(c?.brief ?? "");
  const [docs, setDocs] = useState(() => structuredClone(c?.docs ?? []));
  const [steps, setSteps] = useState<CaseStep[]>(() => structuredClone(c?.steps ?? []));
  const [criteria, setCriteria] = useState(() => structuredClone(c?.criteria ?? []));
  const [ai, setAi] = useState({ persona: "Assistant Commissioner (Assessment)", strictness: 70, temperature: 0.3, followUps: true, groundOnly: true, maxTurns: 6, language: "English" });
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState(c?.title ?? "");
  const [status, setStatus] = useState<PublishState>(c?.status ?? "draft");
  if (!c) notFound();

  const weightTotal = criteria.reduce((n, x) => n + x.weight, 0);

  const updOpt = (si: number, oi: number, patch: Partial<CaseStep["options"][number]>) =>
    setSteps(steps.map((s, i) => (i !== si ? s : { ...s, options: s.options.map((o, j) => (j === oi ? { ...o, ...patch } : o)) })));

  return (
    <div className="space-y-5">
      <Link href="/admin/lab" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
        <ChevronLeft size={15} /> Lab and simulator
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Case builder</h1>
          <div className="mt-2 flex items-center gap-2">
            <input className="field !h-9 w-80 max-w-full font-semibold" value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Case title" />
            <StateBadge state={status} />
          </div>
        </div>
        <div className="flex gap-2">
          {c.id !== "new" && (
            <Link href={`/app/lab/${c.id}`} className="btn btn-glass btn-sm">
              Test as learner
            </Link>
          )}
          <button className="btn btn-glass btn-sm" disabled={weightTotal !== 100} onClick={() => toast("Case saved as draft")}>
            Save draft
          </button>
          {status === "published" ? (
            <button className="btn btn-danger btn-sm" onClick={() => { setStatus("draft"); toast("Case unpublished. Learners can no longer start it.", "warn"); }}>
              Unpublish
            </button>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              disabled={weightTotal !== 100 || steps.length === 0 || !brief.trim()}
              onClick={() => { setStatus("published"); toast("Case published to the practical lab"); }}
            >
              Publish
            </button>
          )}
        </div>
      </div>
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "brief", label: "Brief and documents" },
          { id: "steps", label: `Steps (${steps.length})` },
          { id: "rubric", label: "Rubric" },
          { id: "ai", label: "AI scenario" },
        ]}
      />

      {tab === "brief" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel className="p-5">
            <label className="label" htmlFor="brief">
              Brief shown to the learner
            </label>
            <textarea id="brief" rows={8} className="field" value={brief} onChange={(e) => setBrief(e.target.value)} />
          </Panel>
          <div className="space-y-4">
            {docs.map((d, di) => (
              <Panel key={di}>
                <div className="flex items-center gap-3 px-5 pt-5">
                  <input className="field !h-9 font-semibold" value={d.name} onChange={(e) => setDocs(docs.map((x, i) => (i === di ? { ...x, name: e.target.value } : x)))} aria-label="Document name" />
                  <button className="btn btn-ghost btn-sm !px-2 hover:!text-rose" onClick={() => setDocs(docs.filter((_, i) => i !== di))} aria-label="Remove document">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="space-y-2 p-5">
                  {d.rows.map(([k, v], ri) => (
                    <div key={ri} className="grid grid-cols-[140px_1fr] gap-2">
                      <input
                        className="field !h-8 !text-xs"
                        value={k}
                        onChange={(e) => setDocs(docs.map((x, i) => (i !== di ? x : { ...x, rows: x.rows.map((r, j) => (j === ri ? [e.target.value, r[1]] : r)) })))}
                        aria-label="Field"
                      />
                      <input
                        className="field !h-8 !text-xs"
                        value={v}
                        onChange={(e) => setDocs(docs.map((x, i) => (i !== di ? x : { ...x, rows: x.rows.map((r, j) => (j === ri ? [r[0], e.target.value] : r)) })))}
                        aria-label="Value"
                      />
                    </div>
                  ))}
                  <button className="btn btn-ghost btn-sm" onClick={() => setDocs(docs.map((x, i) => (i === di ? { ...x, rows: [...x.rows, ["Field", ""]] } : x)))}>
                    <Plus size={13} /> Add field
                  </button>
                </div>
              </Panel>
            ))}
            <button className="btn btn-glass btn-sm" onClick={() => setDocs([...docs, { name: "New document", rows: [["Field", ""]] }])}>
              <Plus size={14} /> Add document
            </button>
          </div>
        </div>
      )}

      {tab === "steps" && (
        <div className="space-y-4">
          {steps.map((s, si) => (
            <Panel key={si} className="p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="tnum flex h-7 w-7 items-center justify-center rounded-full bg-indigo/10 text-xs font-semibold text-indigo">{si + 1}</span>
                <input className="field !h-9 max-w-xs" value={s.officer} onChange={(e) => setSteps(steps.map((x, i) => (i === si ? { ...x, officer: e.target.value } : x)))} aria-label="Speaker" />
                <select className="field !h-9 !w-56" value={s.criterion} onChange={(e) => setSteps(steps.map((x, i) => (i === si ? { ...x, criterion: e.target.value } : x)))} aria-label="Rubric criterion">
                  {criteria.map((cr) => (
                    <option key={cr.name}>{cr.name}</option>
                  ))}
                </select>
              </div>
              <label className="label mt-4">Officer&apos;s question</label>
              <textarea rows={2} className="field" value={s.prompt} onChange={(e) => setSteps(steps.map((x, i) => (i === si ? { ...x, prompt: e.target.value } : x)))} />
              <p className="label mt-4">Answer options and model scores</p>
              <div className="space-y-2">
                {s.options.map((o, oi) => (
                  <div key={oi} className="glass-inset grid gap-2 p-3 md:grid-cols-[1fr_90px]">
                    <textarea rows={2} className="field !text-sm" value={o.text} onChange={(e) => updOpt(si, oi, { text: e.target.value })} aria-label="Option" />
                    <input type="number" min={0} max={100} className="field tnum !text-sm" value={o.score} onChange={(e) => updOpt(si, oi, { score: +e.target.value })} aria-label="Score" />
                    <input className="field !h-8 !text-xs md:col-span-2" value={o.feedback} onChange={(e) => updOpt(si, oi, { feedback: e.target.value })} aria-label="Feedback" placeholder="Feedback shown after this answer" />
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm mt-2" onClick={() => setSteps(steps.map((x, i) => (i === si ? { ...x, options: [...x.options, { text: "", score: 0, feedback: "" }] } : x)))}>
                <Plus size={13} /> Add option
              </button>
            </Panel>
          ))}
          <button className="btn btn-glass" onClick={() => setSteps([...steps, { officer: ai.persona, criterion: criteria[0]?.name ?? "", prompt: "", options: [] }])}>
            <Plus size={15} /> Add step
          </button>
        </div>
      )}

      {tab === "rubric" && (
        <Panel className="max-w-2xl">
          <PanelHead title="Scoring rubric" meta="Weights must add up to 100" />
          <div className="space-y-3 px-5 pb-5">
            {criteria.map((cr, i) => (
              <div key={i} className="flex items-center gap-3">
                <input className="field flex-1" value={cr.name} onChange={(e) => setCriteria(criteria.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} aria-label="Criterion" />
                <input type="number" className="field tnum !w-24" value={cr.weight} onChange={(e) => setCriteria(criteria.map((x, j) => (j === i ? { ...x, weight: +e.target.value } : x)))} aria-label="Weight" />
                <button className="btn btn-ghost btn-sm !px-2" onClick={() => setCriteria(criteria.filter((_, j) => j !== i))} aria-label="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2">
              <button className="btn btn-ghost btn-sm" onClick={() => setCriteria([...criteria, { name: "New criterion", weight: 0 }])}>
                <Plus size={13} /> Add criterion
              </button>
              <span className={cx("tnum text-sm font-semibold", weightTotal === 100 ? "text-mint" : "text-rose")}>Total {weightTotal}</span>
            </div>
          </div>
        </Panel>
      )}

      {tab === "ai" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel>
            <PanelHead title="Simulator Agent configuration" />
            <div className="space-y-5 px-5 pb-5">
              <div>
                <label className="label" htmlFor="persona">
                  Persona
                </label>
                <input id="persona" className="field" value={ai.persona} onChange={(e) => setAi({ ...ai, persona: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="strict">
                  Strictness <span className="tnum text-text">{ai.strictness}</span>
                </label>
                <input id="strict" type="range" min={0} max={100} value={ai.strictness} onChange={(e) => setAi({ ...ai, strictness: +e.target.value })} className="w-full" />
                <p className="text-xs text-faint">Higher values make the officer challenge vague answers and ask for the legal basis.</p>
              </div>
              <div>
                <label className="label" htmlFor="temp">
                  Variation <span className="tnum text-text">{ai.temperature.toFixed(1)}</span>
                </label>
                <input id="temp" type="range" min={0} max={1} step={0.1} value={ai.temperature} onChange={(e) => setAi({ ...ai, temperature: +e.target.value })} className="w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="turns">
                    Max turns
                  </label>
                  <input id="turns" type="number" className="field tnum" value={ai.maxTurns} onChange={(e) => setAi({ ...ai, maxTurns: +e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="lang">
                    Language
                  </label>
                  <select id="lang" className="field" value={ai.language} onChange={(e) => setAi({ ...ai, language: e.target.value })}>
                    <option>English</option>
                    <option>Bangla</option>
                    <option>Learner&apos;s choice</option>
                  </select>
                </div>
              </div>
              <ul className="glass-inset divide-y divide-line">
                <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  Ask follow-up questions on weak answers
                  <Switch on={ai.followUps} onChange={(v) => setAi({ ...ai, followUps: v })} label="Follow-ups" />
                </li>
                <li className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  Use only facts from the case documents
                  <Switch on={ai.groundOnly} onChange={(v) => setAi({ ...ai, groundOnly: v })} label="Grounded" />
                </li>
              </ul>
            </div>
          </Panel>
          <Panel>
            <PanelHead
              title="Try the scenario"
              action={
                <button
                  className="btn btn-glass btn-sm"
                  onClick={() =>
                    setPreview(
                      `${ai.persona}: ${steps[0]?.prompt ?? "…"}\n\n${ai.strictness > 60 ? "If the answer doesn't cite a rule, I'll ask: \"Which provision are you relying on?\"" : "I'll accept a reasonable explanation without a citation."}`,
                    )
                  }
                >
                  <Sparkles size={14} className="text-orchid" /> Generate opening
                </button>
              }
            />
            <div className="px-5 pb-5">
              <pre className="glass-inset min-h-48 whitespace-pre-wrap p-4 font-sans text-sm leading-relaxed text-muted">{preview || "Generate an opening to see how the officer will speak with these settings."}</pre>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
