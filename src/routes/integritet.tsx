import { createFileRoute } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/integritet")({
  component: IntegritetPage,
});

function IntegritetPage() {
  return (
    <SiteFrame>
      <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl tracking-tight">Integritet</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
          <p>
            Dokumentets innehåll sparas i din webbläsare (localStorage). Vi lagrar inte
            dokumenttexten i vår databas.
          </p>
          <p>
            När du skriver ett utkast skickas dina formuläruppgifter till vår AI-leverantör (xAI)
            för att producera texten. Skicka inte personnummer, bankuppgifter eller andras
            känsliga data i formuläret.
          </p>
          <p>
            Betalning hanteras av Stripe. De får de uppgifter som krävs för att genomföra köpet.
            Vi sparar orderns produkt, belopp och en slumpmässig åtkomstnyckel – inte kortnummer.
          </p>
          <p>
            Vi loggar anonyma händelser (visning, utkast, köp) för att se vad som fungerar. Ingen
            reklamprofil, inga tredjepartspixlar i skrivläget.
          </p>
          <p>Supportchatten skickar dina meddelanden till samma AI för att kunna svara.</p>
        </div>
      </article>
    </SiteFrame>
  );
}
