"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Link2 } from "lucide-react";
import { Badge, Empty, Modal, PageHeader } from "@/components/ui";
import { certificates, fmtDate, getCourse, type Certificate } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Certificates() {
  const { user, toast } = useStore();
  const mine = certificates.filter((c) => c.student === user?.name);
  const [view, setView] = useState<Certificate | null>(null);

  return (
    <>
      <PageHeader title="Certificates" sub="Each certificate carries a serial number employers can check on the public verification page." />
      {mine.length === 0 ? (
        <div className="glass">
          <Empty title="No certificates yet" body="Finish a course and pass its final assessment to earn one." action={<Link href="/app/courses" className="btn btn-primary">Go to my courses</Link>} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {mine.map((c) => (
            <div key={c.id} className="glass overflow-hidden">
              <button onClick={() => setView(c)} className="block w-full text-left" aria-label="Open certificate">
                <CertArt c={c} name={user!.name} small />
              </button>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-semibold">{getCourse(c.course)?.title}</p>
                  <p className="tnum text-xs text-faint">
                    {c.serial}, issued {fmtDate(c.issued)}
                  </p>
                </div>
                <Badge tone={c.status === "valid" ? "mint" : "rose"}>{c.status === "valid" ? "Valid" : "Revoked"}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!view} onClose={() => setView(null)} title="Certificate" wide>
        {view && (
          <>
            <CertArt c={view} name={user!.name} />
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                className="btn btn-glass btn-sm"
                onClick={() => {
                  navigator.clipboard?.writeText(`${location.origin}/verify?serial=${view.serial}`).catch(() => {});
                  toast("Verification link copied");
                }}
              >
                <Link2 size={14} /> Copy verification link
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => toast("Downloading certificate PDF")}>
                <Download size={14} /> Download PDF
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

function CertArt({ c, name, small }: { c: Certificate; name: string; small?: boolean }) {
  return (
    <div className={`on-dark relative overflow-hidden ${small ? "aspect-[1.6] p-6" : "aspect-[1.414] p-10"}`} style={{ background: "#121848" }}>
      <div className="absolute inset-3 rounded-2xl border border-tint/10" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/mark.png" alt="" className={`absolute  ${small ? "right-4 top-4 w-12" : "right-8 top-8 w-20"}`} />
      <div className="relative flex h-full flex-col">
        <p className={`text-muted ${small ? "text-[0.65rem]" : "text-sm"}`}>AI Academy, Tradevics AI</p>
        <p className={`font-display mt-auto text-faint ${small ? "text-[0.7rem]" : "text-sm"}`}>This certifies that</p>
        <p className={`font-display font-semibold ${small ? "text-xl" : "mt-1 text-4xl"}`}>{name}</p>
        <p className={`text-muted ${small ? "mt-1 text-xs" : "mt-3 text-base"}`}>
          completed <span className="text-text">{getCourse(c.course)?.title}</span> with a final score of {c.score}%
        </p>
        <div className={`mt-auto flex items-end justify-between ${small ? "text-[0.6rem]" : "text-xs"} text-faint`}>
          <span className="tnum">{c.serial}</span>
          <span>{fmtDate(c.issued)}</span>
        </div>
      </div>
    </div>
  );
}
