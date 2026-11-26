"use client";

import { useState } from "react";
import { Loader2, Plus, Search, Sparkles, Trash2 } from "lucide-react";
import { Badge, Modal, PageHeader } from "@/components/ui";
import { questionBank, type Question } from "@/lib/data";
import { useStore } from "@/lib/store";

const topics = ["Classification", "Valuation", "Customs Act", "Tax", "Procedures", "Origin"];
const diffTone = { Easy: "mint", Medium: "amber", Hard: "rose" } as const;

const generated: Omit<Question, "id">[] = [
  {
    topic: "Valuation",
    difficulty: "Hard",
    text: "A buyer pays the seller's debt to a third party as a condition of sale. How is this treated?",
    options: ["Ignored", "Part of the price actually paid", "Deducted from value", "Treated as an assist"],
    answer: 1,
    explanation: "Indirect payments made to or for the benefit of the seller form part of the price actually paid.",
  },
  {
    topic: "Valuation",
    difficulty: "Medium",
    text: "Which method follows transaction value of identical goods if it cannot be determined?",
    options: ["Deductive value", "Similar goods", "Computed value", "Fallback"],
    answer: 1,
    explanation: "Methods are applied in order: identical goods, then similar goods.",
  },
  {
    topic: "Valuation",
    difficulty: "Medium",
    text: "Post-importation transport costs, if shown separately, are:",
    options: ["Added", "Excluded from customs value", "Split 50/50", "Taxed as service"],
    answer: 1,
    explanation: "Charges after importation are excluded when distinguished from the price.",
  },
];

