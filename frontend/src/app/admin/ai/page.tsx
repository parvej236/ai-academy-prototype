"use client";

import { useState } from "react";
import { AudioLines, Bot, ClipboardCheck, FlaskConical, Gauge } from "lucide-react";
import { Badge, PageHeader, Panel, PanelHead, Switch, cx } from "@/components/ui";
import { agentRuns } from "@/lib/data";
import { useStore } from "@/lib/store";

type Agent = {
  id: string;
  name: string;
  role: string;
  icon: typeof Bot;
  model: string;
  temperature: number;
  threshold?: number;
  on: boolean;
  calls: string;
  p95: string;
};

const models = ["claude-sonnet-5-5", "claude-opus-5-5", "claude-haiku-5-5"];

export default function AiAgents() {
  const { toast } = useStore();
  const [agents, setAgents] = useState<Agent[]>([
    { id: "examiner", name: "Examiner Agent", role: "Generates question sets and runs viva follow-ups", icon: ClipboardCheck, model: "claude-sonnet-5-5", temperature: 0.4, on: true, calls: "18.2k", p95: "4.1 s" },
    { id: "simulator", name: "Simulator Agent", role: "Plays officers and clients inside lab cases", icon: FlaskConical, model: "claude-sonnet-5-5", temperature: 0.3, on: true, calls: "41.7k", p95: "2.8 s" },
    { id: "evaluation", name: "Evaluation Engine", role: "Scores answers against rubrics; routes low-confidence marks to humans", icon: Gauge, model: "claude-opus-5-5", temperature: 0, threshold: 0.75, on: true, calls: "52.3k", p95: "1.9 s" },
    { id: "pipeline", name: "Lecture pipeline", role: "Transcribes live classes and videos, writes notes and slides", icon: AudioLines, model: "claude-haiku-5-5", temperature: 0.2, on: true, calls: "1.1k", p95: "5 min" },
  ]);
  const [guard, setGuard] = useState({ grounded: true, pii: true, human: true, log: true });
  const upd = (id: string, patch: Partial<Agent>) => setAgents(agents.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  return (
    <>
      <PageHeader
        title="AI agents"
        sub="The multi-agent framework behind the lab, exams and lecture notes. Curriculum stays the academy's responsibility; agents only work from published material."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => toast("Agent configuration saved. New settings apply to the next run.")}>
            Save configuration
          </button>
        }
      />

      {/* pipeline strip */}
      <div className="glass mb-5 overflow-x-auto p-5">
        <ol className="flex min-w-[720px] items-center gap-2 text-sm">
          {["Learner answer", "Simulator Agent", "Examiner Agent", "Evaluation Engine", "Score + feedback", "Human review if confidence < 0.75"].map((s, i, arr) => (
            <li key={s} className="flex items-center gap-2">
              <span className={cx("rounded-full border px-3 py-1.5 font-medium", i === 3 ? "border-indigo bg-indigo text-white" : i === arr.length - 1 ? "border-amber/40 bg-amber/10 text-amber" : "border-line bg-white")}>{s}</span>
              {i < arr.length - 1 && <span className="h-px w-6 bg-tint/20" />}
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {agents.map((a) => (
          <Panel key={a.id} className="p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo/10 text-indigo">
                <a.icon size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{a.name}</p>
                  <Badge tone={a.on ? "mint" : "neutral"} dot>
                    {a.on ? "Running" : "Paused"}
                  </Badge>
                </div>
                <p className="text-sm text-muted">{a.role}</p>
              </div>
              <Switch on={a.on} onChange={(v) => { upd(a.id, { on: v }); toast(v ? `${a.name} resumed` : `${a.name} paused. Affected features will queue requests.`, v ? "ok" : "warn"); }} label={`${a.name} running`} />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Model</label>
                <select className="field" value={a.model} onChange={(e) => upd(a.id, { model: e.target.value })}>
                  {models.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  Temperature <span className="tnum text-text">{a.temperature.toFixed(1)}</span>
                </label>
                <input type="range" min={0} max={1} step={0.1} value={a.temperature} onChange={(e) => upd(a.id, { temperature: +e.target.value })} className="mt-2 w-full" />
              </div>
              {a.threshold !== undefined && (
                <div className="sm:col-span-2">
                  <label className="label">
                    Human review below confidence <span className="tnum text-text">{a.threshold.toFixed(2)}</span>
                  </label>
                  <input type="range" min={0.5} max={0.95} step={0.05} value={a.threshold} onChange={(e) => upd(a.id, { threshold: +e.target.value })} className="w-full" />
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-6 border-t border-line pt-4 text-xs text-faint">
              <span>
                Calls this month <span className="tnum font-semibold text-text">{a.calls}</span>
              </span>
              <span>
                p95 latency <span className="tnum font-semibold text-text">{a.p95}</span>
              </span>
            </div>
          </Panel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Panel>
          <PanelHead title="Guardrails" />
          <ul className="divide-y divide-line">
            {(
              [
                ["grounded", "Agents answer only from published course material and case documents"],
                ["pii", "Strip names, phone numbers and BL numbers before sending to the model"],
                ["human", "Final exams always get a human check before certificates issue"],
                ["log", "Keep full prompts and outputs for the scoring audit"],
              ] as const
            ).map(([k, label]) => (
              <li key={k} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                {label}
                <Switch on={guard[k]} onChange={(v) => setGuard({ ...guard, [k]: v })} label={label} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <PanelHead title="Recent runs" />
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Run</th>
                  <th>Agent</th>
                  <th>Task</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {agentRuns.map((r) => (
                  <tr key={r.id}>
                    <td className="tnum text-muted">{r.id}</td>
                    <td>{r.agent}</td>
                    <td className="text-muted">{r.task}</td>
                    <td className="tnum text-muted">{r.ms >= 60000 ? `${Math.round(r.ms / 60000)} min` : `${(r.ms / 1000).toFixed(1)} s`}</td>
                    <td>
                      <Badge tone={r.status === "done" ? "mint" : r.status === "review" ? "amber" : "rose"}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
