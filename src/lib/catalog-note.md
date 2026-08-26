export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
