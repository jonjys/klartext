import { createServerFn } from "@tanstack/react-start";
import { getProduct } from "./catalog";
import { getSql } from "./db";
import { fallbackDocument } from "./templates";

const SYSTEM = `Du är Skrivklart, en svensk dokumentförfattare. Du skriver färdiga texter som mottagaren kan skicka eller skriva under efter att ha fyllt i [platshållare].

Regler:
- Alltid svenska.
- Inga emojis.
- Inga markdown-rubriker med #. Använd vanliga brev- och avtalskonventioner.
- Inga AI-floskler, ingen "som en språkmodell", inget "hoppas detta hjälper".
- Om fakta saknas: använd tydliga [HAKPARENTESER].
- Hitta inte på personuppgifter, lagrumsnummer eller diarienummer.
- Dokumentet ska kunna kopieras rakt av.
- Inte juridisk rådgivning inne i texten.`;

async function countToday(name: string) {
  try {
    const sql = await getSql();
    const rows = await sql<{ n: number }>`
      select count(*)::int as n from funnel_events
      where name = ${name} and created_at > date_trunc('day', now())
    `;
    return rows[0]?.n ?? 0;
  } catch {
    return 0;
  }
}

async function track(name: string, slug?: string) {
  try {
    const sql = await getSql();
    await sql`
      insert into funnel_events (name, product_slug)
      values (${name}, ${slug ?? null})
    `;
  } catch {
    /* preview without db is fine */
  }
}

async function chat(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  maxTokens: number,
) {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return { ok: false as const, error: "AI är inte tillgänglig just nu." };

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      messages,
      max_tokens: maxTokens,
      temperature: 0.4,
    }),
  });
  if (!res.ok) return { ok: false as const, error: "Kunde inte skriva just nu. Försök igen." };
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = body.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) return { ok: false as const, error: "Tomt svar. Försök igen." };
  return { ok: true as const, text };
}

export const generateDocument = createServerFn({ method: "POST" })
  .validator((input: { slug: string; answers: Record<string, string>; mode: "preview" | "full" }) => input)
  .handler(async ({ data }) => {
    const product = getProduct(data.slug);
    if (!product) return { ok: false as const, error: "Okänt dokument." };

    const cap = data.mode === "full" ? 80 : 120;
    const used = await countToday(data.mode === "full" ? "generate_full" : "generate_preview");
    if (used >= cap) return { ok: false as const, error: "Kö just nu. Försök om en stund." };

    const facts = Object.entries(data.answers)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const modeLine =
      data.mode === "preview"
        ? "Skriv BARA inledningen: rubrik/datumrad om det passar, plus de två första styckena. Avsluta efter ~180 ord, mitt i en naturlig övergång. Inte hela dokumentet."
        : "Skriv HELA dokumentet, komplett och redo att använda.";

    const result = await chat(
      [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `${product.extraPrompt}\n\n${modeLine}\n\nTyp: ${product.name}\nUppgifter från kunden:\n${facts || "(inga)"}`,
        },
      ],
      data.mode === "full" ? 2200 : 500,
    );

    if (result.ok) {
      await track(data.mode === "full" ? "generate_full" : "generate_preview", data.slug);
      return result;
    }

    const text = fallbackDocument(data.slug, data.answers, data.mode);
    await track(data.mode === "full" ? "generate_full" : "generate_preview", data.slug);
    return { ok: true as const, text };
  });

export const rewriteDocument = createServerFn({ method: "POST" })
  .validator((input: { slug: string; text: string; instruction: string }) => input)
  .handler(async ({ data }) => {
    const product = getProduct(data.slug);
    if (!product) return { ok: false as const, error: "Okänt dokument." };
    const used = await countToday("rewrite");
    if (used >= 80) return { ok: false as const, error: "Kö just nu. Försök om en stund." };

    const result = await chat(
      [
        { role: "system", content: SYSTEM },
        {
          role: "user",
          content: `Skriv om dokumentet enligt instruktionen. Behåll sakuppgifter. Returnera bara den nya texten.\n\nInstruktion: ${data.instruction}\n\nDokument:\n${data.text.slice(0, 8000)}`,
        },
      ],
      2200,
    );
    if (result.ok) await track("rewrite", data.slug);
    return result;
  });

