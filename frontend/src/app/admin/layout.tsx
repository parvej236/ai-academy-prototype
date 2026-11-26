import { PortalShell } from "@/components/shell/portal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="admin">{children}</PortalShell>;
}
