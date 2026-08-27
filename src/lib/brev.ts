import { createServerFn } from "@tanstack/react-start";

export type BrevRiskLevel = "LOW" | "IMPORTANT" | "CRITICAL";

export type BrevAnalysis = {
  senderName: string | null;
  documentType: string | null;
  summary: string;
  plainLanguage: string;
  actionPlan: { step: string }[];
  consequences: string;
  deadlines: { description: string; dueDate: string | null }[];
  amounts: string[];
  referenceNumbers: string[];
  riskScore: number;
  riskLevel: BrevRiskLevel;
  breakdown: { legal: number; financial: number; deadline: number };
};

const SENDERS: Record<string, string> = {
  skatteverket: "Skatteverket",
  försäkringskassan: "Försäkringskassan",
  forsakringskassan: "Försäkringskassan",
  kronofogden: "Kronofogden",
  arbetsförmedlingen: "Arbetsförmedlingen",
  arbetsformedlingen: "Arbetsförmedlingen",
  csn: "CSN",
  migrationsverket: "Migrationsverket",
  förvaltningsrätten: "Förvaltningsrätten",
  kammarrätten: "Kammarrätten",
  inkasso: "Inkassobolag",
};

function clamp(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function deadlineRisk(dates: string[], now = new Date()) {
  const ts = dates
    .map((d) => new Date(d).getTime())
    .filter((t) => Number.isFinite(t));
  if (!ts.length) return 0;
  const days = Math.round((Math.min(...ts) - now.getTime()) / 86_400_000);
  if (days < 0) return 95;
  if (days <= 3) return 90;
  if (days <= 7) return 72;
  if (days <= 14) return 50;
  if (days <= 30) return 30;
  return 15;
}

function assess(a: Omit<BrevAnalysis, "riskScore" | "riskLevel">): BrevAnalysis {
  const breakdown = {
    legal: clamp(a.breakdown.legal),
    financial: clamp(a.breakdown.financial),
    deadline: Math.max(clamp(a.breakdown.deadline), deadlineRisk(a.deadlines.map((d) => d.dueDate).filter(Boolean) as string[])),
  };
  const weighted = 0.35 * breakdown.legal + 0.3 * breakdown.financial + 0.35 * breakdown.deadline;
  const peak = Math.max(breakdown.legal, breakdown.financial, breakdown.deadline);
  const riskScore = Math.round(Math.max(weighted, peak * 0.85));
  const riskLevel: BrevRiskLevel = riskScore >= 70 ? "CRITICAL" : riskScore >= 35 ? "IMPORTANT" : "LOW";
  return { ...a, breakdown, riskScore, riskLevel };
}

export function heuristicBrev(ocrText: string): BrevAnalysis {
  const text = ocrText.toLowerCase();
  const senderName = Object.entries(SENDERS).find(([key]) => text.includes(key))?.[1] ?? null;
  const isInkasso = /inkasso|kronofogd|betalningsföreläggande/.test(text);
  const isDemand = /krav|betala|förfaller|skuld|inbetalning/.test(text);
  const isAppeal = /överklag|avslag|beslut/.test(text);
  const amounts = Array.from(ocrText.matchAll(/(\d[\d\s]{2,}(?:[.,]\d{2})?)\s*(?:kr|kronor|sek)/gi)).map(
    (m) => `${m[1].trim()} kr`,
  );
  const referenceNumbers = Array.from(
    ocrText.matchAll(/(?:dnr|diarienr|referens(?:nr)?|ärende(?:nr)?)[:\s.]*([\w\-/]+)/gi),
  ).map((m) => m[1]);
  const isoDates = Array.from(ocrText.matchAll(/(\d{4}-\d{2}-\d{2})/g)).map((m) => m[1]);
  const swedates = Array.from(ocrText.matchAll(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/g)).map((m) => m[1]);
  const deadlines = [
    ...isoDates.map((d) => ({ description: "Datum i brevet", dueDate: d })),
    ...swedates.slice(0, 3).map((d) => ({ description: "Datum i brevet", dueDate: d })),
  ];
  const financial = amounts.length ? (isInkasso ? 85 : 55) : 15;
  const legal = isInkasso ? 75 : isAppeal ? 55 : isDemand ? 45 : 20;
  const documentType = isInkasso ? "Inkassoärende" : isAppeal ? "Beslut / överklagande" : isDemand ? "Kravbrev" : senderName ? "Myndighetsbrev" : null;

  return assess({
    senderName,
    documentType,
    summary: senderName
      ? `Brev från ${senderName}. ${isDemand ? "Det handlar om betalning eller krav." : isAppeal ? "Det ser ut som ett beslut." : "Läs vad som krävs av dig."}`
      : "Vi kunde inte säkert se avsändaren. Läs igenom och kolla om något måste göras.",
    plainLanguage:
      "Det här är en grov läsning av nyckelord, inte en full AI-tolkning. Kolla datum, belopp och om du måste svara. Inte juridisk rådgivning.",
    actionPlan: [
      { step: "Läs hela brevet, inte bara första sidan." },
      ...(deadlines.length ? [{ step: "Skriv upp datumen. En dag för sent räknas inte." }] : []),
      ...(amounts.length ? [{ step: "Kolla beloppen mot kontoutdrag eller tidigare beslut." }] : []),
      ...(isAppeal ? [{ step: "Om du ska överklaga: gör det inom fristen som står i beslutet." }] : []),
    ],
    consequences: isDemand
      ? "Om du inte agerar i tid kan det gå till inkasso eller Kronofogden, med extra avgifter."
      : "Vad som händer om du inte svarar står oftast i brevet. Missad frist kan inte tas om.",
    deadlines,
    amounts,
    referenceNumbers,
    breakdown: { legal, financial, deadline: deadlineRisk(isoDates) },
  });
}

function parseJson(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const candidate = fenced ? fenced[1] : trimmed;
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start !== -1 && end > start) return JSON.parse(candidate.slice(start, end + 1));
    throw new Error("json");
  }
}

