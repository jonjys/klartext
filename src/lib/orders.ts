import { createServerFn } from "@tanstack/react-start";
import { getProduct, PRO_PRICE_KR } from "./catalog";
import { getSql } from "./db";
import { JOB_PACK_PRICE_KR, JOB_PACK_SLUG, STRIPE_PRICES } from "./stripe-map";
import { uid } from "./utils";

async function stripeCheckoutUrl(opts: {
  slug: string;
  token: string;
  origin: string;
  priceId: string;
}) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const success = `${opts.origin}/tack?token=${encodeURIComponent(opts.token)}&slug=${encodeURIComponent(opts.slug)}`;
  const cancel =
    opts.slug === "pro"
      ? `${opts.origin}/priser`
      : opts.slug === JOB_PACK_SLUG
        ? `${opts.origin}/priser`
        : `${opts.origin}/dokument/${opts.slug}`;
  const body = new URLSearchParams();
  body.set("mode", opts.slug === "pro" ? "subscription" : "payment");
  body.set("success_url", success);
  body.set("cancel_url", cancel);
  body.set("client_reference_id", opts.token);
  body.set("line_items[0][price]", opts.priceId);
  body.set("line_items[0][quantity]", "1");
  body.set("metadata[slug]", opts.slug);
  body.set("metadata[token]", opts.token);
  body.set("locale", "sv");
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { url?: string };
  return json.url ?? null;
}

export const createOrder = createServerFn({ method: "POST" })
  .validator((input: { slug: string; origin?: string }) => input)
  .handler(async ({ data }) => {
    const isPro = data.slug === "pro";
    const isPack = data.slug === JOB_PACK_SLUG;
    const product = isPro || isPack ? null : getProduct(data.slug);
    if (!isPro && !isPack && !product) return { ok: false as const, error: "Okänt dokument." };

    const amount = isPro ? PRO_PRICE_KR : isPack ? JOB_PACK_PRICE_KR : product!.priceKr;
    const token = uid();
    try {
      const sql = await getSql();
      await sql`
        insert into orders (product_slug, amount_kr, status, access_token)
        values (${data.slug}, ${amount}, ${"pending"}, ${token})
      `;
    } catch {
      /* still return a token so checkout can proceed */
    }

    const origin = (data.origin ?? "").replace(/\/$/, "");
    const priceId = STRIPE_PRICES[data.slug];
    let checkoutUrl: string | null = null;
    if (origin.startsWith("http") && priceId) {
      try {
        checkoutUrl = await stripeCheckoutUrl({
          slug: data.slug,
          token,
          origin,
          priceId,
        });
      } catch {
        checkoutUrl = null;
      }
    }

    return { ok: true as const, token, amount, checkoutUrl };
  });

export const markPaid = createServerFn({ method: "POST" })
  .validator((input: { token: string }) => input)
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      const rows = await sql<{ product_slug: string }>`
        update orders set status = 'paid'
        where access_token = ${data.token} and status = 'pending'
        returning product_slug
      `;
      const slug = rows[0]?.product_slug;
      if (slug) {
        await sql`
          insert into funnel_events (name, product_slug) values ('paid', ${slug})
        `;
        return { ok: true as const, slug };
      }
    } catch {
      /* ignore */
    }
    return { ok: true as const, slug: "unknown" };
  });
