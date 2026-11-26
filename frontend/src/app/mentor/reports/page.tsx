"use client";

import Link from "next/link";
import { Badge, PageHeader } from "@/components/ui";
import { fmtDate, mentorReports, students } from "@/lib/data";

export default function MentorReports() {
  const due = students.filter((s) => s.mentor === "m1" && !mentorReports.some((r) => r.student === s.id));
  return (
    <>
      <PageHeader title="Reports" sub="Monthly performance and training reports. Text only, so they can be forwarded to firm admins as-is." />
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          {mentorReports.map((r) => {
            const s = students.find((x) => x.id === r.student)!;
            return (
              <article key={r.id} className="glass p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/mentor/students/${s.id}`} className="font-semibold hover:underline">
                    {s.name}
                  </Link>
                  <Badge tone={r.rating === "At risk" ? "rose" : "mint"}>{r.rating}</Badge>
                </div>
                <p className="mt-1 text-xs text-faint">
                  {r.period}, published {fmtDate(r.date)}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.summary}</p>
              </article>
            );
          })}
        </div>
        <aside className="glass h-fit p-5">
          <p className="font-semibold">Due by 30 Nov</p>
          <ul className="mt-3 divide-y divide-line">
            {due.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3 text-sm">
                {s.name}
                <Link href={`/mentor/students/${s.id}`} className="btn btn-glass btn-sm">
                  Write
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
