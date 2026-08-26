import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteFrame } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { PRODUCTS, PRO_PRICE_KR } from "@/lib/catalog";
import { createOrder, markPaid } from "@/lib/orders";
import { STRIPE_PAYMENT_LINKS } from "@/lib/stripe-map";
import { useKlartext } from "@/lib/store";
import { isLocalHost, sek } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/priser")({
  component: PriserPage,
  head: () => ({
    meta: [
      { title: "Priser — Klartext" },
      {
        name: "description",
        content: "Ett dokument 79–199 kr. Klartext Pro 249 kr/mån. Inget konto för enstaka dokument.",
      },
    ],
  }),
});

function PriserPage() {
  const unlockPro = useKlartext((s) => s.unlockPro);
  const hasPro = useKlartext((s) => s.hasPro());
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);

  async function buyPro() {
    setBusy(true);
    const order = await createOrder({
      data: { slug: "pro", origin: window.location.origin },
    });
    const link = STRIPE_PAYMENT_LINKS.pro;
    if (link && !isLocalHost() && order.ok) {
      sessionStorage.setItem("klartext:pending", JSON.stringify({ token: order.token, slug: "pro" }));
      if (order.checkoutUrl) {
        window.location.href = order.checkoutUrl;
        return;
      }
      window.open(link, "_blank", "noopener,noreferrer");
      setBusy(false);
      setWaiting(true);
      return;
    }
    await new Promise((r) => setTimeout(r, 700));
    if (order.ok) await markPaid({ data: { token: order.token } });
    unlockPro();
    setBusy(false);
    toast.success("Pro är aktivt i 30 dagar.");
  }

  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Priser</h1>
        <p className="mt-3 max-w-xl text-muted">
          Ett dokument när du behöver det. Eller Pro om du skriver varje vecka.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-paper p-6 sm:p-8">
            <p className="text-sm font-medium text-muted">Per dokument</p>
            <p className="mt-2 font-display text-4xl tracking-tight">79–199 kr</p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              {[
                "Utkast gratis",
                "Hela texten när du betalar",
                "Kopiera, ladda ner, skriv ut",
                "En omskrivning ingår",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="size-4 shrink-0 text-pine" />
                  {t}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-8 w-full">
              <Link to="/dokument">Välj dokument</Link>
            </Button>
          </div>

          <div className="rounded-xl border border-ink bg-ink p-6 text-paper sm:p-8">
            <p className="text-sm font-medium text-paper/70">Klartext Pro</p>
            <p className="mt-2 font-display text-4xl tracking-tight">{sek(PRO_PRICE_KR)}/mån</p>
            <ul className="mt-6 space-y-2 text-sm text-paper/80">
              {[
                "Obegränsade dokument",
                "Alla tolv typer",
                "Obegränsade omskrivningar",
                "Ingen per-dokument-avgift",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <Check className="size-4 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
            {waiting && !hasPro ? (
              <Button
                type="button"
                variant="outline"
                className="mt-8 w-full border-paper/20 bg-paper text-ink hover:bg-bg-elevated"
                onClick={() => {
                  unlockPro();
                  toast.success("Pro är aktivt i 30 dagar.");
                }}
              >
                Jag har betalat
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="mt-8 w-full border-paper/20 bg-paper text-ink hover:bg-bg-elevated"
                onClick={() => void buyPro()}
                disabled={busy || hasPro}
              >
                {hasPro ? "Pro är aktivt" : "Starta Pro"}
              </Button>
            )}
          </div>
        </div>

        <h2 className="mt-16 font-display text-2xl tracking-tight">Alla dokument</h2>
        <div className="mt-4 divide-y divide-line border-y border-line">
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              to="/dokument/$slug"
              params={{ slug: p.slug }}
              className="flex items-center justify-between gap-4 py-4 text-sm hover:text-pine"
            >
              <span>{p.name}</span>
              <span className="tabular-nums text-muted">{sek(p.priceKr)}</span>
            </Link>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}
