"use client";

import { Logo } from "@/components/ui";
import { LangToggle, useT } from "@/lib/i18n";
import { PortScene } from "@/components/illustrations";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <LangToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
      <aside className="relative m-3 hidden overflow-hidden rounded-[28px] bg-[#0f1433] text-white lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mark.png" alt="" className="absolute left-12 top-12 w-14" />
        <PortScene className="absolute inset-x-8 top-28 mx-auto w-[min(92%,560px)]" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="font-display max-w-md text-[1.9rem] font-semibold leading-tight tracking-tight">
            {t("The academy for people who clear goods, file returns and answer to assessing officers.")}
          </p>
          <p className="mt-4 max-w-sm text-sm text-white/60">{t("AI Academy is part of Tradevics AI. One account works across both.")}</p>
        </div>
      </aside>
    </div>
  );
}
