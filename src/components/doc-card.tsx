import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { DocProduct } from "@/lib/catalog";
import { sek } from "@/lib/utils";

export function DocCard({ product }: { product: DocProduct }) {
  const isBrev = product.slug === "myndighetsbrev";
  return (
    <Link
      to={isBrev ? "/brev" : "/dokument/$slug"}
      params={isBrev ? undefined : { slug: product.slug }}
      className="group flex flex-col rounded-xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)] transition-[transform,border-color] duration-200 ease-out hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl tracking-tight text-ink">{product.name}</h3>
        <ArrowUpRight className="size-4 shrink-0 text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{product.short}</p>
      <p className="mt-4 text-sm font-medium tabular-nums text-pine">{sek(product.priceKr)}</p>
    </Link>
  );
}
