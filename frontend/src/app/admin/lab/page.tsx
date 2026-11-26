"use client";

import Link from "next/link";
import { useState } from "react";
import { Flag, Plus } from "lucide-react";
import { Badge, Modal, PageHeader, StateBadge, Tabs, scoreTone } from "@/components/ui";
import { getCase, labAttempts, labCases } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function AdminLab() {
  const { toast } = useStore();
  const [tab, setTab] = useState<"cases" | "audit">("cases");
  const [attempts, setAttempts] = useState(labAttempts);
  const [edit, setEdit] = useState<(typeof labAttempts)[number] | null>(null);
  const [score, setScore] = useState(0);
  const [reason, setReason] = useState("");

  return (
    <>
      <PageHeader
        title="Lab and simulator"
        sub="Build cases, configure how the Simulator Agent behaves, and audit every attempt and score."
        actions={
          <Link href="/admin/lab/new" className="btn btn-primary btn-sm">
            <Plus size={15} /> New case
          </Link>
        }
      />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "cases", label: "Cases" },
          { id: "audit", label: "Attempts and scoring audit" },
        ]}
      />
      {tab === "cases" && (
        <div className="glass overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Case</th>
                <th>Port</th>
                <th>Difficulty</th>
                <th>Steps</th>
                <th>Attempts</th>
                <th>Average</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {labCases.map((c) => (
                <tr key={c.id}>
                  <td className="font-medium">{c.title}</td>
                  <td className="text-muted">{c.port}</td>
                  <td>
                    <Badge tone={c.difficulty === "Hard" ? "rose" : c.difficulty === "Medium" ? "amber" : "mint"}>{c.difficulty}</Badge>
                  </td>
                  <td className="tnum text-muted">{c.steps.length}</td>
                  <td className="tnum text-muted">{c.attempts.toLocaleString()}</td>
                  <td>
                    <Badge tone={scoreTone(c.avgScore)}>{c.avgScore}%</Badge>
                  </td>
                  <td>
                    <StateBadge state={c.status} />
                  </td>
                  <td className="text-right">
                    <Link href={`/admin/lab/${c.id}`} className="btn btn-glass btn-sm">
                      Open builder
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "audit" && (
        <div className="glass overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Case</th>
                <th>When</th>
                <th>Duration</th>
                <th>AI score</th>
                <th>Final</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td className="font-medium">
                    <span className="flex items-center gap-2">
                      {a.student}
                      {a.flagged && (
                        <span title="Unusually fast attempt" className="text-amber">
                          <Flag size={13} />
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="text-muted">{getCase(a.caseId)?.title}</td>
                  <td className="tnum whitespace-nowrap text-muted">{a.at}</td>
                  <td className="tnum text-muted">{a.duration}</td>
                  <td>
                    <Badge tone={scoreTone(a.score)}>{a.score}</Badge>
                  </td>
                  <td>{a.override !== null ? <Badge tone="indigo">{a.override} (overridden)</Badge> : <span className="text-faint">Same as AI</span>}</td>
                  <td className="text-right">
                    <button
                      className="btn btn-glass btn-sm"
                      onClick={() => {
                        setEdit(a);
                        setScore(a.override ?? a.score);
                        setReason("");
                      }}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!edit} onClose={() => setEdit(null)} title="Review attempt">
        {edit && (
          <div className="space-y-4">
            <div className="glass-inset space-y-1.5 p-4 text-sm">
              <p>
                <span className="text-faint">Learner:</span> {edit.student}
              </p>
              <p>
                <span className="text-faint">Case:</span> {getCase(edit.caseId)?.title}
              </p>
              <p className="text-xs text-faint">Evaluation Engine trace: 3 answers scored against 4 rubric criteria, model confidence 0.81.</p>
            </div>
            <div>
              <label className="label" htmlFor="sc">
                Final score: <span className="tnum text-text">{score}</span>
              </label>
              <input id="sc" type="range" min={0} max={100} value={score} onChange={(e) => setScore(+e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="label" htmlFor="rs">
                Reason (saved to the audit log)
              </label>
              <textarea id="rs" rows={3} className="field" value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                if (score !== edit.score && reason.trim().length < 5) return toast("Give a reason for changing the AI score.", "warn");
                setAttempts(attempts.map((x) => (x.id === edit.id ? { ...x, override: score !== x.score ? score : null, flagged: false } : x)));
                setEdit(null);
                toast("Score saved and logged");
              }}
            >
              Save score
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
