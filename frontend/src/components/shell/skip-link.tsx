"use client";

import { useT } from "@/lib/i18n";

/* First stop for keyboard users: jumps past the navigation to the page content. */
export function SkipLink() {
  const { t } = useT();
  return (
    <a href="#main" className="skip-link">
      {t("Skip to content")}
    </a>
  );
}
