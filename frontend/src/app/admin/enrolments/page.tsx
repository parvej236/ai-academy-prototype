"use client";

import { useState } from "react";
import { Download, Plus, Search } from "lucide-react";
import { Avatar, Badge, Bar, Modal, PageHeader, Tabs } from "@/components/ui";
import { courses, students } from "@/lib/data";
import { useStore } from "@/lib/store";

const planTone = { none: "rose", monthly: "neutral", professional: "indigo", firm: "orchid" } as const;

export default function Enrolments() {
  const { toast } = useStore();
  const [plan, setPlan] = useState<"all" | "none" | "monthly" | "professional" | "firm">("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState(courses[0].slug);
  const rows = students.filter((s) => (plan === "all" || s.plan === plan) && (s.name + s.org + s.email).toLowerCase().includes(q.toLowerCase()));
  const allSel = rows.length > 0 && rows.every((r) => sel.includes(r.id));

  return (
    <>
      <PageHeader
        title="Enrolments"
        sub="Who is enrolled, on which plan, and how far they've got."
        actions={
          <>
            <button className="btn btn-glass btn-sm" onClick={() => toast("Exported 8 rows to CSV")}>
              <Download size={15} /> Export CSV
            </button>
            <button className="btn btn-primary btn-sm" disabled={!sel.length} onClick={() => setOpen(true)}>
              <Plus size={15} /> Enrol selected {sel.length > 0 && `(${sel.length})`}
            </button>
          </>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={plan}
          onChange={setPlan}
          tabs={[
            { id: "all", label: "All" },
            { id: "professional", label: "Professional" },
            { id: "firm", label: "Firm" },
            { id: "monthly", label: "Monthly" },
            { id: "none", label: "No plan" },
          ]}
        />
        <label className="relative sm:w-72">
          <span className="sr-only">Search</span>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="field !h-9 !rounded-full pl-9" placeholder="Name, company or email" />
        </label>
      </div>
      <div className="glass overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th className="w-10">
                <input type="checkbox" checked={allSel} onChange={() => setSel(allSel ? [] : rows.map((r) => r.id))} aria-label="Select all" className="accent-[var(--indigo)]" />
              </th>
              <th>Learner</th>
              <th>Company</th>
              <th>Group</th>
              <th>Plan</th>
              <th>Progress</th>
              <th>Last active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={sel.includes(s.id)}
                    onChange={() => setSel(sel.includes(s.id) ? sel.filter((x) => x !== s.id) : [...sel, s.id])}
                    aria-label={`Select ${s.name}`}
                    className="accent-[var(--indigo)]"
                  />
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size={30} />
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-xs text-faint">{s.email}</p>
                    </div>
                  </div>
                </td>
                <td className="text-muted">{s.org}</td>
                <td className="text-muted">{s.group}</td>
                <td>
                  <Badge tone={planTone[s.plan]}>{s.plan === "none" ? "No plan" : s.plan[0].toUpperCase() + s.plan.slice(1)}</Badge>
                </td>
                <td className="min-w-36">
                  <div className="flex items-center gap-2">
                    <Bar value={s.progress} className="w-20" />
                    <span className="tnum text-xs text-muted">{s.progress}%</span>
                  </div>
                </td>
                <td className="whitespace-nowrap text-muted">{new Date(s.lastActive).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Enrol ${sel.length} learner${sel.length === 1 ? "" : "s"}`}>
        <label className="label" htmlFor="course">
          Course
        </label>
        <select id="course" className="field" value={course} onChange={(e) => setCourse(e.target.value)}>
          {courses
            .filter((c) => c.status === "published")
            .map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
        </select>
        <p className="mt-3 text-xs text-faint">Learners without a plan will be enrolled but can only open preview lessons until they subscribe.</p>
        <button
          className="btn btn-primary mt-5 w-full"
          onClick={() => {
            toast(`Enrolled ${sel.length} in ${courses.find((c) => c.slug === course)?.title}`);
            setSel([]);
            setOpen(false);
          }}
        >
          Enrol learners
        </button>
      </Modal>
    </>
  );
}
