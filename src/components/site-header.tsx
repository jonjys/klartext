import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LangPicker } from "./lang-picker";
import { Button } from "./ui/button";
import { t, useI18n } from "@/lib/i18n";

const NAV = [
  { to: "/brev", key: "nav_brev" },
  { to: "/dokument", key: "nav_docs" },
  { to: "/priser", key: "nav_prices" },
  { to: "/guider", key: "nav_guides" },
  { to: "/support", key: "nav_support" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const lang = useI18n((s) => s.lang);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link to="/" className="font-display text-xl italic tracking-tight text-ink">
          Skrivklart
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted transition-opacity duration-150 hover:text-ink"
            >
              {t(lang, item.key)}
            </Link>
          ))}
          <LangPicker />
          <Button asChild size="sm">
            <Link to="/dokument">{t(lang, "nav_write")}</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <LangPicker />
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg text-ink"
            aria-label={open ? "Close" : "Menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line bg-bg px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex h-11 items-center text-base font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {t(lang, item.key)}
              </Link>
            ))}
            <Button asChild className="mt-2 w-full">
              <Link to="/dokument" onClick={() => setOpen(false)}>
                {t(lang, "nav_write")}
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
