import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { Toaster } from "@/components/ui";
import { SkipLink } from "@/components/shell/skip-link";
import "./globals.css";

// Inter for Latin, Noto Sans Bengali for Bangla: Noto is drawn to match Inter's
// x-height and weight range, so mixed-script lines sit together cleanly.
const inter = Inter({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const bangla = Noto_Sans_Bengali({ variable: "--font-bangla", subsets: ["bengali"], weight: ["400", "500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "AI Academy — trade and customs training by Tradevics AI", template: "%s · AI Academy" },
  description:
    "Courses, AI case simulations, exams and expert-led live classes for importers, C&F agents and tax practitioners in Bangladesh.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bangla.variable}`}>
      <body className="min-h-dvh">
        <div className="ambient" aria-hidden />
        <StoreProvider>
          <SkipLink />
          {children}
          <Toaster />
        </StoreProvider>
      </body>
    </html>
  );
}
