"use client";

import Link from "next/link";
import { AlertTriangle, Video } from "lucide-react";
import { BarList } from "@/components/charts";
import { Avatar, Badge, PageHeader, Panel, PanelHead, Stat } from "@/components/ui";
import { fmtDateTime, gradingQueue, mentorSessions, riskTone, students } from "@/lib/data";
import { useStore } from "@/lib/store";



export default function MentorHome() {
  const { user } = useStore();
  const mine = students.filter((s) => s.mentor === "m1");
  const atRisk = mine.filter((s) => s.risk !== "on track");
  const weak = Object.entries(
    mine.reduce<Record<string, number>>((acc, s) => {
      acc[s.weakest] = (acc[s.weakest] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  return (
    <>
      <PageHeader title={`Welcome, ${user?.name.split(" ")[0]}`} sub="Your mentees, their progress, and what needs your attention this week." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Assigned students" value={mine.length} foot="Capacity 25" />
        <Stat label="Need attention" value={atRisk.length} foot="Watch or at risk" />
        <Stat label="Average score" value={`${Math.round(mine.reduce((n, s) => n + s.avgScore, 0) / mine.length)}%`} delta={{ v: "+4", up: true }} />
        <Stat label="Reports due" value={2} foot="Monthly reports close on 30 Nov" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHead title="Needs attention" meta="Flagged from login gaps and falling scores" action={<Link href="/mentor/students" className="btn btn-ghost btn-sm">All students</Link>} />
          <ul className="divide-y divide-line">
            {atRisk.map((s) => (
              <li key={s.id}>
                <Link href={`/mentor/students/${s.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-tint/[0.03]">
                  <Avatar name={s.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-faint">
                      {s.org}, last active {new Date(s.lastActive).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <Badge tone={riskTone[s.risk]}>{s.risk}</Badge>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-5 mb-5 flex gap-3 rounded-xl border border-amber/25 bg-amber/[0.07] p-3.5 text-sm">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber" />
            <p className="text-muted">Mizanur Rahman hasn&apos;t logged in for 18 days. His firm admin has been copied on the last report.</p>
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel>
            <PanelHead title="Next sessions" action={<Link href="/mentor/sessions" className="btn btn-ghost btn-sm">Schedule</Link>} />
            <ul className="divide-y divide-line">
              {mentorSessions.map((s) => (
                <li key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                  <Video size={16} className="text-indigo" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.topic}</p>
                    <p className="tnum text-xs text-faint">
                      {students.find((x) => x.id === s.student)?.name}, {fmtDateTime(s.at)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <PanelHead title="Weakest area across mentees" meta="Number of students" />
            <div className="px-5 pb-5">
              <BarList data={weak} unit="" max={Math.max(...weak.map((w) => w.value))} />
            </div>
          </Panel>
        </div>
      </div>

      <Panel className="mt-5">
        <PanelHead title="Viva answers waiting for your review" meta="The Evaluation Engine was unsure about these" />
        <ul className="divide-y divide-line">
          {gradingQueue.map((g) => (
            <li key={g.id} className="flex flex-wrap items-center gap-4 px-5 py-3.5 text-sm">
              <span className="flex-1">
                <span className="font-medium">{g.student}</span> <span className="text-muted">on {g.exam}</span>
                <span className="block text-xs text-faint">{g.reason}</span>
              </span>
              <span className="tnum text-muted">AI mark {g.aiScore}</span>
              <Link href="/mentor/students/s2" className="btn btn-glass btn-sm">
                Review
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
