"use client";

import { useState } from "react";
import { Check, Video, X } from "lucide-react";
import { Avatar, Badge, PageHeader, Panel, PanelHead, Switch } from "@/components/ui";
import { fmtDateTime, mentorSessions, students } from "@/lib/data";
import { useStore } from "@/lib/store";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MentorSessions() {
  const { toast } = useStore();
  const [requests, setRequests] = useState([
    { id: "rq1", student: "s6", topic: "Related-party valuation", at: "2026-12-02T19:00:00+06:00" },
    { id: "rq2", student: "s3", topic: "Section 32 and 156 recap", at: "2026-12-03T20:00:00+06:00" },
  ]);
  const [sessions, setSessions] = useState(mentorSessions);
  const [avail, setAvail] = useState<Record<string, boolean>>({ Sun: true, Mon: false, Tue: true, Wed: true, Thu: true, Fri: false, Sat: true });

  const decide = (id: string, ok: boolean) => {
    const r = requests.find((x) => x.id === id)!;
    setRequests(requests.filter((x) => x.id !== id));
    if (ok) setSessions([...sessions, { id: r.id, student: r.student, topic: r.topic, at: r.at, minutes: 30, mode: "Video" }]);
    toast(ok ? "Session confirmed. The student has been emailed." : "Request declined", ok ? "ok" : "warn");
  };

  return (
    <>
      <PageHeader title="Sessions" sub="One-to-one sessions with your students." />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Panel>
            <PanelHead title="Requests" meta={`${requests.length} waiting for you`} />
            <ul className="divide-y divide-line">
              {requests.length === 0 && <li className="px-5 pb-5 text-sm text-muted">No pending requests.</li>}
              {requests.map((r) => {
                const s = students.find((x) => x.id === r.student)!;
                return (
                  <li key={r.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                    <Avatar name={s.name} size={34} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{r.topic}</p>
                      <p className="tnum text-xs text-faint">
                        {s.name}, {fmtDateTime(r.at)}
                      </p>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => decide(r.id, false)}>
                      <X size={14} /> Decline
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => decide(r.id, true)}>
                      <Check size={14} /> Confirm
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>
          <Panel>
            <PanelHead title="Confirmed" />
            <ul className="divide-y divide-line">
              {sessions.map((x) => (
                <li key={x.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Video size={16} className="text-indigo" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{x.topic}</p>
                    <p className="tnum text-xs text-faint">
                      {students.find((s) => s.id === x.student)?.name}, {fmtDateTime(x.at)}, {x.minutes} min
                    </p>
                  </div>
                  <Badge>{x.mode}</Badge>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <Panel className="h-fit">
          <PanelHead title="Weekly availability" meta="Evenings, 7–10 pm" />
          <ul className="divide-y divide-line">
            {days.map((d) => (
              <li key={d} className="flex items-center justify-between px-5 py-3 text-sm">
                {d}
                <Switch on={avail[d]} onChange={(v) => setAvail({ ...avail, [d]: v })} label={`Available ${d}`} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
