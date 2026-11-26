"use client";

import { useState } from "react";
import { BadgeCheck, CircleAlert, ShieldX } from "lucide-react";
import { certificates, fmtDate, getCourse } from "@/lib/data";

export default function Verify() {
  const [serial, setSerial] = useState("");
  const [result, setResult] = useState<null | "missing" | (typeof certificates)[number]>(null);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    const c = certificates.find((x) => x.serial.toLowerCase() === serial.trim().toLowerCase());
    setResult(c ?? "missing");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pt-16 sm:px-6">
      <h1 className="font-display text-[2rem] font-semibold">Verify a certificate</h1>
      <p className="mt-3 text-muted">Enter the serial number printed at the bottom of the certificate.</p>

      <form onSubmit={check} className="glass mt-8 flex flex-col gap-3 p-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Serial number</span>
          <input value={serial} onChange={(e) => setSerial(e.target.value)} className="field tnum !rounded-full" placeholder="AIA-2026-04187" required />
        </label>
        <button className="btn btn-primary">Check certificate</button>
      </form>
      <p className="mt-3 text-xs text-faint">Try AIA-2026-04187 (valid) or AIA-2026-03512 (revoked).</p>

      {result === "missing" && (
        <div className="glass pop mt-8 flex gap-4 p-6">
          <CircleAlert className="shrink-0 text-amber" />
          <div>
            <p className="font-semibold">No certificate has that serial</p>
            <p className="mt-1 text-sm text-muted">Check for typing errors. Serials start with AIA- followed by the year.</p>
          </div>
        </div>
      )}
      {result && result !== "missing" && (
        <div className={`glass pop mt-8 p-6 ${result.status === "valid" ? "edge-lit" : ""}`}>
          <div className="flex items-center gap-3">
            {result.status === "revoked" ? <ShieldX className="text-rose" /> : <BadgeCheck className="text-mint" />}
            <p className="font-semibold">
              {result.status === "valid" && "This certificate is valid"}
              {result.status === "revoked" && "This certificate has been revoked"}
              {result.status === "pending" && "This certificate is awaiting issue"}
            </p>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-faint">Awarded to</dt>
              <dd className="mt-0.5">{result.student}</dd>
            </div>
            <div>
              <dt className="text-faint">Course</dt>
              <dd className="mt-0.5">{getCourse(result.course)?.title}</dd>
            </div>
            <div>
              <dt className="text-faint">Issued</dt>
              <dd className="mt-0.5">{fmtDate(result.issued)}</dd>
            </div>
            <div>
              <dt className="text-faint">Serial</dt>
              <dd className="tnum mt-0.5">{result.serial}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
