import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SupportWidget } from "./support-widget";

export function SiteFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <SupportWidget />
    </div>
  );
}
