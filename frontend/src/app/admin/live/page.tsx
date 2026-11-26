"use client";

import { useState } from "react";
import { Check, Loader2, Plus, Radio, Square } from "lucide-react";
import { Badge, Modal, PageHeader, Panel, PanelHead, Switch, Tabs, cx } from "@/components/ui";
import { courses, fmtDateTime, liveClasses as seed, type LiveClass } from "@/lib/data";
import { useStore } from "@/lib/store";

const steps = ["Recording saved", "Transcribed", "Lecture notes", "Slides", "Published"];

export default function AdminLive() {
  const { toast } = useStore();
  const [list, setList] = useState<(LiveClass & { pipeline?: number })[]>(seed.map((l) => ({ ...l, pipeline: l.status === "recorded" ? 5 : 0 })));
  const [tab, setTab] = useState<"sessions" | "video">("sessions");
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ title: "", expert: "", start: "2026-12-10T19:00", minutes: 60, course: courses[0].slug, notify: true, sms: true, record: true });

  const schedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.title || !d.expert) return toast("Add a title and the expert's name.", "warn");
    setList([{ id: "l" + Date.now(), title: d.title, expert: d.expert, expertTitle: "Subject-matter expert", start: new Date(d.start).toISOString(), minutes: d.minutes, course: d.course, status: "scheduled", registered: 0, pipeline: 0 }, ...list]);
    setOpen(false);
    toast(d.notify ? "Scheduled. All 14,820 AI Academy users have been notified." : "Scheduled without notifications");
  };

  const end = (id: string) => {
    setList(list.map((l) => (l.id === id ? { ...l, status: "recorded", pipeline: 1 } : l)));
    toast("Class ended. Recording sent to the AI pipeline.");
    // simulate pipeline progress
    [2, 3, 4, 5].forEach((p, i) => setTimeout(() => setList((cur) => cur.map((l) => (l.id === id ? { ...l, pipeline: p } : l))), 1200 * (i + 1)));
  };

  return (
    <>
      <PageHeader
        title="Live and video"
        sub="Schedule expert-led classes, run them, and track recordings through transcription, notes and slides."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <Plus size={15} /> Schedule live class
          </button>
        }
      />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "sessions", label: "Sessions" },
          { id: "video", label: "Video library" },
        ]}
      />
      {tab === "sessions" && (
        <div className="space-y-3">
          {list.map((l) => (
            <div key={l.id} className="glass flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {l.status === "live" && (
                    <Badge tone="rose" dot>
                      Live
                    </Badge>
                  )}
                  {l.status === "scheduled" && <Badge tone="indigo">Scheduled</Badge>}
                  {l.status === "recorded" && <Badge>Recorded</Badge>}
                  <span className="tnum text-xs text-faint">{fmtDateTime(l.start)}</span>
                </div>
                <p className="mt-2 font-semibold">{l.title}</p>
                <p className="text-sm text-muted">
                  {l.expert}, {l.minutes} min, {l.registered.toLocaleString()} registered
                </p>
              </div>
              {l.status === "recorded" ? (
                <ol className="flex flex-wrap gap-1.5">
                  {steps.map((s, i) => {
                    const done = (l.pipeline ?? 0) > i;
                    const running = (l.pipeline ?? 0) === i;
                    return (
                      <li key={s} className={cx("flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.72rem] font-semibold", done ? "border-mint/30 bg-mint/10 text-mint" : running ? "border-indigo/30 bg-indigo/10 text-indigo" : "border-line text-faint")}>
                        {done ? <Check size={12} /> : running ? <Loader2 size={12} className="animate-spin" /> : null}
                        {s}
                      </li>
                    );
                  })}
                </ol>
              ) : l.status === "live" ? (
                <button className="btn btn-danger btn-sm" onClick={() => end(l.id)}>
                  <Square size={13} /> End class
                </button>
              ) : (
                <div className="flex gap-2">
                  <button className="btn btn-glass btn-sm" onClick={() => toast("Reminder sent to registered users")}>
                    Send reminder
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setList(list.map((x) => (x.id === l.id ? { ...x, status: "live" } : x)));
                      toast("Class is live. Registered users notified.");
                    }}
                  >
                    <Radio size={14} /> Go live
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {tab === "video" && (
        <Panel>
          <PanelHead title="Lesson videos" meta="Every upload is transcribed and summarised on the same AI pipeline as live classes" />
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Video</th>
                  <th>Course</th>
                  <th>Length</th>
                  <th>Transcript</th>
                  <th>Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.slice(0, 5).flatMap((c) =>
                  c.modules[0].lessons
                    .filter((x) => x.kind === "video")
                    .slice(0, 1)
                    .map((x, i) => (
                      <tr key={x.id}>
                        <td className="font-medium">{x.title}</td>
                        <td className="text-muted">{c.title}</td>
                        <td className="tnum text-muted">{x.minutes}:00</td>
                        <td>
                          <Badge tone="mint">Ready</Badge>
                        </td>
                        <td>{i === 0 && c.status !== "published" ? <Badge tone="amber">Processing</Badge> : <Badge tone="mint">Ready</Badge>}</td>
                        <td>{c.status === "published" ? <Badge tone="mint" dot>Streaming</Badge> : <Badge dot>Hidden</Badge>}</td>
                      </tr>
                    )),
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Schedule a live class">
        <form onSubmit={schedule} className="space-y-4">
          <div>
            <label className="label" htmlFor="lt">
              Title
            </label>
            <input id="lt" className="field" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="le">
                Expert
              </label>
              <input id="le" className="field" value={d.expert} onChange={(e) => setD({ ...d, expert: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="lc">
                Linked course
              </label>
              <select id="lc" className="field" value={d.course} onChange={(e) => setD({ ...d, course: e.target.value })}>
                {courses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="ls">
                Starts
              </label>
              <input id="ls" type="datetime-local" className="field" value={d.start} onChange={(e) => setD({ ...d, start: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="lm">
                Minutes
              </label>
              <input id="lm" type="number" className="field tnum" value={d.minutes} onChange={(e) => setD({ ...d, minutes: +e.target.value })} />
            </div>
          </div>
          <ul className="glass-inset divide-y divide-line">
            {(
              [
                ["notify", "Notify all AI Academy users by email and in-app"],
                ["sms", "Send SMS reminder 15 minutes before"],
                ["record", "Record and generate transcript, notes and slides"],
              ] as const
            ).map(([k, label]) => (
              <li key={k} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                {label}
                <Switch on={d[k]} onChange={(v) => setD({ ...d, [k]: v })} label={label} />
              </li>
            ))}
          </ul>
          <p className="text-xs text-faint">Live access is limited to paid subscribers.</p>
          <button className="btn btn-primary w-full">Schedule class</button>
        </form>
      </Modal>
    </>
  );
}
