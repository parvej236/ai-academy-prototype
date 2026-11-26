"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge, Modal, PageHeader, Panel, PanelHead, StateBadge, Tabs } from "@/components/ui";
import { courses, exams as seed, getCourse, gradingQueue, questionBank, type Exam } from "@/lib/data";
import { useStore } from "@/lib/store";

const kinds: Exam["kind"][] = ["Quiz", "Mock exam", "Final exam", "Case study", "Viva"];
const topics = ["Classification", "Valuation", "Customs Act", "Tax", "Procedures", "Origin"];

export default function AdminExams() {
  const { toast } = useStore();
  const [tab, setTab] = useState<"exams" | "grading">("exams");
  const [list, setList] = useState(seed);
  const [queue, setQueue] = useState(gradingQueue.map((g) => ({ ...g, final: g.aiScore })));
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ title: "", kind: "Quiz" as Exam["kind"], course: courses[0].slug, minutes: 20, passMark: 60, attempts: 2, grading: "Auto" as Exam["grading"], mix: Object.fromEntries(topics.map((t) => [t, 2])) as Record<string, number>, shuffle: true });

  const total = Object.values(d.mix).reduce((n, v) => n + v, 0);
  const available = (t: string) => questionBank.filter((q) => q.topic === t).length;

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.title.trim()) return toast("Name the exam.", "warn");
    setList([{ id: "e" + Date.now(), title: d.title, kind: d.kind, course: d.course, questions: total, minutes: d.minutes, passMark: d.passMark, attemptsAllowed: d.attempts, status: "draft", grading: d.grading, topics: topics.filter((t) => d.mix[t] > 0) }, ...list]);
    setOpen(false);
    toast(`"${d.title}" saved as draft with ${total} questions per attempt`);
  };

  return (
    <>
      <PageHeader
        title="Exams and grading"
        sub="Build quizzes, mocks, finals, case studies and viva boards, and control how they are marked."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <Plus size={15} /> Build exam
          </button>
        }
      />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "exams", label: "Exams" },
          { id: "grading", label: `Grading queue (${queue.length})` },
        ]}
      />
      {tab === "exams" && (
        <div className="glass overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Type</th>
                <th>Questions</th>
                <th>Time</th>
                <th>Pass mark</th>
                <th>Grading</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id}>
                  <td>
                    <p className="font-medium">{e.title}</p>
                    <p className="text-xs text-faint">{getCourse(e.course)?.title}</p>
                  </td>
                  <td>
                    <Badge tone={e.kind === "Viva" ? "orchid" : "neutral"}>{e.kind}</Badge>
                  </td>
                  <td className="tnum text-muted">{e.questions}</td>
                  <td className="tnum text-muted">{e.minutes} min</td>
                  <td className="tnum text-muted">{e.passMark}%</td>
                  <td>
                    <select
                      className="field !h-8 !w-36 !text-xs"
                      value={e.grading}
                      onChange={(ev) => {
                        setList(list.map((x) => (x.id === e.id ? { ...x, grading: ev.target.value as Exam["grading"] } : x)));
                        toast(`Grading for ${e.title} set to ${ev.target.value}`);
                      }}
                      aria-label="Grading mode"
                    >
                      <option>Auto</option>
                      <option>AI + review</option>
                      <option>Manual</option>
                    </select>
                  </td>
                  <td>
                    <StateBadge state={e.status} />
                  </td>
                  <td className="text-right">
                    {e.status === "draft" ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setList(list.map((x) => (x.id === e.id ? { ...x, status: "published" } : x)));
                          toast(`${e.title} published`);
                        }}
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setList(list.map((x) => (x.id === e.id ? { ...x, status: "draft" } : x)));
                          toast(`${e.title} closed`, "warn");
                        }}
                      >
                        Close
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "grading" && (
        <Panel>
          <PanelHead title="Waiting for a human" meta="The Evaluation Engine routes answers here when its confidence is below 0.75" />
          <ul className="divide-y divide-line">
            {queue.length === 0 && <li className="px-5 pb-6 text-sm text-muted">Queue is clear.</li>}
            {queue.map((g) => (
              <li key={g.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-medium">
                    {g.student} <span className="font-normal text-muted">on {g.exam}</span>
                  </p>
                  <p className="text-sm text-muted">{g.reason}</p>
                  <p className="tnum mt-1 text-xs text-faint">
                    AI score {g.aiScore}, confidence {Math.round(g.confidence * 100)}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    className="field tnum !h-9 !w-20"
                    value={g.final}
                    onChange={(e) => setQueue(queue.map((x) => (x.id === g.id ? { ...x, final: +e.target.value } : x)))}
                    aria-label="Final score"
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setQueue(queue.filter((x) => x.id !== g.id));
                      toast(g.final === g.aiScore ? "AI score confirmed" : `Score changed from ${g.aiScore} to ${g.final} and logged`);
                    }}
                  >
                    {g.final === g.aiScore ? "Confirm" : "Override"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Exam builder" wide>
        <form onSubmit={create} className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Title</label>
              <input className="field" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="e.g. Licensing mock paper 2" />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="field" value={d.kind} onChange={(e) => setD({ ...d, kind: e.target.value as Exam["kind"] })}>
                {kinds.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Course</label>
              <select className="field" value={d.course} onChange={(e) => setD({ ...d, course: e.target.value })}>
                {courses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p className="label">Questions per attempt, drawn at random from the bank</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {topics.map((t) => (
                <label key={t} className="glass-inset flex items-center justify-between gap-2 px-3 py-2 text-sm">
                  <span>
                    {t}
                    <span className="block text-[0.7rem] text-faint">{available(t)} in bank</span>
                  </span>
                  <input type="number" min={0} className="field tnum !h-8 !w-16" value={d.mix[t]} onChange={(e) => setD({ ...d, mix: { ...d.mix, [t]: +e.target.value } })} aria-label={`${t} questions`} />
                </label>
              ))}
            </div>
            <p className="tnum mt-2 text-sm">
              Total: <span className="font-semibold">{total}</span> questions
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <div>
              <label className="label">Minutes</label>
              <input type="number" className="field tnum" value={d.minutes} onChange={(e) => setD({ ...d, minutes: +e.target.value })} />
            </div>
            <div>
              <label className="label">Pass mark %</label>
              <input type="number" className="field tnum" value={d.passMark} onChange={(e) => setD({ ...d, passMark: +e.target.value })} />
            </div>
            <div>
              <label className="label">Attempts</label>
              <input type="number" className="field tnum" value={d.attempts} onChange={(e) => setD({ ...d, attempts: +e.target.value })} />
            </div>
            <div>
              <label className="label">Grading</label>
              <select className="field" value={d.grading} onChange={(e) => setD({ ...d, grading: e.target.value as Exam["grading"] })}>
                <option>Auto</option>
                <option>AI + review</option>
                <option>Manual</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary w-full">Save as draft</button>
        </form>
      </Modal>
    </>
  );
}
