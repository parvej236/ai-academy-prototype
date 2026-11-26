"use client";

import Link from "next/link";
import { BarChart, BarList } from "@/components/charts";
import { Badge, PageHeader, Panel, PanelHead, Stat, StateBadge } from "@/components/ui";
import { agentRuns, auditLog, courses, forumGroups, liveClasses, revenueByMonth, fmtDateTime } from "@/lib/data";

export default function AdminHome() {
  const queue = courses.filter((c) => c.status !== "published");
  return (
    <>
      <PageHeader
        title="Overview"
        sub="AI Academy at a glance, 26 Nov 2026."
        actions={
          <>
            <Link href="/admin/live" className="btn btn-glass btn-sm">
              Schedule a live class
            </Link>
            <Link href="/admin/courses" className="btn btn-primary btn-sm">
              New course
            </Link>
          </>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active subscribers" value="14,820" delta={{ v: "+6.1%", up: true }} foot="vs October" />
        <Stat label="Revenue this month" value="৳12.6M" delta={{ v: "+22%", up: true }} foot="bKash 48%, bank 31%, card 21%" />
        <Stat label="Completion rate" value="63%" delta={{ v: "+3 pts", up: true }} foot="Courses started in the last 90 days" />
        <Stat label="Lab attempts this week" value="9,412" delta={{ v: "−4%", up: false }} foot="Average score 66%" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel>
          <PanelHead title="Subscription revenue" meta="BDT millions per month" />
          <div className="px-4 pb-4">
            <BarChart data={revenueByMonth.map((r) => ({ x: r.m, y: r.v }))} label="Monthly revenue" fmt={(v) => `৳${v}M`} />
          </div>
        </Panel>
        <Panel>
          <PanelHead title="Members by professional group" />
          <div className="px-5 pb-5">
            <BarList data={forumGroups.map((g) => ({ name: g.name, value: g.members }))} unit="" max={4000} />
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel>
          <PanelHead title="Publishing queue" action={<Link href="/admin/courses" className="btn btn-ghost btn-sm">Open CMS</Link>} />
          <ul className="divide-y divide-line">
            {queue.map((c) => (
              <li key={c.slug} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <Link href={`/admin/courses/${c.slug}`} className="truncate hover:underline">
                  {c.title}
                </Link>
                <StateBadge state={c.status} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <PanelHead title="Live and upcoming" action={<Link href="/admin/live" className="btn btn-ghost btn-sm">Manage</Link>} />
          <ul className="divide-y divide-line">
            {liveClasses
              .filter((l) => l.status !== "recorded")
              .map((l) => (
                <li key={l.id} className="px-5 py-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate">{l.title}</span>
                    {l.status === "live" ? <Badge tone="rose" dot>Live</Badge> : <span className="tnum shrink-0 text-xs text-faint">{fmtDateTime(l.start)}</span>}
                  </div>
                </li>
              ))}
          </ul>
        </Panel>
        <Panel>
          <PanelHead title="AI agents" action={<Link href="/admin/ai" className="btn btn-ghost btn-sm">Details</Link>} />
          <ul className="divide-y divide-line">
            {agentRuns.slice(0, 5).map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <span className={`h-2 w-2 shrink-0 rounded-full ${r.status === "done" ? "bg-mint" : r.status === "review" ? "bg-amber" : "bg-rose"}`} />
                <span className="min-w-0 flex-1 truncate">{r.task}</span>
                <span className="tnum text-xs text-faint">{r.at}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="mt-5">
        <PanelHead title="Recent admin activity" action={<Link href="/admin/security" className="btn btn-ghost btn-sm">Full audit log</Link>} />
        <div className="overflow-x-auto">
          <table className="tbl">
            <tbody>
              {auditLog.map((a, i) => (
                <tr key={i}>
                  <td className="tnum whitespace-nowrap text-muted">{a.at}</td>
                  <td className="font-medium">{a.who}</td>
                  <td>{a.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
