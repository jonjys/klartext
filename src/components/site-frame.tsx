import { type ReactNode, useEffect } from "react";
import { applyDocumentLang, t, useI18n } from "@/lib/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { SupportWidget } from "./support-widget";

export function SiteFrame({ children }: { children: ReactNode }) {
  const lang = useI18n((s) => s.lang);
  useEffect(() => {
    applyDocumentLang(lang);
  }, [lang]);

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-ink">
      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        {t(lang, "skip")}
      </a>
      <SiteHeader />
      <main id="innehall" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <SupportWidget />
    </div>
  );
}
