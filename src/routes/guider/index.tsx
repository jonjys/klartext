import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";
import { GUIDES } from "@/lib/guides";

export const Route = createFileRoute("/guider/")({
  component: GuiderIndex,
  head: () => ({
    meta: [
      { title: "Guider | Skrivklart" },
      {
        name: "description",
        content: "Korta guider: överklaga Försäkringskassan, samboavtal, hyresansökan, CV utan floskler.",
      },
    ],
  }),
});

function GuiderIndex() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Guider</h1>
        <p className="mt-3 text-muted">Korta texter om sakerna Skrivklart skriver. Ingen kurs. Inga nyhetsbrev.</p>
        <div className="mt-10 space-y-4">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              to="/guider/$slug"
              params={{ slug: g.slug }}
              className="block rounded-xl border border-line bg-paper p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <p className="text-xs text-subtle">{g.minutes} min läsning</p>
              <h2 className="mt-1 font-display text-2xl tracking-tight">{g.title}</h2>
              <p className="mt-2 text-sm text-muted">{g.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}
