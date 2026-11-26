"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useStore } from "@/lib/store";
import { nextParam } from "@/lib/next";
import { useT } from "@/lib/i18n";

const groups = ["Importer", "C&F Agent", "Tax Practitioner", "Freight Forwarder", "Exporter", "Student / aspiring agent"];

export default function Signup() {
  const { signup, toast } = useStore();
  const { t } = useT();
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [f, setF] = useState({ name: "", email: "", phone: "", org: "", group: groups[0], pw: "", pw2: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 3) er.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email address.";
    if (!/^01[3-9]\d{8}$/.test(f.phone)) er.phone = "Use an 11-digit Bangladeshi mobile number, e.g. 01712345678.";
    if (f.pw.length < 8) er.pw = "Use at least 8 characters.";
    if (f.pw !== f.pw2) er.pw2 = "Passwords don't match.";
    setErrs(er);
    if (Object.keys(er).length === 0) {
      setStep("otp");
      toast(`We sent a 6-digit code to ${f.email}`);
    }
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const verify = () => {
    signup(f.name, f.email, f.org || "Independent");
    toast("Account verified. Choose a plan to unlock the academy.");
    router.push(nextParam("/pricing"));
  };

  if (step === "otp") {
    return (
      <>
        <h1 className="font-display text-[1.7rem] font-semibold">{t("Check your email")}</h1>
        <p className="mt-2 text-sm text-muted">
          Enter the 6-digit code we sent to <span className="text-text">{f.email}</span>. It expires in 10 minutes.
        </p>
        <div className="mt-8 flex justify-between gap-2" onPaste={(e) => {
          const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
          if (t.length) { setOtp([...t, ...Array(6 - t.length).fill("")]); e.preventDefault(); }
        }}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => e.key === "Backspace" && !d && i > 0 && refs.current[i - 1]?.focus()}
              inputMode="numeric"
              aria-label={`Digit ${i + 1}`}
              className="field tnum !h-14 !w-12 text-center font-display !text-xl sm:!w-14"
            />
          ))}
        </div>
        <button onClick={verify} disabled={otp.join("").length < 6} className="btn btn-primary btn-lg mt-6 w-full">
          {t("Verify and continue")}
        </button>
        <p className="mt-4 text-center text-xs text-faint">Demo: any 6 digits will work.</p>
        <button onClick={() => setStep("form")} className="mt-2 w-full text-center text-sm text-indigo hover:underline">
          {t("Change email address")}
        </button>
      </>
    );
  }

  const Field = ({ k, label, type = "text", ph, ac }: { k: keyof typeof f; label: string; type?: string; ph?: string; ac?: string }) => (
    <div>
      <label className="label" htmlFor={k}>
        {t(label)}
      </label>
      <input id={k} type={type} value={f[k]} onChange={upd(k)} className="field" placeholder={ph} autoComplete={ac} aria-invalid={!!errs[k]} />
      {errs[k] && <p className="mt-1 text-xs text-rose">{errs[k]}</p>}
    </div>
  );

  return (
    <>
      <h1 className="font-display text-[1.7rem] font-semibold">{t("Create your account")}</h1>
      <p className="mt-2 text-sm text-muted">
        {t("Already have one?")}{" "}
        <Link href="/login" className="text-indigo hover:underline">
          {t("Log in")}
        </Link>
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        {Field({ k: "name", label: "Full name", ac: "name" })}
        <div className="grid gap-4 sm:grid-cols-2">
          {Field({ k: "email", label: "Email", type: "email", ac: "email" })}
          {Field({ k: "phone", label: "Mobile number", type: "tel", ph: "01XXXXXXXXX", ac: "tel" })}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Field({ k: "org", label: "Company (optional)", ac: "organization" })}
          <div>
            <label className="label" htmlFor="group">
              {t("I work as")}
            </label>
            <select id="group" value={f.group} onChange={upd("group")} className="field">
              {groups.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Field({ k: "pw", label: "Password", type: "password", ac: "new-password" })}
          {Field({ k: "pw2", label: "Confirm password", type: "password", ac: "new-password" })}
        </div>
        <button className="btn btn-primary btn-lg w-full">{t("Send verification code")}</button>
        <p className="text-center text-xs text-faint">{t("By creating an account you agree to the terms and privacy policy.")}</p>
      </form>
    </>
  );
}
