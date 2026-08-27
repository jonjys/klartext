import { Link } from "@tanstack/react-router";
import { t, useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const lang = useI18n((s) => s.lang);
  return (
    <footer className="border-t border-line bg-bg-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg italic text-ink">Skrivklart</p>
          <p className="mt-2 max-w-xs text-sm text-muted">{t(lang, "footer_blurb")}</p>
          <p className="mt-2 max-w-xs text-xs text-subtle">{t(lang, "lang_note")}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <Link to="/brev" className="text-muted hover:text-ink">
            {t(lang, "nav_brev")}
          </Link>
          <Link to="/dokument" className="text-muted hover:text-ink">
            {t(lang, "nav_docs")}
          </Link>
          <Link to="/priser" className="text-muted hover:text-ink">
            {t(lang, "nav_prices")}
          </Link>
          <Link to="/guider" className="text-muted hover:text-ink">
            {t(lang, "nav_guides")}
          </Link>
          <Link to="/support" className="text-muted hover:text-ink">
            {t(lang, "nav_support")}
          </Link>
          <Link to="/om" className="text-muted hover:text-ink">
            {t(lang, "about")}
          </Link>
          <Link to="/villkor" className="text-muted hover:text-ink">
            {t(lang, "terms")}
          </Link>
          <Link to="/integritet" className="text-muted hover:text-ink">
            {t(lang, "privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
