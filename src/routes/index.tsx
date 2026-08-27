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
  { n: "01", t: "step1_t", d: "step1_d" },
  { n: "02", t: "step2_t", d: "step2_d" },
  { n: "03", t: "step3_t", d: "step3_d" },
] as const;

const FAQ_KEYS = [
  ["faq1_q", "faq1_a"],
  ["faq2_q", "faq2_a"],
  ["faq3_q", "faq3_a"],
  ["faq4_q", "faq4_a"],
] as const;

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
    a: "Läs utkastet först — det är gratis. Skriv om den kortare eller formellare efter köp. Ingen återbetalning när hela texten är upplåst.",
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
          {t(lang, "hero_sub")}{" "}
          <span dir="ltr" className="inline-block tabular-nums">
            {sek(79)}–{sek(199)}
          </span>
          . {t(lang, "no_account")}
        </p>
        <p className="mt-3 text-sm text-subtle">{t(lang, "hero_meta")}</p>
        <p className="mt-2 text-xs text-subtle">{t(lang, "lang_note")}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/dokument">
              {t(lang, "cta_doc")}
              <ArrowRight className="size-4 rtl:-scale-x-100" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/brev">{t(lang, "cta_brev")}</Link>
          </Button>
        </div>
        {stats.full > 0 ? (
          <p className="mt-6 text-sm tabular-nums text-subtle">
            {stats.full} {t(lang, "stats_week")}
          </p>
        ) : (
          <p className="mt-6 text-sm text-subtle">{t(lang, "draft_pay")}</p>
        )}
      </section>

      <section className="border-y border-line bg-bg-elevated">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 md:py-16">
          {STEPS.map((s) => (
            <div key={s.n}>
              <p className="font-display text-sm text-moss">{s.n}</p>
              <h2 className="mt-2 font-display text-2xl tracking-tight">{t(lang, s.t)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t(lang, s.d)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">{t(lang, "docs_h")}</h2>
          <Link to="/dokument" className="hidden text-sm font-medium text-pine sm:inline">
            {t(lang, "all_docs")}
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <DocCard key={p.slug} product={p} />
          ))}
        </div>
        <Button asChild variant="outline" className="mt-6 sm:hidden">
          <Link to="/dokument">{t(lang, "all_docs")}</Link>
        </Button>
      </section>

      <section className="border-y border-line bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-14">
          <div>
            <p className="text-xs font-medium tracking-[0.18em] text-paper/60 uppercase">{t(lang, "job_kicker")}</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight">{t(lang, "job_h")}</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-paper/75">
              {t(lang, "job_p")}{" "}
              <span dir="ltr" className="inline-block tabular-nums">
                {sek(199)}
              </span>
            </p>
          </div>
          <Button asChild size="lg" variant="outline" className="border-paper/20 bg-paper text-ink hover:bg-bg-elevated">
            <Link to="/priser">{t(lang, "job_cta")}</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl">{t(lang, "not_mall")}</h2>
            <ul className="mt-6 space-y-3">
              {(["bullet1", "bullet2", "bullet3", "bullet4"] as const).map((key) => (
                <li key={key} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-pine" />
                  {t(lang, key)}
                </li>
              ))}
            </ul>
          </div>
          <blockquote className="rounded-xl border border-line bg-bg p-6 sm:p-8" dir="ltr" lang="sv">
            <p className="font-serif text-lg leading-relaxed text-ink">
              Stockholm den [datum]
              <br />
              <br />
              Jag söker tjänsten som kundtjänstmedarbetare hos er. De senaste tre åren har jag
              tagit 40–60 samtal om dagen på ett elbolag – de flesta från folk som redan är arga
              när de ringer.
            </p>
            <p className="mt-4 text-sm text-subtle">{t(lang, "excerpt_label")}</p>
          </blockquote>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-3xl tracking-tight">{t(lang, "guides_h")}</h2>
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
          <h2 className="font-display text-3xl tracking-tight">{t(lang, "faq_h")}</h2>
          <div className="mt-8 divide-y divide-line">
            {FAQ_KEYS.map(([q, a]) => (
              <details key={q} className="group py-4">
                <summary className="cursor-pointer list-none font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {t(lang, q)}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t(lang, a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
