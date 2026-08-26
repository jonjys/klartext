import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-bg-elevated">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg italic text-ink">Klartext</p>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Samboavtal, överklagande, hyresansökan. Utkast, inte juridisk rådgivning.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
          <Link to="/dokument" className="text-muted hover:text-ink">
            Dokument
          </Link>
          <Link to="/priser" className="text-muted hover:text-ink">
            Priser
          </Link>
          <Link to="/guider" className="text-muted hover:text-ink">
            Guider
          </Link>
          <Link to="/support" className="text-muted hover:text-ink">
            Support
          </Link>
          <Link to="/om" className="text-muted hover:text-ink">
            Om
          </Link>
          <Link to="/villkor" className="text-muted hover:text-ink">
            Villkor
          </Link>
          <Link to="/integritet" className="text-muted hover:text-ink">
            Integritet
          </Link>
        </div>
      </div>
    </footer>
  );
}
