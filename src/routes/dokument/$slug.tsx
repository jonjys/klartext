import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Generator } from "@/components/generator";
import { SiteFrame } from "@/components/site-frame";
import { getProduct } from "@/lib/catalog";
import { recordEvent } from "@/lib/ai";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { sek } from "@/lib/utils";
import { useEffect } from "react";

export const Route = createFileRoute("/dokument/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    const product = loaderData;
    if (!product) return { meta: [{ title: `Dokument — ${SITE_NAME}` }] };
    return {
      meta: [
        { title: `${product.name} | ${SITE_NAME}` },
        {
          name: "description",
          content: `${product.pitch} ${sek(product.priceKr)}. Utkast gratis. Inte juridisk rådgivning.`,
        },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/dokument/${product.slug}` }],
    };
  },
  component: DokumentPage,
  notFoundComponent: () => (
    <SiteFrame>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl">Dokumentet finns inte</h1>
        <Link to="/dokument" className="mt-4 inline-block text-pine">
          Till katalogen
        </Link>
      </div>
    </SiteFrame>
  ),
});

function DokumentPage() {
  const product = Route.useLoaderData()!;

  useEffect(() => {
    void recordEvent({ data: { name: "view", slug: product.slug } });
  }, [product.slug]);

  return (
    <SiteFrame>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.pitch,
            brand: { "@type": "Brand", name: SITE_NAME },
            url: `${SITE_URL}/dokument/${product.slug}`,
            offers: {
              "@type": "Offer",
              priceCurrency: "SEK",
              price: String(product.priceKr),
              availability: "https://schema.org/InStock",
              url: `${SITE_URL}/dokument/${product.slug}`,
            },
          }),
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-sm text-muted">
          <Link to="/dokument" className="hover:text-ink">
            Dokument
          </Link>
          <span className="mx-2 text-subtle">/</span>
          {product.name}
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted">{product.pitch}</p>
        <p className="mt-2 text-sm tabular-nums text-pine">{sek(product.priceKr)} för hela texten</p>
        <div className="mt-10">
          <Generator product={product} />
        </div>
      </div>
    </SiteFrame>
  );
}
