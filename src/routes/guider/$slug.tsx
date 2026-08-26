import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/catalog";
import { getGuide } from "@/lib/guides";
import { sek } from "@/lib/utils";

export const Route = createFileRoute("/guider/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide, product: getProduct(guide.productSlug) };
  },
  head: ({ loaderData }) => {
    const guide = loaderData?.guide;
    if (!guide) return { meta: [{ title: "Guider — Klartext" }] };
    return {
      meta: [
        { title: `${guide.title} — Klartext` },
        { name: "description", content: guide.excerpt },
      ],
    };
  },
  component: GuidePage,
  notFoundComponent: () => (
    <SiteFrame>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Guiden finns inte</h1>
        <Link to="/guider" className="mt-4 inline-block text-pine">
          Till guiderna
        </Link>
      </div>
    </SiteFrame>
  ),
});

function GuidePage() {
  const { guide, product } = Route.useLoaderData()!;

  return (
    <SiteFrame>
      <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-sm text-muted">
          <Link to="/guider" className="hover:text-ink">
            Guider
          </Link>
          <span className="mx-2 text-subtle">/</span>
          {guide.minutes} min
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight">{guide.title}</h1>
        <div className="mt-8 space-y-4">
          {guide.body.map((p) => (
            <p key={p} className="text-base leading-relaxed text-ink">
              {p}
            </p>
          ))}
        </div>
        {product ? (
          <div className="mt-12 rounded-xl border border-line bg-paper p-6">
            <p className="font-display text-2xl tracking-tight">{product.name}</p>
            <p className="mt-2 text-sm text-muted">
              {product.short} {sek(product.priceKr)} för hela texten.
            </p>
            <Button asChild className="mt-4">
              <Link to="/dokument/$slug" params={{ slug: product.slug }}>
                Skriv {product.name.toLowerCase()}
              </Link>
            </Button>
          </div>
        ) : null}
      </article>
    </SiteFrame>
  );
}
