"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, GraduationCap, ShieldCheck, UserRound } from "lucide-react";
import { useStore } from "@/lib/store";
import { nextParam } from "@/lib/next";
import { useT } from "@/lib/i18n";
import type { Role } from "@/lib/data";

const home: Record<Role, string> = { student: "/app", mentor: "/mentor", admin: "/admin" };

export default function Login() {
  const { login, toast } = useStore();
  const { t } = useT();
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const go = (role: Role) => {
    login(role);
    toast(role === "student" ? "Welcome back, Nadia" : role === "mentor" ? "Signed in to the mentor portal" : "Signed in to the admin portal");
    router.push(role === "student" ? nextParam(home.student) : home[role]);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return setErr("Password is at least 6 characters.");
    setErr("");
    const role: Role = id.startsWith("admin") ? "admin" : id.startsWith("shirin") || id.startsWith("mentor") ? "mentor" : "student";
    go(role);
  };

  return (
    <>
      <h1 className="font-display text-[1.7rem] font-semibold">{t("Log in")}</h1>
      <p className="mt-2 text-sm text-muted">
        {t("New here?")}{" "}
        <Link href="/signup" className="text-indigo hover:underline">
          {t("Create an account")}
        </Link>
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <div>
          <label className="label" htmlFor="id">
            {t("Email or mobile number")}
          </label>
          <input id="id" value={id} onChange={(e) => setId(e.target.value)} className="field" placeholder="you@company.com or 01XXXXXXXXX" autoComplete="username" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="pw">
              {t("Password")}
            </label>
            <button type="button" className="mb-1.5 text-xs text-indigo hover:underline" onClick={() => toast("We sent a 6-digit reset code to your email.")}>
              {t("Forgot password?")}
            </button>
          </div>
          <div className="relative">
            <input id="pw" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} className="field pr-11" autoComplete="current-password" required />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-faint hover:text-text" aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        {err && <p className="text-sm text-rose">{err}</p>}
        <button className="btn btn-primary btn-lg w-full">{t("Log in")}</button>
      </form>

      <div className="glass mt-8 p-4">
        <p className="text-sm font-semibold">{t("Explore the demo")}</p>
        <p className="mt-0.5 text-xs text-muted">{t("Sign in instantly as one of three sample accounts.")}</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              ["student", "Student", UserRound],
              ["mentor", "Mentor", GraduationCap],
              ["admin", "Admin", ShieldCheck],
            ] as const
          ).map(([r, label, Icon]) => (
            <button key={r} onClick={() => go(r)} className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-tint/[0.035] px-2 py-3 text-xs font-semibold text-muted transition-colors hover:border-indigo/40 hover:text-text">
              <Icon size={18} className="text-indigo" />
              {t(label)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
