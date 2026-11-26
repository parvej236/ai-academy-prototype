"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowBigUp, MessageSquare, Pin, Plus, Search } from "lucide-react";
import { Avatar, Badge, Empty, Modal, PageHeader, Tabs, cx } from "@/components/ui";
import { forumGroups } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ago } from "@/lib/time";

export default function Community() {
  const { threads, joinedGroups, toggleGroup, addThread, voteThread, toast } = useStore();
  const router = useRouter();
  const [group, setGroup] = useState<string>("all");
  const [sort, setSort] = useState<"latest" | "top" | "unanswered">("latest");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ group: forumGroups[0].id, title: "", body: "", tags: "" });

  const list = useMemo(() => {
    let l = threads.filter((t) => group === "all" || t.group === group);
    if (q) l = l.filter((t) => (t.title + t.body).toLowerCase().includes(q.toLowerCase()));
    if (sort === "top") l = [...l].sort((a, b) => b.votes - a.votes);
    else if (sort === "unanswered") l = l.filter((t) => t.replies.length === 0);
    else l = [...l].sort((a, b) => +new Date(b.at) - +new Date(a.at));
    return [...l.filter((t) => t.pinned), ...l.filter((t) => !t.pinned)];
  }, [threads, group, q, sort]);

  const g = forumGroups.find((x) => x.id === group);

  const post = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.title.trim().length < 10) return toast("Give your question a title of at least 10 characters.", "warn");
    const id = addThread({ group: draft.group, title: draft.title, body: draft.body, tags: draft.tags.split(",").map((t) => t.trim()).filter(Boolean) });
    setOpen(false);
    setDraft({ group: forumGroups[0].id, title: "", body: "", tags: "" });
    toast("Question posted");
    router.push(`/app/community/${id}`);
  };

  return (
    <>
      <PageHeader
        title="Community"
        sub="Specialised groups for importers, C&F agents, tax practitioners and other trade professionals. Moderated by practitioners."
        actions={
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Ask a question
          </button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <aside className="glass h-fit p-2">
          <button
            onClick={() => setGroup("all")}
            className={cx("w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium", group === "all" ? "bg-tint/10" : "text-muted hover:bg-tint/5")}
          >
            All groups
          </button>
          {forumGroups.map((x) => (
            <button
              key={x.id}
              onClick={() => setGroup(x.id)}
              className={cx("flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm", group === x.id ? "bg-tint/10" : "text-muted hover:bg-tint/5")}
            >
              <span className="h-2 w-2 rotate-45 rounded-[2px]" style={{ background: `hsl(${x.hue} 80% 60%)` }} />
              <span className="flex-1">{x.name}</span>
              {joinedGroups.includes(x.id) && <span className="text-[0.7rem] text-faint">Joined</span>}
            </button>
          ))}
        </aside>

        <div className="min-w-0 space-y-4">
          {g && (
            <div className="glass flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <h2 className="font-semibold">{g.name}</h2>
                <p className="mt-0.5 text-sm text-muted">{g.description}</p>
                <p className="tnum mt-1 text-xs text-faint">
                  {g.members.toLocaleString()} members, moderated by {g.moderators.join(", ")}
                </p>
              </div>
              <button
                className={joinedGroups.includes(g.id) ? "btn btn-glass btn-sm" : "btn btn-primary btn-sm"}
                onClick={() => {
                  toggleGroup(g.id);
                  toast(joinedGroups.includes(g.id) ? `Left ${g.name}` : `Joined ${g.name}`);
                }}
              >
                {joinedGroups.includes(g.id) ? "Leave group" : "Join group"}
              </button>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={sort}
              onChange={setSort}
              tabs={[
                { id: "latest", label: "Latest" },
                { id: "top", label: "Top" },
                { id: "unanswered", label: "Unanswered" },
              ]}
            />
            <label className="relative sm:w-72">
              <span className="sr-only">Search threads</span>
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
              <input value={q} onChange={(e) => setQ(e.target.value)} className="field !h-9 !rounded-full pl-9" placeholder="Search threads" />
            </label>
          </div>

          <div className="glass divide-y divide-line overflow-hidden">
            {list.length === 0 && <Empty title="No threads here yet" body="Ask the first question in this group." />}
            {list.map((t) => {
              const tg = forumGroups.find((x) => x.id === t.group);
              return (
                <div key={t.id} className="flex gap-4 p-5 transition-colors hover:bg-tint/[0.02]">
                  <button
                    onClick={() => voteThread(t.id)}
                    className="flex h-fit w-11 shrink-0 flex-col items-center rounded-xl border border-line py-1.5 text-muted transition-colors hover:border-indigo/40 hover:text-indigo"
                    aria-label={`Upvote, ${t.votes} votes`}
                  >
                    <ArrowBigUp size={18} />
                    <span className="tnum text-xs font-semibold">{t.votes}</span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {t.pinned && <Pin size={13} className="text-indigo" />}
                      <Link href={`/app/community/${t.id}`} className="font-semibold leading-snug hover:underline">
                        {t.title}
                      </Link>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-muted">{t.body}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-faint">
                      <span className="flex items-center gap-1.5">
                        <Avatar name={t.author} size={18} /> {t.author}, {t.role}
                      </span>
                      <span>{ago(t.at)}</span>
                      {group === "all" && tg && <Badge>{tg.name}</Badge>}
                      {t.tags.map((x) => (
                        <Badge key={x} tone="cyan">
                          {x}
                        </Badge>
                      ))}
                      <span className="tnum ml-auto flex items-center gap-1">
                        <MessageSquare size={13} /> {t.replies.length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Ask the community">
        <form onSubmit={post} className="space-y-4">
          <div>
            <label className="label" htmlFor="g">
              Group
            </label>
            <select id="g" value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value })} className="field">
              {forumGroups.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="t">
              Question
            </label>
            <input id="t" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="field" placeholder="Be specific: port, HS code, document" />
          </div>
          <div>
            <label className="label" htmlFor="b">
              Details
            </label>
            <textarea id="b" rows={5} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} className="field" placeholder="Don't share client names or BL numbers." />
          </div>
          <div>
            <label className="label" htmlFor="tags">
              Tags
            </label>
            <input id="tags" value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} className="field" placeholder="HS, Benapole, VAT" />
          </div>
          <button className="btn btn-primary w-full">Post question</button>
        </form>
      </Modal>
    </>
  );
}
