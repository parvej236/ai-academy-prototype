"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarPlus, Check, FileText, Presentation, ScrollText } from "lucide-react";
import { Avatar, Badge } from "@/components/ui";
import { fmtDateTime, liveClasses } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function LivePublic() {
  const { user, registeredLive, toggleLive, toast, hasAccess } = useStore();
  const router = useRouter();
  const upcoming = liveClasses.filter((l) => l.status !== "recorded");
  const recorded = liveClasses.filter((l) => l.status === "recorded");

  const register = (id: string, title: string) => {
    if (!user) return router.push("/signup?next=/live");
    if (!hasAccess) return router.push("/pricing");
    const on = registeredLive.includes(id);
    toggleLive(id);
    toast(on ? `Removed reminder for ${title}` : `You'll get a reminder 15 minutes before ${title}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="font-display text-[2rem] font-semibold sm:text-[2.6rem]">Expert-led live classes</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Subject-matter experts teach live, usually the same week a rule changes. Every AI Academy user is notified when a session is scheduled. Live access
            needs a paid subscription.
          </p>
        </div>
      </div>

      <section className="mt-10 space-y-3">
        {upcoming.map((l) => {
          const on = registeredLive.includes(l.id);
          return (
            <article key={l.id} className={`glass flex flex-col gap-5 p-5 sm:flex-row sm:items-center ${l.status === "live" ? "edge-lit" : ""}`}>
              <div className="w-40 shrink-0">
                {l.status === "live" ? (
                  <Badge tone="rose" dot>
                    Live now
                  </Badge>
                ) : (
                  <p className="tnum text-sm font-semibold">{fmtDateTime(l.start)}</p>
                )}
                <p className="mt-1 text-xs text-faint">{l.minutes} minutes</p>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{l.title}</h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <Avatar name={l.expert} size={22} /> {l.expert}, {l.expertTitle}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="tnum text-xs text-faint">{l.registered.toLocaleString()} registered</span>
                {l.status === "live" ? (
                  <Link href={user ? `/app/live/${l.id}` : "/login?next=/app/live/" + l.id} className="btn btn-primary">
                    Join now
                  </Link>
                ) : (
                  <button onClick={() => register(l.id, l.title)} className={on ? "btn btn-glass" : "btn btn-primary"}>
                    {on ? <Check size={15} /> : <CalendarPlus size={15} />}
                    {on ? "Reminder set" : "Remind me"}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </section>

      <section className="mt-16">
        <h2 className="text-lg font-semibold">Recordings</h2>
        <p className="mt-1 text-sm text-muted">Each recording comes with an AI transcript, lecture notes and slides.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {recorded.map((l) => (
            <Link key={l.id} href={user ? `/app/live/${l.id}` : "/login"} className="glass p-6 lift">
              <p className="text-xs text-faint">Recorded {fmtDateTime(l.start)}</p>
              <h3 className="mt-2 font-semibold">{l.title}</h3>
              <p className="mt-1 text-sm text-muted">{l.expert}</p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <ScrollText size={14} className="text-indigo" /> Transcript
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText size={14} className="text-indigo" /> {l.notes?.length} note sections
                </span>
                <span className="flex items-center gap-1.5">
                  <Presentation size={14} className="text-indigo" /> {l.slides?.length} slides
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
