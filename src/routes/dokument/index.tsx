import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DocCard } from "@/components/doc-card";
import { SiteFrame } from "@/components/site-frame";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/catalog";
import { recordEvent } from "@/lib/ai";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dokument/")({
  component: DokumentIndex,
  head: () => ({
    meta: [
      { title: "Dokument — Klartext" },
      {
        name: "description",
        content: "Personligt brev, överklagande, samboavtal, hyresansökan och fler. Utkast gratis, 79–199 kr för hela texten.",
      },
    ],
  }),
});

function DokumentIndex() {
  const [cat, setCat] = useState<Category | "alla">("alla");
  const list = cat === "alla" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  useEffect(() => {
    void recordEvent({ data: { name: "view", slug: "katalog" } });
  }, []);

  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">Dokument</h1>
        <p className="mt-3 max-w-xl text-muted">
          Välj typ. Fyll i det du vet. Utkastet är gratis – hela texten kostar 79–199 kr.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <FilterChip active={cat === "alla"} onClick={() => setCat("alla")}>
            Alla
          </FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </FilterChip>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <DocCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 rounded-full px-4 text-sm font-medium transition-colors duration-150",
        active ? "bg-ink text-paper" : "border border-line bg-paper text-ink hover:bg-bg-elevated",
      )}
    >
      {children}
    </button>
  );
}
