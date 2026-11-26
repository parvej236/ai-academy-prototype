"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar, Badge, Bar, PageHeader, Tabs, scoreTone } from "@/components/ui";
import { riskTone, students } from "@/lib/data";

export default function MentorStudents() {
  const [f, setF] = useState<"all" | "on track" | "watch" | "at risk">("all");
  const [q, setQ] = useState("");
  const list = students
    .filter((s) => s.mentor === "m1" || s.mentor === "m3")
    .filter((s) => f === "all" || s.risk === f)
    .filter((s) => (s.name + s.org).toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <PageHeader title="My students" sub="Everyone assigned to you as mentor or tutor." />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={f}
          onChange={setF}
          tabs={[
            { id: "all", label: "All" },
            { id: "on track", label: "On track" },
            { id: "watch", label: "Watch" },
            { id: "at risk", label: "At risk" },
          ]}
        />
        <label className="relative sm:w-72">
          <span className="sr-only">Search students</span>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="field !h-9 !rounded-full pl-9" placeholder="Search by name or company" />
        </label>
      </div>
      <div className="glass overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Student</th>
              <th>Group</th>
              <th>Progress</th>
              <th>Average</th>
              <th>Weakest area</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size={32} />
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-faint">{s.org}</p>
                    </div>
                  </div>
                </td>
                <td className="text-muted">{s.group}</td>
                <td className="min-w-36">
                  <div className="flex items-center gap-2">
                    <Bar value={s.progress} className="w-20" />
                    <span className="tnum text-xs text-muted">{s.progress}%</span>
                  </div>
                </td>
                <td>
                  <Badge tone={scoreTone(s.avgScore)}>{s.avgScore}%</Badge>
                </td>
                <td className="text-muted">{s.weakest}</td>
                <td>
                  <Badge tone={riskTone[s.risk]} dot>
                    {s.risk}
                  </Badge>
                </td>
                <td className="text-right">
                  <Link href={`/mentor/students/${s.id}`} className="btn btn-glass btn-sm">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
