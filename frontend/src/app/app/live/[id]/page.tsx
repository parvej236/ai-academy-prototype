"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Hand, Mic, MicOff, Sparkles, Users, Video } from "lucide-react";
import { Paywall } from "@/components/shell/portal";
import { Avatar, Badge, Tabs, cx } from "@/components/ui";
import { fmtDateTime, getLive, liveClasses } from "@/lib/data";
import { useStore } from "@/lib/store";

const liveScript = [
  { who: "Dr. Rahim", text: "Good afternoon everyone. Three changes in this budget affect clearance directly." },
  { who: "Dr. Rahim", text: "First, regulatory duty on several Chapter 85 items has been revised. Check your tariff lines this week." },
  { who: "Dr. Rahim", text: "Second, AIT at import stage for commercial importers moves to a new rate from 1 July." },
  { who: "Dr. Rahim", text: "Third, the minimum assessable value list has been expanded for ceramics and some steel products." },
  { who: "Dr. Rahim", text: "Let me show you how the duty stack changes on a 40 ft container of ceramic tiles." },
  { who: "Dr. Rahim", text: "Notice the supplementary duty now applies on the higher base. That's where most of the difference comes from." },
];

export default function LiveRoom() {
  const { id } = useParams<{ id: string }>();
  const l = getLive(id);
  const { user, toast } = useStore();
  const [lines, setLines] = useState(1);
  const [chat, setChat] = useState([
    { who: "Rafiqul Islam", text: "Will the new RD apply to goods already shipped?" },
    { who: "Sadia Afrin", text: "Is the AIT change in the Finance Act or by SRO?" },
  ]);
  const [msg, setMsg] = useState("");
  const [mic, setMic] = useState(false);
  const [hand, setHand] = useState(false);
  const [tab, setTab] = useState<"notes" | "transcript" | "slides">("notes");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (l?.status !== "live") return;
    const t = setInterval(() => setLines((n) => Math.min(liveScript.length, n + 1)), 4000);
    return () => clearInterval(t);
  }, [l]);

  if (!l) notFound();

  /* ---------- recording view ---------- */
  if (l.status !== "live") {
    const s = l.slides?.[slide];
    return (
      <Paywall what="Live class recordings">
        <Link href="/app/live" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
          <ChevronLeft size={15} /> Live classes
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-xl font-semibold sm:text-2xl">{l.title}</h1>
            <p className="mt-1 text-sm text-muted">
              {l.expert}, recorded {fmtDateTime(l.start)}
            </p>
          </div>
          <button className="btn btn-glass btn-sm" onClick={() => toast("Lecture notes exported as PDF")}>
            <Download size={14} /> Export notes
          </button>
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
          <div className="glass overflow-hidden">
            <div className="relative flex aspect-video items-center justify-center on-dark bg-[#0a0f33]">
              <div className="relative text-center">
                <Avatar name={l.expert} size={72} />
                <p className="mt-3 text-sm text-muted">Recording, {l.minutes} min</p>
              </div>
            </div>
            {s && (
              <div className="border-t border-line p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-faint">
                    AI-generated slide {slide + 1} of {l.slides!.length}
                  </p>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-sm !px-2" disabled={slide === 0} onClick={() => setSlide(slide - 1)} aria-label="Previous slide">
                      <ChevronLeft size={16} />
                    </button>
                    <button className="btn btn-ghost btn-sm !px-2" disabled={slide === l.slides!.length - 1} onClick={() => setSlide(slide + 1)} aria-label="Next slide">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="glass-inset mt-3 p-6">
                  <p className="font-display text-lg font-semibold">{s.title}</p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-indigo">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
          <div className="glass p-5">
            <Tabs
              value={tab}
              onChange={setTab}
              tabs={[
                { id: "notes", label: "Lecture notes" },
                { id: "transcript", label: "Transcript" },
                { id: "slides", label: "All slides" },
              ]}
            />
            <p className="mt-4 flex items-center gap-2 text-xs text-faint">
              <Sparkles size={13} className="text-orchid" /> Produced by the academy&apos;s AI pipeline from the session audio
            </p>
            <div className="thin-scroll mt-4 max-h-[520px] overflow-y-auto pr-1 text-sm leading-relaxed">
              {tab === "notes" && (
                <ul className="space-y-3">
                  {l.notes?.map((n, i) => (
                    <li key={i} className="glass-inset p-3.5 text-muted">
                      {n}
                    </li>
                  ))}
                </ul>
              )}
              {tab === "transcript" && (
                <div className="space-y-3">
                  {l.transcript?.map((t, i) => (
                    <p key={i} className="flex gap-3">
                      <span className="tnum shrink-0 text-indigo">{t.t}</span>
                      <span>
                        <span className="font-semibold">{t.who}: </span>
                        <span className="text-muted">{t.text}</span>
                      </span>
                    </p>
                  ))}
                </div>
              )}
              {tab === "slides" && (
                <ol className="space-y-2">
                  {l.slides?.map((s, i) => (
                    <li key={i}>
                      <button onClick={() => setSlide(i)} className={cx("w-full rounded-xl border px-4 py-3 text-left", i === slide ? "border-indigo/50 bg-indigo/10" : "border-line hover:bg-tint/5")}>
                        <span className="tnum mr-2 text-faint">{i + 1}</span>
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </Paywall>
    );
  }

  /* ---------- live room ---------- */
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    setChat([...chat, { who: user?.name ?? "You", text: msg }]);
    setMsg("");
  };

  return (
    <Paywall what="Expert-led live classes">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/app/live" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
            <ChevronLeft size={15} /> Live classes
          </Link>
          <h1 className="mt-1 truncate text-lg font-semibold">{l.title}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted">
          <Badge tone="rose" dot>
            Live
          </Badge>
          <span className="tnum flex items-center gap-1.5">
            <Users size={14} /> {l.registered - 214} watching
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <div className="glass overflow-hidden">
            <div className="relative aspect-video on-dark bg-[#0a0f33]">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Avatar name={l.expert} size={88} />
                <p className="mt-3 font-semibold">{l.expert}</p>
                <p className="text-xs text-muted">{l.expertTitle}</p>
              </div>
              {/* live caption */}
              <div className="absolute inset-x-6 bottom-5 rounded-xl bg-black/60 px-4 py-2.5 text-center text-sm backdrop-blur">{liveScript[lines - 1].text}</div>
            </div>
            <div className="flex items-center justify-center gap-2 p-3">
              <button onClick={() => setMic(!mic)} className={cx("btn btn-sm", mic ? "btn-primary" : "btn-glass")} aria-pressed={mic}>
                {mic ? <Mic size={15} /> : <MicOff size={15} />} {mic ? "Mic on" : "Muted"}
              </button>
              <button className="btn btn-glass btn-sm" onClick={() => toast("Camera is off for attendees in this session", "warn")}>
                <Video size={15} /> Camera
              </button>
              <button
                onClick={() => {
                  setHand(!hand);
                  if (!hand) toast("The expert can see your raised hand");
                }}
                className={cx("btn btn-sm", hand ? "btn-glass !border-amber/50 !text-amber" : "btn-glass")}
                aria-pressed={hand}
              >
                <Hand size={15} /> {hand ? "Hand raised" : "Raise hand"}
              </button>
              <Link href="/app/live" className="btn btn-danger btn-sm">
                Leave
              </Link>
            </div>
          </div>

          <div className="glass p-5">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles size={15} className="text-orchid" /> Notes building as the class runs
            </p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-indigo">
              {liveScript.slice(0, lines).filter((_, i) => i > 0 && i < 4).map((s) => (
                <li key={s.text} className="pop">
                  {s.text.replace(/^(First|Second|Third), /, "")}
                </li>
              ))}
              {lines < 2 && <li className="list-none text-faint">Key points appear here once the expert starts the agenda.</li>}
            </ul>
          </div>
        </div>

        <div className="glass flex h-[640px] flex-col overflow-hidden">
          <p className="border-b border-line px-5 py-3 text-sm font-semibold">Live transcript and questions</p>
          <div className="thin-scroll flex-1 space-y-3 overflow-y-auto p-5 text-sm">
            {liveScript.slice(0, lines).map((s, i) => (
              <p key={i} className="pop">
                <span className="font-semibold text-indigo">{s.who}: </span>
                <span className="text-muted">{s.text}</span>
              </p>
            ))}
            <div className="my-2 border-t border-line" />
            {chat.map((c, i) => (
              <div key={i} className="flex gap-2.5">
                <Avatar name={c.who} size={24} />
                <p>
                  <span className="font-semibold">{c.who} </span>
                  <span className="text-muted">{c.text}</span>
                </p>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-line p-3">
            <input value={msg} onChange={(e) => setMsg(e.target.value)} className="field !rounded-full" placeholder="Ask the expert a question" aria-label="Question" />
            <button className="btn btn-primary">Send</button>
          </form>
        </div>
      </div>
      <p className="mt-4 text-xs text-faint">
        After the class, the recording, transcript, notes and slides appear under Recordings. Next session: {liveClasses[1].title}.
      </p>
    </Paywall>
  );
}