export default function QuestionBank() {
  const { toast } = useStore();
  const [list, setList] = useState<Question[]>(questionBank);
  const [topic, setTopic] = useState("All");
  const [diff, setDiff] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [gen, setGen] = useState(false);
  const [genState, setGenState] = useState<"idle" | "busy" | "done">("idle");
  const [genCfg, setGenCfg] = useState({ topic: "Valuation", difficulty: "Hard", count: 3 });
  const [d, setD] = useState({ topic: "Classification", difficulty: "Medium" as Question["difficulty"], text: "", options: ["", "", "", ""], answer: 0, explanation: "" });

  const rows = list.filter((x) => (topic === "All" || x.topic === topic) && (diff === "All" || x.difficulty === diff) && x.text.toLowerCase().includes(q.toLowerCase()));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.text.trim() || d.options.some((o) => !o.trim())) return toast("Fill in the question and all four options.", "warn");
    setList([{ ...d, id: "q" + Date.now() }, ...list]);
    setOpen(false);
    setD({ ...d, text: "", options: ["", "", "", ""], explanation: "" });
    toast("Question added to the bank");
  };

  const runGen = () => {
    setGenState("busy");
    setTimeout(() => setGenState("done"), 1600);
  };

  return (
    <>
      <PageHeader
        title="Question bank"
        sub="Every MCQ, quiz and mock paper draws from here. AI-generated questions stay as drafts until an examiner approves them."
        actions={
          <>
            <button className="btn btn-glass btn-sm" onClick={() => { setGen(true); setGenState("idle"); }}>
              <Sparkles size={15} className="text-orchid" /> Generate with Examiner Agent
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
              <Plus size={15} /> Add question
            </button>
          </>
        }
      />
      <div className="glass mb-4 flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search</span>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="field !h-9 pl-9" placeholder="Search question text" />
        </label>
        <select className="field !h-9 md:w-44" value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic">
          <option>All</option>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <select className="field !h-9 md:w-36" value={diff} onChange={(e) => setDiff(e.target.value)} aria-label="Difficulty">
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      <div className="glass overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Question</th>
              <th>Topic</th>
              <th>Difficulty</th>
              <th>Correct answer</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td className="max-w-md">
                  <p className="font-medium leading-snug">{x.text}</p>
                  {x.id.startsWith("ai") && <Badge tone="orchid" className="mt-1">AI draft, needs approval</Badge>}
                </td>
                <td className="text-muted">{x.topic}</td>
                <td>
                  <Badge tone={diffTone[x.difficulty]}>{x.difficulty}</Badge>
                </td>
                <td className="max-w-56 text-muted">{x.options[x.answer]}</td>
                <td className="whitespace-nowrap text-right">
                  {x.id.startsWith("ai") && (
                    <button
                      className="btn btn-glass btn-sm"
                      onClick={() => {
                        setList(list.map((y) => (y.id === x.id ? { ...y, id: "q" + y.id.slice(2) } : y)));
                        toast("Approved and added to live pool");
                      }}
                    >
                      Approve
                    </button>
                  )}
                  <button className="btn btn-ghost btn-sm !px-2 hover:!text-rose" onClick={() => setList(list.filter((y) => y.id !== x.id))} aria-label="Delete">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tnum mt-3 text-xs text-faint">
        {rows.length} of {list.length} questions
      </p>

      <Modal open={open} onClose={() => setOpen(false)} title="Add question" wide>
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Topic</label>
              <select className="field" value={d.topic} onChange={(e) => setD({ ...d, topic: e.target.value })}>
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="field" value={d.difficulty} onChange={(e) => setD({ ...d, difficulty: e.target.value as Question["difficulty"] })}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label">Question</label>
            <textarea rows={2} className="field" value={d.text} onChange={(e) => setD({ ...d, text: e.target.value })} />
          </div>
          <fieldset className="space-y-2">
            <legend className="label">Options (select the correct one)</legend>
            {d.options.map((o, i) => (
              <div key={i} className="flex items-center gap-3">
                <input type="radio" name="answer" checked={d.answer === i} onChange={() => setD({ ...d, answer: i })} className="accent-[var(--indigo)]" aria-label={`Option ${i + 1} is correct`} />
                <input className="field" value={o} onChange={(e) => setD({ ...d, options: d.options.map((x, j) => (j === i ? e.target.value : x)) })} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
              </div>
            ))}
          </fieldset>
          <div>
            <label className="label">Explanation</label>
            <textarea rows={2} className="field" value={d.explanation} onChange={(e) => setD({ ...d, explanation: e.target.value })} />
          </div>
          <button className="btn btn-primary w-full">Save question</button>
        </form>
      </Modal>

      <Modal open={gen} onClose={() => setGen(false)} title="Generate questions" wide>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label">Topic</label>
            <select className="field" value={genCfg.topic} onChange={(e) => setGenCfg({ ...genCfg, topic: e.target.value })}>
              {topics.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select className="field" value={genCfg.difficulty} onChange={(e) => setGenCfg({ ...genCfg, difficulty: e.target.value })}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div>
            <label className="label">How many</label>
            <input type="number" min={1} max={20} className="field tnum" value={genCfg.count} onChange={(e) => setGenCfg({ ...genCfg, count: +e.target.value })} />
          </div>
        </div>
        <p className="mt-3 text-xs text-faint">The Examiner Agent writes questions only from published course material and the Valuation Rules 2000 in Documents.</p>
        {genState !== "done" ? (
          <button className="btn btn-primary mt-5 w-full" onClick={runGen} disabled={genState === "busy"}>
            {genState === "busy" ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Writing questions…
              </>
            ) : (
              "Generate drafts"
            )}
          </button>
        ) : (
          <>
            <ol className="mt-5 space-y-3">
              {generated.map((g, i) => (
                <li key={i} className="glass-inset p-4 text-sm">
                  <p className="font-medium">{g.text}</p>
                  <p className="mt-1 text-muted">Answer: {g.options[g.answer]}</p>
                </li>
              ))}
            </ol>
            <button
              className="btn btn-primary mt-5 w-full"
              onClick={() => {
                setList([...generated.map((g, i) => ({ ...g, id: `ai${Date.now()}${i}` })), ...list]);
                setGen(false);
                toast("3 drafts added. Approve them before they're used in exams.");
              }}
            >
              Add drafts to bank
            </button>
          </>
        )}
      </Modal>
    </>
  );
}
