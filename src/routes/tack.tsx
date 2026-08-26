import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/catalog";
import { markPaid } from "@/lib/orders";
import { JOB_PACK_SLUG, JOB_PACK_UNLOCKS } from "@/lib/stripe-map";
import { useKlartext } from "@/lib/store";

export const Route = createFileRoute("/tack")({
  component: TackPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
    slug: typeof search.slug === "string" ? search.slug : undefined,
  }),
  head: () => ({
    meta: [{ title: "Tack — Klartext" }],
  }),
});

function TackPage() {
  const search = Route.useSearch();
  const unlock = useKlartext((s) => s.unlock);
  const unlockPro = useKlartext((s) => s.unlockPro);
  const unlockJobPack = useKlartext((s) => s.unlockJobPack);
  const [slug, setSlug] = useState<string | null>(search.slug ?? null);

  useEffect(() => {
    let pendingSlug = search.slug ?? null;
    let token = search.token ?? null;
    const raw = sessionStorage.getItem("klartext:pending");
    if (raw) {
      try {
        const pending = JSON.parse(raw) as { token?: string; slug?: string };
        sessionStorage.removeItem("klartext:pending");
        token = token ?? pending.token ?? null;
        pendingSlug = pendingSlug ?? pending.slug ?? null;
      } catch {
        /* ignore */
      }
    }
    if (token) void markPaid({ data: { token } });
    if (pendingSlug === "pro") unlockPro();
    else if (pendingSlug === JOB_PACK_SLUG) unlockJobPack();
    else if (pendingSlug) unlock(pendingSlug);
    if (pendingSlug) setSlug(pendingSlug);
  }, [search.slug, search.token, unlock, unlockPro, unlockJobPack]);

  const product = slug && slug !== "pro" && slug !== JOB_PACK_SLUG ? getProduct(slug) : null;

  return (
    <SiteFrame>
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">Tack</h1>
        <p className="mt-4 text-muted">
          {slug === "pro"
            ? "Pro är aktivt. Alla dokument är olåsta i 30 dagar."
            : slug === JOB_PACK_SLUG
              ? "Jobbpaketet är olåst: personligt brev, CV och LinkedIn."
              : product
                ? `${product.name} är olåst. Gå tillbaka och hämta hela texten.`
                : "Betalningen är registrerad. Gå tillbaka till dokumentet för att hämta texten."}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {slug === JOB_PACK_SLUG ? (
            <Button asChild>
              <Link to="/dokument/$slug" params={{ slug: JOB_PACK_UNLOCKS[0] }}>
                Öppna personligt brev
              </Link>
            </Button>
          ) : product ? (
            <Button asChild>
              <Link to="/dokument/$slug" params={{ slug: product.slug }}>
                Öppna dokumentet
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/dokument">Till dokumenten</Link>
            </Button>
          )}
        </div>
      </div>
    </SiteFrame>
  );
}
