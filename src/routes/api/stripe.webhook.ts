import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/api/stripe/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        const key = process.env.STRIPE_SECRET_KEY;
        const raw = await request.text();

        let event: { type?: string; data?: { object?: Record<string, unknown> } };
        try {
          event = JSON.parse(raw) as typeof event;
        } catch {
          return new Response("invalid json", { status: 400 });
        }

        if (secret && key) {
          const sig = request.headers.get("stripe-signature") ?? "";
          const ok = await verifyStripeSignature(raw, sig, secret);
          if (!ok) return new Response("bad signature", { status: 400 });
        }

        const type = event.type ?? "";
        if (
          type !== "checkout.session.completed" &&
          type !== "payment_intent.succeeded" &&
          type !== "checkout.session.async_payment_succeeded"
        ) {
          return Response.json({ received: true });
        }

        const obj = event.data?.object ?? {};
        const token =
          (typeof obj.client_reference_id === "string" && obj.client_reference_id) ||
          (typeof (obj.metadata as { token?: string } | undefined)?.token === "string"
            ? (obj.metadata as { token: string }).token
            : "");
        const slug =
          typeof (obj.metadata as { slug?: string } | undefined)?.slug === "string"
            ? (obj.metadata as { slug: string }).slug
            : "";

        if (token) {
          try {
            const sql = await getSql();
            const rows = await sql<{ product_slug: string }>`
              update orders set status = 'paid'
              where access_token = ${token} and status <> 'paid'
              returning product_slug
            `;
            const paidSlug = rows[0]?.product_slug ?? slug;
            if (paidSlug) {
              await sql`
                insert into funnel_events (name, product_slug) values ('paid', ${paidSlug})
              `;
            }
          } catch {
            /* db optional */
          }
        }

        return Response.json({ received: true });
      },
    },
  },
});

async function verifyStripeSignature(payload: string, header: string, secret: string) {
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, ...rest] = p.split("=");
      return [k.trim(), rest.join("=")];
    }),
  ) as { t?: string; v1?: string };
  if (!parts.t || !parts.v1) return false;
  const signed = `${parts.t}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signed));
  const hex = [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex === parts.v1;
}
