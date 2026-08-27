import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { DocCard } from "@/components/doc-card";
import { SiteFrame } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { getStats } from "@/lib/ai";
import { PRODUCTS } from "@/lib/catalog";
import { GUIDES } from "@/lib/guides";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { merchantReturnPolicy, productOffer, siteImage } from "@/lib/schema";
import { t, useI18n } from "@/lib/i18n";
import { sek } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: () => getStats(),
  component: Home,
  head: () => ({
    meta: [
      { title: "Skrivklart — samboavtal, överklagande, hyresansökan" },
      { name: "description", content: SITE_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});

const STEPS = [
  { n: "01", t: "Välj dokument", d: "Brev, avtal, överklagande. Ett formulär, inget konto." },
  { n: "02", t: "Skriv utkast", d: "Du fyller i fakta. Vi skriver texten på ungefär en minut." },
  { n: "03", t: "Betala om det sitter", d: "79–199 kr för hela dokumentet. Pro 249 kr/mån om du skriver ofta." },
];

const FAQ = [
  {
    q: "Är det juridisk rådgivning?",
    a: "Nej. Skrivklart skriver utkast. Du läser, ändrar och ansvarar för det du skickar. För komplicerade fall: anlita en jurist.",
  },
  {
    q: "Vem ser det jag skriver?",
    a: "Utkastet stannar i din webbläsare. Vi sparar inte innehållet i dokumentet. Betalningen går via Stripe.",
  },
  {
    q: "Tänk om texten är dålig?",
    a: "Skriv om den med ett klick – kortare eller formellare. Inte nöjd: säg till i supporten inom 24 timmar.",
  },
  {
    q: "Behöver jag konto?",
    a: "Nej. Inget konto, ingen prenumeration för ett enstaka dokument.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "sv-SE",
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/profil.jpg`,
      image: siteImage,
      areaServed: "SE",
      hasMerchantReturnPolicy: merchantReturnPolicy,
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      url: SITE_URL,
      image: siteImage,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: productOffer(79, SITE_URL),
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

function Home() {
  const stats = Route.useLoaderData();
  const featuredSlugs = [
    "samboavtal",
    "overklagande",
    "myndighetsbrev",
    "hyresansokan",
    "personligt-brev",
    "reklamation",
  ];
  const featured = featuredSlugs
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));
  const lang = useI18n((s) => s.lang);

  return (
    <SiteFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">{t(lang, "kicker")}</p>
        <h1 className="mt-4 max-w-3xl font-display text-[2.35rem] leading-[1.08] tracking-tight text-ink sm:text-6xl">
          {t(lang, "hero")}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          {t(lang, "hero_sub")} {sek(79)}–{sek(199)}. {lang === "en" ? "No account." : lang === "ar" ? "بدون حساب." : "Inget konto."}
        </p>
        <p className="mt-3 text-sm text-subtle">{t(lang, "hero_meta")}</p>
        <p className="mt-2 text-xs text-subtle">{t(lang, "lang_note")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/dokument">
              {t(lang, "cta_doc")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/brev">{t(lang, "cta_brev")}</Link>
          </Button>
        </div>
        {stats.full > 0 ? (
          <p className="mt-6 text-sm tabular-nums text-subtle">
            {stats.full} dokument färdigställda den här veckan.
          </p>
        ) : (
          <p className="mt-6 text-sm text-subtle">Utkast gratis. Du betalar bara för hela texten.</p>
        )}
      </section>

      <section className="border-y border-line bg-bg-elevated">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 md:py-16">
          {STEPS.map((s) => (
            <div key={s.n}>
              <p className="font-display text-sm text-moss">{s.n}</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight">{s.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Dokument folk släpar på</h2>
          <Link to="/dokument" className="hidden text-sm font-medium text-pine sm:inline">
            Alla dokument
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <DocCard key={p.slug} product={p} />
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6 sm:hidden">
          <Link to="/dokument">Alla dokument</Link>
        </Button>
      </section>

      <section className="border-y border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-14">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-paper/60 uppercase">Jobbpaket</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">Brev, CV och LinkedIn. Ett köp.</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper/75">
              Tre dokument som hör ihop, {sek(199)} i stället för {sek(257)}. Olåsta i 30 dagar i
              den här webbläsaren.
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="border-paper/20 bg-paper text-ink hover:bg-bg-elevated">
            <Link to="/priser">Köp jobbpaketet</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Inte en mall. En färdig text.</h2>
            <ul className="mt-6 space-y-3">
              {[
                "Svenska som en människa faktiskt skulle skicka",
                "Platshållare där fakta saknas – inga påhittade personnummer",
                "Kopiera, ladda ner eller skriv ut",
                "Skriv om: kortare eller formellare, ett klick",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-pine" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <blockquote className="rounded-xl border border-line bg-bg p-6 sm:p-8">
            <p className="font-serif text-lg leading-relaxed text-ink">
              Stockholm den [datum]
              <br />
              <br />
              Jag söker tjänsten som kundtjänstmedarbetare hos er. De senaste tre åren har jag
              tagit 40–60 samtal om dagen på ett elbolag – de flesta från folk som redan är arga
              när de ringer.
            </p>
            <p className="mt-4 text-sm text-subtle">Utdrag, personligt brev</p>
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl tracking-tight">Guider, korta</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {GUIDES.slice(0, 3).map((g) => (
            <Link
              key={g.slug}
              to="/guider/$slug"
              params={{ slug: g.slug }}
              className="rounded-xl border border-line bg-paper p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <p className="text-xs text-subtle">{g.minutes} min</p>
              <h3 className="mt-2 font-display text-xl tracking-tight">{g.title}</h3>
              <p className="mt-2 text-sm text-muted">{g.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-bg-elevated">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl tracking-tight">Frågor</h2>
          <div className="mt-8 divide-y divide-line">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
