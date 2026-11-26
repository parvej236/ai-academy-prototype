"use client";

import { useState } from "react";
import { Flag, Pin, Plus } from "lucide-react";
import { Badge, Modal, PageHeader, Panel, PanelHead, Switch } from "@/components/ui";
import { forumGroups as seed, forumThreads } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function AdminCommunity() {
  const { toast } = useStore();
  const [groups, setGroups] = useState(seed.map((g) => ({ ...g, open: true, approval: g.id === "tax" })));
  const [threads, setThreads] = useState(forumThreads);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ name: "", description: "", moderator: "" });
  const flagged = threads.filter((t) => t.flagged);

  return (
    <>
      <PageHeader
        title="Community"
        sub="Professional discussion groups and moderation."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <Plus size={15} /> New group
          </button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHead title="Groups" />
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Members</th>
                  <th>Moderators</th>
                  <th>Open to all</th>
                  <th>Approve posts</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <tr key={g.id}>
                    <td>
                      <p className="font-medium">{g.name}</p>
                      <p className="max-w-xs text-xs text-faint">{g.description}</p>
                    </td>
                    <td className="tnum text-muted">{g.members.toLocaleString()}</td>
                    <td className="text-muted">{g.moderators.join(", ")}</td>
                    <td>
                      <Switch on={g.open} onChange={(v) => setGroups(groups.map((x) => (x.id === g.id ? { ...x, open: v } : x)))} label={`${g.name} open`} />
                    </td>
                    <td>
                      <Switch on={g.approval} onChange={(v) => setGroups(groups.map((x) => (x.id === g.id ? { ...x, approval: v } : x)))} label={`${g.name} approval`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel>
            <PanelHead title="Reported posts" meta={`${flagged.length} waiting`} />
            <ul className="divide-y divide-line">
              {flagged.length === 0 && <li className="px-5 pb-5 text-sm text-muted">Nothing to review.</li>}
              {flagged.map((t) => (
                <li key={t.id} className="px-5 py-4">
                  <p className="flex items-center gap-2 text-sm font-medium">
                    <Flag size={13} className="shrink-0 text-amber" /> {t.title}
                  </p>
                  <p className="mt-1 text-xs text-faint">
                    {t.author}, reported for &ldquo;possible client details&rdquo;
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="btn btn-glass btn-sm" onClick={() => { setThreads(threads.map((x) => (x.id === t.id ? { ...x, flagged: false } : x))); toast("Report dismissed"); }}>
                      Keep post
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => { setThreads(threads.filter((x) => x.id !== t.id)); toast("Post removed and author notified", "warn"); }}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <PanelHead title="Pinned threads" />
            <ul className="divide-y divide-line">
              {threads.slice(0, 4).map((t) => (
                <li key={t.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="min-w-0 flex-1 truncate">{t.title}</span>
                  <button
                    onClick={() => setThreads(threads.map((x) => (x.id === t.id ? { ...x, pinned: !x.pinned } : x)))}
                    className={`btn btn-sm !px-2 ${t.pinned ? "btn-glass text-indigo" : "btn-ghost"}`}
                    aria-pressed={!!t.pinned}
                    aria-label="Pin thread"
                  >
                    <Pin size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New discussion group">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!d.name.trim()) return;
            setGroups([...groups, { id: "g" + Date.now(), name: d.name, description: d.description, members: 0, hue: 200, moderators: [d.moderator || "Unassigned"], open: true, approval: false }]);
            setOpen(false);
            toast(`Group "${d.name}" created`);
          }}
        >
          <div>
            <label className="label">Name</label>
            <input className="field" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="e.g. Customs Bond Officers" />
          </div>
          <div>
            <label className="label">Description</label>
            <input className="field" value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Moderator</label>
            <input className="field" value={d.moderator} onChange={(e) => setD({ ...d, moderator: e.target.value })} />
          </div>
          <Badge>Members join from the Community page</Badge>
          <button className="btn btn-primary w-full">Create group</button>
        </form>
      </Modal>
    </>
  );
}