async function chatJson(letter: string): Promise<BrevAnalysis | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      temperature: 0.2,
      max_tokens: 1400,
      messages: [
        {
          role: "system",
          content:
            "Du är Skrivklart. Du översätter svenska myndighetsbrev till rak svenska. Svara BARA med JSON, inget annat. Inte juridisk rådgivning. Hitta inte på diarienummer eller lagrum. Nycklar: senderName (string|null), documentType (string|null), summary (string, max 2 meningar), plainLanguage (string, 4–8 meningar), actionPlan (array av {step}), consequences (string), deadlines (array av {description, dueDate YYYY-MM-DD eller null}), amounts (string[]), referenceNumbers (string[]), breakdown ({legal, financial, deadline} 0–100).",
        },
        { role: "user", content: letter.slice(0, 12000) },
      ],
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = body.choices?.[0]?.message?.content?.trim();
  if (!raw) return null;
  try {
    const j = parseJson(raw) as Record<string, unknown>;
    return assess({
      senderName: typeof j.senderName === "string" ? j.senderName : null,
      documentType: typeof j.documentType === "string" ? j.documentType : null,
      summary: String(j.summary ?? ""),
      plainLanguage: String(j.plainLanguage ?? ""),
      actionPlan: Array.isArray(j.actionPlan)
        ? j.actionPlan.map((s) => ({ step: String((s as { step?: string }).step ?? s) })).filter((s) => s.step)
        : [],
      consequences: String(j.consequences ?? ""),
      deadlines: Array.isArray(j.deadlines)
        ? (j.deadlines as { description?: string; dueDate?: string | null }[]).map((d) => ({
            description: String(d.description ?? "Datum"),
            dueDate: d.dueDate ?? null,
          }))
        : [],
      amounts: Array.isArray(j.amounts) ? j.amounts.map(String) : [],
      referenceNumbers: Array.isArray(j.referenceNumbers) ? j.referenceNumbers.map(String) : [],
      breakdown: {
        legal: Number((j.breakdown as { legal?: number } | undefined)?.legal ?? 20),
        financial: Number((j.breakdown as { financial?: number } | undefined)?.financial ?? 20),
        deadline: Number((j.breakdown as { deadline?: number } | undefined)?.deadline ?? 20),
      },
    });
  } catch {
    return null;
  }
}

export const analyzeBrev = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => input)
  .handler(async ({ data }) => {
    const text = data.text.trim();
    if (text.length < 40) return { ok: false as const, error: "Klistra in mer av brevet – minst några meningar." };
    if (text.length > 20000) return { ok: false as const, error: "För långt. Klistra in brödtexten, inte hela PDF:en som bas64." };
    const ai = await chatJson(text);
    const full = ai ?? heuristicBrev(text);
    const preview: BrevAnalysis = {
      ...full,
      plainLanguage: "",
      actionPlan: [],
      consequences: "",
      deadlines: full.deadlines.slice(0, 1),
    };
    return { ok: true as const, preview, full };
  });