export const askSupport = createServerFn({ method: "POST" })
  .validator((input: { messages: { role: "user" | "assistant"; content: string }[] }) => input)
  .handler(async ({ data }) => {
    const used = await countToday("support");
    if (used >= 80) return { ok: false as const, error: "Supportkön är full. Försök senare." };

    const trimmed = data.messages.slice(-8).map((m) => ({
      role: m.role,
      content: m.content.slice(0, 1200),
    }));

    const result = await chat(
      [
        {
          role: "system",
          content:
            "Du är Rådgivaren på Skrivklart. Kort, svensk, saklig. Hjälp kunden välja dokument (personligt brev, CV, LinkedIn, uppsägning, överklagande, samboavtal, hyresansökan, reklamation, ARN-anmälan, skuldebrev, NDA, konsultavtal, anställningsavtal, fullmakt, klagomål, andrahandskontrakt, myndighetsbrev). Priser 79–199 kr, Jobbpaket 199 kr (brev+CV+LinkedIn), Pro 249 kr/mån. Inte juridisk rådgivning. Inga emojis. Max 120 ord.",
        },
        ...trimmed,
      ],
      350,
    );
    if (result.ok) {
      await track("support");
      return result;
    }

    const last = trimmed.filter((m) => m.role === "user").at(-1)?.content.toLowerCase() ?? "";
    const hint = routeSupport(last);
    return { ok: true as const, text: hint };
  });

function routeSupport(q: string) {
  if (/försäkringskassa|csn|a-kassa|överklag/.test(q))
    return "Det låter som ett överklagande. 199 kr. Du fyller i beslutet och vad som är fel – vi skriver det kallt och precist. Inte juridisk rådgivning.";
  if (/arn|nämnd/.test(q))
    return "ARN-anmälan, 149 kr. När företaget redan sagt nej. Ta reklamation först om du inte skickat en.";
  if (/reklam|fel på|pengarna tillbaka/.test(q))
    return "Reklamation, 79 kr. Krav, frist, ordernummer. Om de tiger: ARN efter det.";
  if (/sambo|bodeln/.test(q))
    return "Samboavtal, 149 kr. Vem äger bostad och bohag. Utkast – visa jurist om ni har hus eller barn.";
  if (/hyra|lägenhet|värd/.test(q))
    return "Hyresansökan 89 kr, eller andrahandskontrakt 149 kr om ni redan är överens.";
  if (/cv|linkedin|personligt brev|ansök/.test(q))
    return "Jobb: personligt brev 89 kr, CV 89 kr, LinkedIn 79 kr. Eller Jobbpaket 199 kr för alla tre.";
  if (/säg upp|sluta|uppsäg/.test(q))
    return "Uppsägningsbrev, 89 kr. Kort, datum, begäran om arbetsgivarintyg.";
  if (/nda|sekretess/.test(q)) return "Sekretessavtal, 99 kr. Svenska, inte en amerikansk mall.";
  if (/konsult|uppdrag|f-skatt/.test(q)) return "Konsultavtal, 149 kr. Uppdrag, arvode, IP, uppsägning.";
  if (/anställningsavtal|anställa/.test(q)) return "Anställningsavtal, 149 kr. Tjänst, lön, form.";
  if (/fullmakt/.test(q)) return "Fullmakt, 79 kr. En sida: vem, vad, hur länge.";
  if (/lån|skuld/.test(q)) return "Skuldebrev, 99 kr. Belopp, ränta, datum. Båda skriver under.";
  return "Säg vilket dokument: jobb, bostad, myndighet eller avtal. Priser 79–199 kr, Jobbpaket 199 kr, Pro 249 kr/mån. Inget konto. Inte juridisk rådgivning.";
}

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sql = await getSql();
    const rows = await sql<{ name: string; n: number }>`
      select name, count(*)::int as n from funnel_events
      where created_at > now() - interval '7 days'
      group by name
    `;
    const map: Record<string, number> = {};
    for (const r of rows) map[r.name] = r.n;
    return {
      previews: map.generate_preview ?? 0,
      full: map.generate_full ?? 0,
      paid: map.paid ?? 0,
    };
  } catch {
    return { previews: 0, full: 0, paid: 0 };
  }
});

export const recordEvent = createServerFn({ method: "POST" })
  .validator((input: { name: string; slug?: string }) => input)
  .handler(async ({ data }) => {
    const allowed = new Set(["view", "checkout", "paid", "copy"]);
    if (!allowed.has(data.name)) return { ok: false as const };
    await track(data.name, data.slug);
    return { ok: true as const };
  });
