"use client";

import { useState } from "react";
import { Plus, Star } from "lucide-react";
import { Avatar, Badge, Bar, Modal, PageHeader, Panel, PanelHead } from "@/components/ui";
import { mentors as seedMentors, students as seedStudents, type Mentor } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function AdminMentors() {
  const { toast } = useStore();
  const [mentors, setMentors] = useState(seedMentors);
  const [students, setStudents] = useState(seedStudents);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ name: "", kind: "Mentor" as Mentor["kind"], speciality: "", capacity: 20 });

  const load = (id: string) => students.filter((s) => s.mentor === id).length + (mentors.find((m) => m.id === id)!.mentees - seedStudents.filter((s) => s.mentor === id).length);

  const assign = (sid: string, mid: string) => {
    const m = mentors.find((x) => x.id === mid);
    if (m && load(mid) >= m.capacity) return toast(`${m.name} is at capacity`, "warn");
    setStudents(students.map((s) => (s.id === sid ? { ...s, mentor: mid || undefined } : s)));
    toast(mid ? `Assigned to ${m?.name}. Both have been emailed.` : "Mentor removed");
  };

  const unassigned = students.filter((s) => !s.mentor);

  return (
    <>
      <PageHeader
        title="Mentors and tutors"
        sub="Assign mentors to learners and keep an eye on capacity. Mentors write monthly text reports; tutors handle subject questions."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <Plus size={15} /> Add mentor or tutor
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mentors.map((m) => {
          const l = load(m.id);
          return (
            <div key={m.id} className="glass p-5">
              <div className="flex items-center gap-3">
                <Avatar name={m.name} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{m.name}</p>
                  <p className="text-xs text-faint">{m.speciality}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <Badge tone={m.kind === "Mentor" ? "indigo" : "orchid"}>{m.kind}</Badge>
                <span className="tnum flex items-center gap-1 text-muted">
                  <Star size={12} className="fill-amber text-amber" /> {m.rating}
                </span>
              </div>
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs text-muted">
                  <span>Load</span>
                  <span className="tnum">
                    {l} / {m.capacity}
                  </span>
                </div>
                <Bar value={(l / m.capacity) * 100} tone={l >= m.capacity ? "rose" : l / m.capacity > 0.8 ? "amber" : "mint"} />
              </div>
            </div>
          );
        })}
      </div>

      <Panel className="mt-5">
        <PanelHead title="Assignments" meta={`${unassigned.length} learner${unassigned.length === 1 ? "" : "s"} without a mentor`} />
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Group</th>
                <th>Weakest area</th>
                <th>Mentor</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size={28} />
                      <span className="font-medium">{s.name}</span>
                      {!s.mentor && <Badge tone="amber">Unassigned</Badge>}
                    </div>
                  </td>
                  <td className="text-muted">{s.group}</td>
                  <td className="text-muted">{s.weakest}</td>
                  <td>
                    <select className="field !h-8 !w-56 !text-sm" value={s.mentor ?? ""} onChange={(e) => assign(s.id, e.target.value)} aria-label={`Mentor for ${s.name}`}>
                      <option value="">No mentor</option>
                      {mentors.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.kind.toLowerCase()}, {m.speciality})
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Modal open={open} onClose={() => setOpen(false)} title="Add mentor or tutor">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!d.name.trim()) return;
            setMentors([...mentors, { id: "m" + Date.now(), name: d.name, kind: d.kind, speciality: d.speciality || "General", mentees: 0, capacity: d.capacity, rating: 0 }]);
            setOpen(false);
            toast(`${d.name} added. An invitation email has been sent.`);
          }}
        >
          <div>
            <label className="label">Name</label>
            <input className="field" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Role</label>
              <select className="field" value={d.kind} onChange={(e) => setD({ ...d, kind: e.target.value as Mentor["kind"] })}>
                <option>Mentor</option>
                <option>Tutor</option>
              </select>
            </div>
            <div>
              <label className="label">Capacity</label>
              <input type="number" className="field tnum" value={d.capacity} onChange={(e) => setD({ ...d, capacity: +e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Speciality</label>
            <input className="field" value={d.speciality} onChange={(e) => setD({ ...d, speciality: e.target.value })} placeholder="e.g. Bond, export incentives" />
          </div>
          <button className="btn btn-primary w-full">Add and invite</button>
        </form>
      </Modal>
    </>
  );
}
