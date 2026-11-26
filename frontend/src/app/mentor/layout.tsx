import { PortalShell } from "@/components/shell/portal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="mentor">{children}</PortalShell>;
}
