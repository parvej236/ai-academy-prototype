"use client";

import Link from "next/link";
import { LostArt } from "@/components/illustrations";
import { Logo } from "@/components/ui";
import { useT } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useT();
  return (
    <div className="flex min-h-dvh flex-col px-5 py-6 sm:px-10">
      <Logo />
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <LostArt className="w-full max-w-sm" />
        <h1 className="font-display mt-6 text-2xl font-semibold">{t("This page isn't on the manifest")}</h1>
        <p className="mt-2 max-w-sm text-muted">{t("The link may be old or mistyped. Go back to the home page or browse the courses.")}</p>
        <div className="mt-6 flex gap-2">
          <Link href="/" className="btn btn-primary">
            {t("Go to home page")}
          </Link>
          <Link href="/courses" className="btn btn-glass">
            {t("Browse courses")}
          </Link>
        </div>
      </div>
    </div>
  );
}
