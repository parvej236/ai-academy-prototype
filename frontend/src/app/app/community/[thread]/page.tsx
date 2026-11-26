"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowBigUp, CheckCircle2, ChevronLeft, Flag } from "lucide-react";
import { Avatar, Badge } from "@/components/ui";
import { forumGroups } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ago } from "@/lib/time";

export default function Thread() {
  const { thread } = useParams<{ thread: string }>();
  const { threads, addReply, voteThread, toast } = useStore();
  const t = threads.find((x) => x.id === thread);
  const [body, setBody] = useState("");
  if (!t) notFound();
  const g = forumGroups.find((x) => x.id === t.group);

  const reply = (e: React.FormEvent) => {
    e.preventDefault();
    if (body.trim().length < 5) return;
    addReply(t.id, body);
    setBody("");
    toast("Reply posted");
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/app/community" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
        <ChevronLeft size={15} /> {g?.name ?? "Community"}
      </Link>
      <article className="glass mt-4 p-6">
        <div className="flex gap-4">
          <button onClick={() => voteThread(t.id)} className="flex h-fit w-12 shrink-0 flex-col items-center rounded-xl border border-line py-2 text-muted hover:border-indigo/40 hover:text-indigo" aria-label="Upvote">
            <ArrowBigUp size={20} />
            <span className="tnum text-sm font-semibold">{t.votes}</span>
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold leading-snug">{t.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-faint">
              <Avatar name={t.author} size={20} /> {t.author}, {t.role}, {ago(t.at)}
              {t.tags.map((x) => (
                <Badge key={x} tone="cyan">
                  {x}
                </Badge>
              ))}
            </div>
            <p className="mt-4 leading-relaxed text-muted">{t.body}</p>
            <button onClick={() => toast("Reported to the moderators")} className="mt-4 inline-flex items-center gap-1.5 text-xs text-faint hover:text-text">
              <Flag size={12} /> Report
            </button>
          </div>
        </div>
      </article>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-muted">
        {t.replies.length} {t.replies.length === 1 ? "reply" : "replies"}
      </h2>
      <div className="space-y-3">
        {t.replies.map((r) => (
          <div key={r.id} className={`glass p-5 ${r.accepted ? "!border-mint/30" : ""}`}>
            <div className="flex items-center gap-2.5 text-sm">
              <Avatar name={r.author} size={28} />
              <span className="font-semibold">{r.author}</span>
              {r.role === "Moderator" ? <Badge tone="indigo">Moderator</Badge> : <span className="text-xs text-faint">{r.role}</span>}
              <span className="text-xs text-faint">{ago(r.at)}</span>
              {r.accepted && (
                <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-mint">
                  <CheckCircle2 size={14} /> Accepted answer
                </span>
              )}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">{r.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={reply} className="glass mt-5 p-5">
        <label className="label" htmlFor="reply">
          Your reply
        </label>
        <textarea id="reply" rows={4} value={body} onChange={(e) => setBody(e.target.value)} className="field" placeholder="Share what worked for you. Cite the rule or SRO if you can." />
        <div className="mt-3 flex justify-end">
          <button className="btn btn-primary btn-sm">Post reply</button>
        </div>
      </form>
    </div>
  );
}
