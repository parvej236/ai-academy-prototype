"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Avatar, Cover, Modal, PageHeader, StateBadge, Tabs } from "@/components/ui";
import { categories, courses as seed, lessonCount, type Course, type PublishState } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function AdminCourses() {
  const { toast } = useStore();
  const router = useRouter();
  const [list, setList] = useState<Course[]>(seed);
  const [f, setF] = useState<"all" | PublishState>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ title: "", category: "Classification", level: "Foundation", instructor: "" });

  const rows = list.filter((c) => (f === "all" || c.status === f) && c.title.toLowerCase().includes(q.toLowerCase()));
  const count = (s: PublishState) => list.filter((c) => c.status === s).length;

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (d.title.trim().length < 5) return toast("Give the course a title.", "warn");
    const slug = d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const c: Course = {
      slug,
      code: d.title.slice(0, 2).toUpperCase(),
      title: d.title,
      summary: "",
      category: d.category,
      level: d.level as Course["level"],
      hours: 0,
      rating: 0,
      learners: 0,
      instructor: d.instructor || "Unassigned",
      instructorTitle: "",
      audience: [],
      outcomes: [],
      hue: Math.floor(Math.random() * 360),
      status: "draft",
      updated: new Date().toISOString(),
      modules: [{ title: "Module 1", lessons: [] }],
    };
    setList([c, ...list]);
    setOpen(false);
    toast(`Draft "${d.title}" created`);
    router.push(`/admin/courses/new?${new URLSearchParams({ title: d.title, category: d.category, level: d.level, instructor: d.instructor })}`);
  };

  return (
    <>
      <PageHeader
        title="Courses and CMS"
        sub="Create courses, edit lessons and control what is published. Curriculum is authored by the academy's subject experts."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <Plus size={15} /> New course
          </button>
        }
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={f}
          onChange={setF}
          tabs={[
            { id: "all", label: `All (${list.length})` },
            { id: "published", label: `Published (${count("published")})` },
            { id: "review", label: `In review (${count("review")})` },
            { id: "draft", label: `Draft (${count("draft")})` },
          ]}
        />
        <label className="relative sm:w-64">
          <span className="sr-only">Search</span>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="field !h-9 !rounded-full pl-9" placeholder="Search courses" />
        </label>
      </div>
      <div className="glass overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Course</th>
              <th>Instructor</th>
              <th>Lessons</th>
              <th>Learners</th>
              <th>Status</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.slug}>
                <td>
                  <div className="flex items-center gap-3">
                    <Cover code={c.code} hue={c.hue} category={c.category} className="h-10 w-10 shrink-0 rounded-lg [&>span]:hidden" />
                    <div>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-faint">
                        {c.category}, {c.level}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="flex items-center gap-2 whitespace-nowrap text-muted">
                    <Avatar name={c.instructor} size={22} /> {c.instructor}
                  </span>
                </td>
                <td className="tnum text-muted">{lessonCount(c)}</td>
                <td className="tnum text-muted">{c.learners.toLocaleString()}</td>
                <td>
                  <StateBadge state={c.status} />
                </td>
                <td className="tnum whitespace-nowrap text-muted">{new Date(c.updated).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                <td className="text-right">
                  <Link
                    href={seed.some((s) => s.slug === c.slug) ? `/admin/courses/${c.slug}` : `/admin/courses/new?${new URLSearchParams({ title: c.title, category: c.category, level: c.level })}`}
                    className="btn btn-glass btn-sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New course">
        <form onSubmit={create} className="space-y-4">
          <div>
            <label className="label" htmlFor="ct">
              Title
            </label>
            <input id="ct" className="field" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} placeholder="e.g. Export documentation for RMG" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="cc">
                Category
              </label>
              <select id="cc" className="field" value={d.category} onChange={(e) => setD({ ...d, category: e.target.value })}>
                {categories.slice(1).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="cl">
                Level
              </label>
              <select id="cl" className="field" value={d.level} onChange={(e) => setD({ ...d, level: e.target.value })}>
                <option>Foundation</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label" htmlFor="ci">
              Instructor
            </label>
            <input id="ci" className="field" value={d.instructor} onChange={(e) => setD({ ...d, instructor: e.target.value })} />
          </div>
          <button className="btn btn-primary w-full">Create draft</button>
        </form>
      </Modal>
    </>
  );
}
