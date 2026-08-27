import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "sv" | "en" | "ar";

export const LANGS: { id: Lang; short: string; name: string; dir: "ltr" | "rtl" }[] = [
  { id: "sv", short: "SV", name: "Svenska", dir: "ltr" },
  { id: "en", short: "EN", name: "English", dir: "ltr" },
  { id: "ar", short: "عربي", name: "العربية", dir: "rtl" },
];

const dict = {
  sv: {
    nav_brev: "Brev",
    nav_docs: "Dokument",
    nav_prices: "Priser",
    nav_guides: "Guider",
    nav_support: "Support",
    nav_write: "Skriv dokument",
    skip: "Hoppa till innehållet",
    kicker: "Svenska dokument, färdiga",
    hero: "Samboavtal efter bråket.",
    hero_sub: "Personligt brev. Överklagande. Samboavtal. Du fyller i fakta – Skrivklart skriver texten.",
    hero_meta: "Stripe · Utkast gratis · Klart på ungefär en minut",
    cta_doc: "Skriv mitt dokument",
    cta_brev: "Förklara ett myndighetsbrev",
    lang_note: "Dokumentet skrivs på svenska. Menyn kan du ha på ditt språk.",
    footer_blurb: "Samboavtal, överklagande, hyresansökan. Utkast, inte juridisk rådgivning.",
    about: "Om",
    terms: "Villkor",
    privacy: "Integritet",
    brev_kicker: "Brevklar, inbyggt",
    brev_h1: "Vad betyder det här brevet?",
    brev_lead:
      "FK, Skatteverket, Kronofogden, CSN. Klistra in texten. Du får det på vanlig svenska, med datum och nästa steg.",
    brev_label: "Brevet",
    brev_ph: "Klistra in från mejl, eller skriv av det du ser. Personnummer kan du stryka.",
    brev_go: "Förklara brevet",
    brev_free: "Utkastet är gratis. Vi sparar inte brevet.",
    brev_plain: "På vanlig svenska",
    brev_dates: "Datum",
    brev_do: "Gör så här",
    brev_lock: "Hela tolkningen",
    brev_lock_sub: "Vanlig svenska, alla datum, handlingsplan.",
    brev_unlock: "Lås upp för",
    brev_appeal: "Skriv överklagande",
    brev_reklamation: "Skriv reklamation",
    risk_low: "Låg",
    risk_mid: "Viktigt",
    risk_high: "Hög — agera snart",
    unknown_sender: "Okänd avsändare",
  },
  en: {
    nav_brev: "Letter",
    nav_docs: "Documents",
    nav_prices: "Pricing",
    nav_guides: "Guides",
    nav_support: "Support",
    nav_write: "Write a document",
    skip: "Skip to content",
    kicker: "Swedish documents, ready",
    hero: "Cohabitation agreement after the fight.",
    hero_sub: "Cover letter. Appeal. Cohabitation contract. You fill in the facts — Skrivklart writes the text.",
    hero_meta: "Stripe · Draft free · About a minute",
    cta_doc: "Write my document",
    cta_brev: "Explain a government letter",
    lang_note: "The document itself is in Swedish. The site can be in your language.",
    footer_blurb: "Cohabitation, appeals, rental applications. Drafts, not legal advice.",
    about: "About",
    terms: "Terms",
    privacy: "Privacy",
    brev_kicker: "Brevklar, built in",
    brev_h1: "What does this letter mean?",
    brev_lead:
      "Försäkringskassan, Skatteverket, Kronofogden, CSN. Paste the text. Get it in plain language, with dates and next steps.",
    brev_label: "The letter",
    brev_ph: "Paste from email, or type what you see. You can strike personal numbers.",
    brev_go: "Explain the letter",
    brev_free: "The draft is free. We do not store the letter.",
    brev_plain: "In plain language",
    brev_dates: "Dates",
    brev_do: "Do this",
    brev_lock: "Full reading",
    brev_lock_sub: "Plain language, every date, action plan.",
    brev_unlock: "Unlock for",
    brev_appeal: "Write an appeal",
    brev_reklamation: "Write a complaint",
    risk_low: "Low",
    risk_mid: "Needs action",
    risk_high: "High — act soon",
    unknown_sender: "Unknown sender",
  },
  ar: {
    nav_brev: "خطاب",
    nav_docs: "وثائق",
    nav_prices: "أسعار",
    nav_guides: "أدلة",
    nav_support: "دعم",
    nav_write: "اكتب وثيقة",
    skip: "انتقل إلى المحتوى",
    kicker: "وثائق سويدية جاهزة",
    hero: "عقد المساكنة بعد الشجار.",
    hero_sub: "رسالة عمل. طعن. عقد مساكنة. تملأ الوقائع — سكريفكلارت يكتب النص.",
    hero_meta: "سترايب · المسودة مجانية · حوالي دقيقة",
    cta_doc: "اكتب وثيقتي",
    cta_brev: "اشرح خطاب دائرة",
    lang_note: "الوثيقة نفسها بالسويدية. الواجهة بلغتك.",
    footer_blurb: "مساكنة، طعن، طلب إيجار. مسودة، وليست استشارة قانونية.",
    about: "عنّا",
    terms: "شروط",
    privacy: "خصوصية",
    brev_kicker: "بريفكلار مدمج",
    brev_h1: "ماذا يقول هذا الخطاب؟",
    brev_lead:
      "صندوق التأمين، مصلحة الضرائب، Kronofogden، CSN. الصق النص. يصلك بلغة واضحة مع التواريخ وما يجب فعله.",
    brev_label: "الخطاب",
    brev_ph: "الصق من البريد، أو اكتب ما تراه. يمكنك شطب الرقم الشخصي.",
    brev_go: "اشرح الخطاب",
    brev_free: "المسودة مجانية. لا نحفظ الخطاب.",
    brev_plain: "بلغة واضحة",
    brev_dates: "تواريخ",
    brev_do: "افعل هذا",
    brev_lock: "القراءة كاملة",
    brev_lock_sub: "لغة واضحة، كل التواريخ، خطة عمل.",
    brev_unlock: "افتح مقابل",
    brev_appeal: "اكتب طعناً",
    brev_reklamation: "اكتب شكوى",
    risk_low: "منخفض",
    risk_mid: "مهم",
    risk_high: "مرتفع — تحرّك سريعاً",
    unknown_sender: "مرسل غير معروف",
  },
} as const;

export type Msg = keyof (typeof dict)["sv"];

type I18nState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

export const useI18n = create<I18nState>()(
  persist(
    (set) => ({
      lang: "sv",
      setLang: (lang) => set({ lang }),
    }),
    { name: "skrivklart-lang" },
  ),
);

export function t(lang: Lang, key: Msg): string {
  return dict[lang][key] ?? dict.sv[key];
}

export function applyDocumentLang(lang: Lang) {
  if (typeof document === "undefined") return;
  const meta = LANGS.find((l) => l.id === lang)!;
  document.documentElement.lang = lang === "ar" ? "ar" : lang;
  document.documentElement.dir = meta.dir;
}

export function langName(lang: Lang) {
  if (lang === "en") return "English";
  if (lang === "ar") return "Arabic";
  return "svenska";
}
