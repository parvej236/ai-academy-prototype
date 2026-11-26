import { PortalShell } from "@/components/shell/portal";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="student">{children}</PortalShell>;
}
