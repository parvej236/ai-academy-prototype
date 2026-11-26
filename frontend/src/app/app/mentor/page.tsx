"use client";

import { useState } from "react";
import { CalendarPlus, Video } from "lucide-react";
import { Paywall } from "@/components/shell/portal";
import { Avatar, Badge, Modal, PageHeader, Panel, PanelHead } from "@/components/ui";
import { fmtDate, fmtDateTime, mentorReports, mentorSessions, mentors } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function MyMentor() {
  const { toast, user } = useStore();
  const m = mentors[0];
  const reports = mentorReports.filter((r) => r.student === "s1");
  const [sessions, setSessions] = useState(mentorSessions.filter((s) => s.student === "s1"));
  const [book, setBook] = useState(false);
  const [f, setF] = useState({ topic: "", date: "2026-12-02", time: "19:00" });
  const [msgs, setMsgs] = useState([
    { from: "mentor", text: "Hi Nadia, I've looked at your fabric lab attempt. Let's go through the consultation step on Thursday." },
    { from: "you", text: "Thanks! Should I finish valuation module 2 before that?" },
    { from: "mentor", text: "Yes, at least the first two lessons. Bring your notes on Method 2." },
  ]);
  const [msg, setMsg] = useState("");

  const doBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.topic.trim()) return toast("Add a topic so your mentor can prepare.", "warn");
    setSessions([...sessions, { id: "new" + Date.now(), student: "s1", topic: f.topic, at: `${f.date}T${f.time}:00+06:00`, minutes: 30, mode: "Video" }]);
    setBook(false);
    toast("Session requested. Your mentor will confirm by email.");
  };

  return (
    <>
      <PageHeader title="My mentor" sub="Your assigned mentor reviews your progress, writes a monthly report and meets you one-to-one." />
      <Paywall what="Mentoring">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-5">
            <Panel lit className="p-6">
              <div className="flex items-center gap-4">
                <Avatar name={m.name} size={56} />
                <div>
                  <p className="font-display text-lg font-semibold">{m.name}</p>
                  <p className="text-sm text-muted">
                    {m.kind}, {m.speciality}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">Licensed C&amp;F agent at Benapole and Dhaka ICD for 14 years. Teaches the ASYCUDA World course.</p>
              <button className="btn btn-primary mt-5 w-full" onClick={() => setBook(true)}>
                <CalendarPlus size={15} /> Book a session
              </button>
            </Panel>
            <Panel>
              <PanelHead title="Upcoming sessions" />
              <ul className="divide-y divide-line">
                {sessions.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                    <Video size={16} className="text-indigo" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{s.topic}</p>
                      <p className="tnum text-xs text-faint">
                        {fmtDateTime(s.at)}, {s.minutes} min
                      </p>
                    </div>
                    {s.id.startsWith("new") ? <Badge tone="amber">Requested</Badge> : <Badge tone="mint">Confirmed</Badge>}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel>
              <PanelHead title="Progress reports" meta="Written by your mentor" />
              <div className="space-y-3 px-5 pb-5">
                {reports.map((r) => (
                  <article key={r.id} className="glass-inset p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{r.period}</p>
                      <Badge tone="mint">{r.rating}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{r.summary}</p>
                    <p className="mt-3 text-xs text-faint">
                      {r.author}, {fmtDate(r.date)}
                    </p>
                  </article>
                ))}
              </div>
            </Panel>
            <Panel>
              <PanelHead title="Messages" />
              <div className="space-y-3 px-5">
                {msgs.map((x, i) => (
                  <div key={i} className={`flex ${x.from === "you" ? "justify-end" : ""}`}>
                    <p className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${x.from === "you" ? "rounded-br-md bg-indigo/25" : "rounded-bl-md border border-line bg-tint/5 text-muted"}`}>{x.text}</p>
                  </div>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!msg.trim()) return;
                  setMsgs([...msgs, { from: "you", text: msg }]);
                  setMsg("");
                }}
                className="flex gap-2 p-5"
              >
                <input value={msg} onChange={(e) => setMsg(e.target.value)} className="field !rounded-full" placeholder={`Message ${m.name.split(" ")[0]}`} aria-label="Message" />
                <button className="btn btn-primary">Send</button>
              </form>
            </Panel>
          </div>
        </div>
      </Paywall>

      <Modal open={book} onClose={() => setBook(false)} title={`Book a session with ${m.name}`}>
        <form onSubmit={doBook} className="space-y-4">
          <div>
            <label className="label" htmlFor="topic">
              What do you want to cover?
            </label>
            <input id="topic" value={f.topic} onChange={(e) => setF({ ...f, topic: e.target.value })} className="field" placeholder="e.g. Viva rehearsal on Section 82" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="date">
                Date
              </label>
              <input id="date" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="time">
                Time
              </label>
              <input id="time" type="time" value={f.time} onChange={(e) => setF({ ...f, time: e.target.value })} className="field" />
            </div>
          </div>
          <p className="text-xs text-faint">Requested by {user?.name}. Sessions are 30 minutes.</p>
          <button className="btn btn-primary w-full">Request session</button>
        </form>
      </Modal>
    </>
  );
}
