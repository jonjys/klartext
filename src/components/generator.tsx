import { Copy, Download, Loader2, Lock, Printer, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { generateDocument, recordEvent, rewriteDocument } from "@/lib/ai";
import type { DocProduct } from "@/lib/catalog";
import { createOrder, markPaid } from "@/lib/orders";
import { STRIPE_PAYMENT_LINKS } from "@/lib/stripe-map";
import { useSkrivklart } from "@/lib/store";
import { isLocalHost, sek } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function Generator({ product }: { product: DocProduct }) {
  const draft = useSkrivklart((s) => s.drafts[product.slug]);
  const setAnswers = useSkrivklart((s) => s.setAnswers);
  const setPreview = useSkrivklart((s) => s.setPreview);
  const setFull = useSkrivklart((s) => s.setFull);
  const unlock = useSkrivklart((s) => s.unlock);
  const unlocked = useSkrivklart((s) => s.isUnlocked(product.slug));
  const hasPro = useSkrivklart((s) => s.hasPro());

  const answers = draft?.answers ?? {};
  const preview = draft?.preview ?? "";
  const full = draft?.full ?? "";
  const shown = unlocked && full ? full : preview;

  const [busy, setBusy] = useState<"preview" | "full" | "pay" | "rewrite" | null>(null);
  const [waitingPay, setWaitingPay] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missing = useMemo(() => {
    return product.fields.filter((f) => f.required && !answers[f.id]?.trim());
  }, [product.fields, answers]);

  function patch(id: string, value: string) {
    setAnswers(product.slug, { ...answers, [id]: value });
  }

  async function write(mode: "preview" | "full") {
    if (missing.length && mode === "preview") {
      setError("Fyll i de obligatoriska fälten först.");
      return;
    }
    setError(null);
    setBusy(mode);
    const res = await generateDocument({
      data: { slug: product.slug, answers, mode },
    });
    setBusy(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (mode === "preview") {
      setPreview(product.slug, res.text);
      if (unlocked) void write("full");
    } else setFull(product.slug, res.text);
  }

  async function finishPaid() {
    unlock(product.slug);
    setWaitingPay(false);
    await recordEvent({ data: { name: "paid", slug: product.slug } });
    setBusy("full");
    const res = await generateDocument({
      data: { slug: product.slug, answers, mode: "full" },
    });
    setBusy(null);
    if (res.ok) {
      setFull(product.slug, res.text);
      toast.success("Dokumentet är olåst.");
    } else setError(res.error);
  }

  async function pay() {
    setBusy("pay");
    setError(null);
    const order = await createOrder({
      data: { slug: product.slug, origin: window.location.origin },
    });
    await recordEvent({ data: { name: "checkout", slug: product.slug } });
    const link = STRIPE_PAYMENT_LINKS[product.slug];
    if (link && !isLocalHost() && order.ok) {
      sessionStorage.setItem(
        "skrivklart:pending",
        JSON.stringify({ token: order.token, slug: product.slug }),
      );
      if (order.checkoutUrl) {
        window.location.href = order.checkoutUrl;
        return;
      }
      window.open(link, "_blank", "noopener,noreferrer");
      setBusy(null);
      setWaitingPay(true);
      return;
    }
    await new Promise((r) => setTimeout(r, 700));
    if (order.ok) await markPaid({ data: { token: order.token } });
    await finishPaid();
  }

  async function rewrite(instruction: string) {
    const text = full || preview;
    if (!text) return;
    setBusy("rewrite");
    const res = await rewriteDocument({
      data: { slug: product.slug, text, instruction },
    });
    setBusy(null);
    if (res.ok) {
      if (unlocked) setFull(product.slug, res.text);
      else setPreview(product.slug, res.text);
      toast.success("Omskrivet.");
    } else toast.error(res.error);
  }

  function copy() {
    const text = unlocked ? full || preview : preview;
    void navigator.clipboard.writeText(text);
    void recordEvent({ data: { name: "copy", slug: product.slug } });
    toast.success("Kopierat.");
  }

  function download() {
    const text = unlocked ? full || preview : preview;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${product.slug}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function downloadHtml() {
    const text = unlocked ? full || preview : preview;
    const escaped = text
      .replaceAll("&", "&")
      .replaceAll("<", "<")
      .replaceAll(">", ">");
    const html = `<!doctype html><html lang="sv"><head><meta charset="utf-8"><title>${product.name}</title>
<style>
  body{font-family:Georgia,"Iowan Old Style",serif;max-width:40rem;margin:2.5rem auto;padding:0 1.25rem;line-height:1.65;color:#1c1b18;background:#fffdf8}
  h1{font-size:1.15rem;font-weight:600;letter-spacing:-0.02em}
  pre{white-space:pre-wrap;font-family:inherit;font-size:1.05rem}
</style></head><body>
<h1>${product.name}</h1>
<pre>${escaped}</pre>
</body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${product.slug}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
      <form
        className="flex flex-col gap-4 rounded-xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)]"
        onSubmit={(e) => {
          e.preventDefault();
          void write("preview");
        }}
      >
        <div>
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Uppgifter</p>
          <h2 className="mt-1 font-display text-2xl tracking-tight">{product.name}</h2>
          <p className="mt-1 text-sm text-muted">{product.outcome}</p>
        </div>

        {product.fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-1.5">
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                id={field.id}
                value={answers[field.id] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => patch(field.id, e.target.value)}
                required={field.required}
              />
            ) : field.type === "select" ? (
              <select
                id={field.id}
                value={answers[field.id] ?? ""}
                onChange={(e) => patch(field.id, e.target.value)}
                required={field.required}
                className="h-11 w-full rounded-lg border border-line bg-paper px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
              >
                <option value="">{field.placeholder}</option>
                {field.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                id={field.id}
                value={answers[field.id] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => patch(field.id, e.target.value)}
                required={field.required}
              />
            )}
            {field.hint ? <p className="text-xs text-subtle">{field.hint}</p> : null}
          </div>
        ))}

        {error ? <p className="text-sm text-danger">{error}</p> : null}

        <Button type="submit" disabled={busy !== null} className="w-full">
          {busy === "preview" ? <Loader2 className="size-4 animate-spin" /> : null}
          Skriv utkast
        </Button>
        <p className="text-xs text-subtle">
          Utkastet är gratis. Hela dokumentet kostar {sek(product.priceKr)}
          {hasPro ? " — Pro är aktivt, du betalar inte." : "."}
        </p>
      </form>

      <div className="relative">
        <article className="min-h-80 rounded-xl border border-line bg-paper p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Dokument</p>
          {shown ? (
            <pre className="mt-4 font-serif text-[1.05rem] leading-relaxed whitespace-pre-wrap text-ink">
              {shown}
            </pre>
          ) : (
            <p className="mt-6 max-w-md text-muted">
              Fyll i uppgifterna till vänster. Utkastet landar här på ungefär en minut.
            </p>
          )}

          {preview && !unlocked ? (
            <div
              data-print-hide
              className="mt-8 rounded-lg border border-line bg-bg-elevated p-5"
            >
              <div className="flex items-start gap-3">
                <Lock className="mt-0.5 size-4 shrink-0 text-pine" />
                <div>
                  <p className="font-medium">Resten är låst</p>
                  <p className="mt-1 text-sm text-muted">
                    Lås upp hela {product.name.toLowerCase()} för {sek(product.priceKr)}. Klar att
                    kopiera och skriva ut. Utkastet är provet. Ingen återbetalning efter upplåsning.
                  </p>
                </div>
              </div>
              {waitingPay ? (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-muted">
                    Betala i den nya fliken. När Stripe säger tack, lås upp här.
                  </p>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={() => void finishPaid()}
                    disabled={busy !== null}
                  >
                    {busy === "full" ? <Loader2 className="size-4 animate-spin" /> : null}
                    Jag har betalat
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  className="mt-4 w-full"
                  onClick={() => void pay()}
                  disabled={busy !== null}
                >
                  {busy === "pay" || busy === "full" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  Betala {sek(product.priceKr)}
                </Button>
              )}
            </div>
          ) : null}

          {preview && unlocked && !full ? (
            <div className="mt-8" data-print-hide>
              <Button
                type="button"
                className="w-full"
                disabled={busy !== null}
                onClick={() => void write("full")}
              >
                {busy === "full" ? <Loader2 className="size-4 animate-spin" /> : null}
                Skriv hela dokumentet
              </Button>
            </div>
          ) : null}
        </article>

        {shown ? (
          <div className="mt-4 flex flex-wrap gap-2" data-print-hide>
            <Button type="button" variant="outline" size="sm" onClick={copy}>
              <Copy className="size-3.5" />
              Kopiera
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={download}
              disabled={!unlocked}
            >
              <Download className="size-3.5" />
              Textfil
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadHtml}
              disabled={!unlocked}
            >
              <Download className="size-3.5" />
              HTML
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              disabled={!unlocked}
            >
              <Printer className="size-3.5" />
              Skriv ut
            </Button>
            {unlocked ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy !== null}
                  onClick={() => void rewrite("Gör texten kortare, behåll innehållet.")}
                >
                  <RefreshCw className="size-3.5" />
                  Kortare
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={busy !== null}
                  onClick={() => void rewrite("Gör tonen mer formell och saklig.")}
                >
                  Formellare
                </Button>
              </>
            ) : null}
          </div>
        ) : null}

        <p className="mt-4 text-xs leading-relaxed text-subtle">
          Skrivklart skriver utkast. Det är inte juridisk rådgivning och ersätter inte en jurist,
          fackförbund eller myndighetens egna blanketter. Läs igenom innan du skickar eller
          skriver under.
        </p>
      </div>
    </div>
  );
}
