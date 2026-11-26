"use client";

import Link from "next/link";
import { useState } from "react";
import { BellRing, Check } from "lucide-react";
import { Paywall } from "@/components/shell/portal";
import { Avatar, Badge, PageHeader, Tabs } from "@/components/ui";
import { fmtDateTime, liveClasses } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Live() {
  const { registeredLive, toggleLive, toast } = useStore();
  const [tab, setTab] = useState<"upcoming" | "recorded">("upcoming");
  const list = liveClasses.filter((l) => (tab === "upcoming" ? l.status !== "recorded" : l.status === "recorded"));

  return (
    <>
      <PageHeader title="Live classes" sub="Sessions with subject-matter experts. You're notified when one is scheduled, and again 15 minutes before it starts." />
      <Paywall what="Expert-led live classes">
        <Tabs
          className="mb-5"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "upcoming", label: "Upcoming" },
            { id: "recorded", label: "Recordings" },
          ]}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((l) => {
            const on = registeredLive.includes(l.id);
            return (
              <article key={l.id} className={`glass flex flex-col p-6 ${l.status === "live" ? "edge-lit" : ""}`}>
                <div className="flex items-center justify-between">
                  {l.status === "live" ? (
                    <Badge tone="rose" dot>
                      Live now
                    </Badge>
                  ) : (
                    <span className="tnum text-sm text-muted">{fmtDateTime(l.start)}</span>
                  )}
                  <span className="tnum text-xs text-faint">{l.minutes} min</span>
                </div>
                <h2 className="mt-4 font-semibold leading-snug">{l.title}</h2>
                <div className="mt-3 flex items-center gap-2.5 text-sm">
                  <Avatar name={l.expert} size={28} />
                  <div>
                    <p>{l.expert}</p>
                    <p className="text-xs text-faint">{l.expertTitle}</p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <span className="tnum text-xs text-faint">{l.registered.toLocaleString()} registered</span>
                  {l.status === "scheduled" ? (
                    <button
                      onClick={() => {
                        toggleLive(l.id);
                        toast(on ? "Reminder removed" : "Reminder set for 15 minutes before the start");
                      }}
                      className={on ? "btn btn-glass btn-sm" : "btn btn-primary btn-sm"}
                    >
                      {on ? <Check size={14} /> : <BellRing size={14} />} {on ? "Reminder set" : "Remind me"}
                    </button>
                  ) : (
                    <Link href={`/app/live/${l.id}`} className="btn btn-primary btn-sm">
                      {l.status === "live" ? "Join class" : "Watch with notes"}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Paywall>
    </>
  );
}
