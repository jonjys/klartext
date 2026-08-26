import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/villkor")({
  component: VillkorPage,
});

function VillkorPage() {
  return (
    <SiteFrame>
      <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl tracking-tight">Villkor</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
          <p>Klartext säljer AI-genererade textutkast på svenska. Tjänsten tillhandahålls av den som driver sajten.</p>
          <p>
            Dokumenten är utkast. De är inte juridisk rådgivning, inte ett ombud, och inte en garanti
            för att en myndighet, arbetsgivare eller motpart godtar texten. Du ansvarar för att
            granska, komplettera och skicka.
          </p>
          <p>
            Betalning sker via Stripe. Per-dokument ger tillgång till det valda dokumentet i din
            webbläsare. Pro ger obegränsad upplåsning i 30 dagar från köp i den här webbläsaren.
          </p>
          <p>
            Ångerrätt: digitala tjänster som levereras direkt kan omfattas av undantag. Hör av dig
            via support inom 24 timmar om texten är uppenbart oanvändbar – vi tar det då.
          </p>
          <p>Vi kan stänga av missbruk, automatiserade anrop och uppenbara försök att kringgå betalning.</p>
          <p>Svensk lag. Tvist i svensk allmän domstol.</p>
        </div>
      </article>
    </SiteFrame>
  );
}
