import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/catalog";
import { markPaid } from "@/lib/orders";
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
    else if (pendingSlug) unlock(pendingSlug);
    if (pendingSlug) setSlug(pendingSlug);
  }, [search.slug, search.token, unlock, unlockPro]);

  const product = slug && slug !== "pro" ? getProduct(slug) : null;

  return (
    <SiteFrame>
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-4xl tracking-tight">Tack</h1>
        <p className="mt-4 text-muted">
          {slug === "pro"
            ? "Pro är aktivt. Alla dokument är olåsta i 30 dagar."
            : product
              ? `${product.name} är olåst. Gå tillbaka och hämta hela texten.`
              : "Betalningen är registrerad. Gå tillbaka till dokumentet för att hämta texten."}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {product ? (
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
