import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteFrame } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeBrev, type BrevAnalysis } from "@/lib/brev";
import { getProduct } from "@/lib/catalog";
import { createOrder } from "@/lib/orders";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";
import { STRIPE_PAYMENT_LINKS } from "@/lib/stripe-map";
import { useKlartext } from "@/lib/store";
import { t, useI18n } from "@/lib/i18n";
import { isLocalHost, sek } from "@/lib/utils";

const SLUG = "myndighetsbrev";

export const Route = createFileRoute("/brev")({
  component: BrevPage,
  head: () => ({
    meta: [
      { title: "Myndighetsbrev | Skrivklart" },
      {
        name: "description",
        content:
          "Klistra in brevet från FK, Skatteverket eller Kronofogden. Få det på vanlig svenska, med datum och vad du ska göra. 79 kr.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/brev` }],
  }),
});

function levelLabel(level: BrevAnalysis["riskLevel"], lang: "sv" | "en" | "ar") {
  if (level === "CRITICAL") return t(lang, "risk_high");
  if (level === "IMPORTANT") return t(lang, "risk_mid");
  return t(lang, "risk_low");
}

function BrevPage() {
  const product = getProduct(SLUG)!;
  const lang = useI18n((s) => s.lang);
  const unlocked = useKlartext((s) => s.isUnlocked(SLUG));
  const unlock = useKlartext((s) => s.unlock);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<BrevAnalysis | null>(null);
  const [full, setFull] = useState<BrevAnalysis | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("skrivklart:brev");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { preview: BrevAnalysis; full: BrevAnalysis; text: string };
      setPreview(parsed.preview);
      setFull(parsed.full);
      setText(parsed.text);
    } catch {
      /* ignore */
    }
  }, []);

  const shown = unlocked && full ? full : preview;

  async function analyze() {
    setError(null);
    setBusy(true);
    const res = await analyzeBrev({ data: { text, lang } });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setPreview(res.preview);
    setFull(res.full);
    sessionStorage.setItem("skrivklart:brev", JSON.stringify({ preview: res.preview, full: res.full, text }));
  }

  async function pay() {
    setPaying(true);
    const order = await createOrder({ data: { slug: SLUG, origin: window.location.origin } });
    const link = STRIPE_PAYMENT_LINKS[SLUG];
    if (link && !isLocalHost() && order.ok) {
      sessionStorage.setItem("klartext:pending", JSON.stringify({ token: order.token, slug: SLUG }));
      if (order.checkoutUrl) {
        window.location.href = order.checkoutUrl;
        return;
      }
      window.open(link, "_blank", "noopener,noreferrer");
      setPaying(false);
      toast("Betala i Stripe-fliken. Kom tillbaka hit.");
      return;
    }
    unlock(SLUG);
    setPaying(false);
    toast.success("Upplåst.");
  }

  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">{t(lang, "brev_kicker")}</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{t(lang, "brev_h1")}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          {t(lang, "brev_lead")} {sek(product.priceKr)}.
        </p>
        <p className="mt-2 text-xs text-subtle">{t(lang, "lang_note")}</p>

        <label className="mt-10 block text-sm font-medium text-ink" htmlFor="brev-text">
          {t(lang, "brev_label")}
        </label>
        <Textarea
          id="brev-text"
          className="mt-2 min-h-48"
          placeholder={t(lang, "brev_ph")}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => void analyze()} disabled={busy || text.trim().length < 12}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            {t(lang, "brev_go")}
          </Button>
          <p className="self-center text-sm text-subtle">{t(lang, "brev_free")}</p>
        </div>

        {shown ? (
          <div className="mt-12 space-y-6">
            <div className="rounded-xl border border-line bg-paper p-6">
              <p className="text-sm text-muted">
                {shown.senderName ?? t(lang, "unknown_sender")}
                {shown.documentType ? ` · ${shown.documentType}` : ""}
              </p>
              <p className="mt-3 text-lg leading-relaxed text-ink">{shown.summary}</p>
              <p className="mt-4 text-sm text-pine">
                {shown.riskScore}/100 — {levelLabel(shown.riskLevel, lang)}
              </p>
            </div>

            {unlocked && full ? (
              <>
                <section>
                  <h2 className="font-display text-2xl tracking-tight">{t(lang, "brev_plain")}</h2>
                  <p className="mt-3 whitespace-pre-wrap leading-relaxed text-ink">{full.plainLanguage}</p>
                </section>
                {full.deadlines.length ? (
                  <section>
                    <h2 className="font-display text-2xl tracking-tight">{t(lang, "brev_dates")}</h2>
                    <ul className="mt-3 space-y-1 text-sm text-ink">
                      {full.deadlines.map((d) => (
                        <li key={d.description + (d.dueDate ?? "")}>
                          {d.description}
                          {d.dueDate ? ` — ${d.dueDate}` : ""}
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}
                {full.actionPlan.length ? (
                  <section>
                    <h2 className="font-display text-2xl tracking-tight">{t(lang, "brev_do")}</h2>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-ink">
                      {full.actionPlan.map((s) => (
                        <li key={s.step}>{s.step}</li>
                      ))}
                    </ol>
                  </section>
                ) : null}
                {full.consequences ? (
                  <p className="text-sm leading-relaxed text-muted">{full.consequences}</p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <Link to="/dokument/$slug" params={{ slug: "overklagande" }}>
                      {t(lang, "brev_appeal")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/dokument/$slug" params={{ slug: "reklamation" }}>
                      {t(lang, "brev_reklamation")}
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-line bg-bg-elevated p-6">
                <p className="flex items-center gap-2 font-display text-xl">
                  <Lock className="size-4" />
                  {t(lang, "brev_lock")}
                </p>
                <p className="mt-2 text-sm text-muted">
                  {t(lang, "brev_lock_sub")} {sek(product.priceKr)}.
                </p>
                <Button className="mt-4" onClick={() => void pay()} disabled={paying}>
                  {paying ? <Loader2 className="size-4 animate-spin" /> : null}
                  {t(lang, "brev_unlock")} {sek(product.priceKr)}
                </Button>
              </div>
            )}
          </div>
        ) : null}

        <p className="mt-16 text-xs text-subtle">{SITE_DESCRIPTION} Inte juridisk rådgivning.</p>
      </div>
    </SiteFrame>
  );
}
