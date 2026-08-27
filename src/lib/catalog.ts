export type FieldType = "text" | "textarea" | "select";

export type Field = {
  id: string;
  label: string;
  placeholder: string;
  type: FieldType;
  hint?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
};

export type Category = "jobb" | "bostad" | "myndighet" | "avtal";

export type DocProduct = {
  slug: string;
  name: string;
  short: string;
  pitch: string;
  priceKr: number;
  category: Category;
  outcome: string;
  fields: Field[];
  extraPrompt: string;
};

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "jobb", label: "Jobb" },
  { id: "bostad", label: "Bostad" },
  { id: "myndighet", label: "Myndighet" },
  { id: "avtal", label: "Avtal" },
];

const TONE: Field = {
  id: "ton",
  label: "Ton",
  type: "select",
  placeholder: "Välj ton",
  required: true,
  options: [
    { value: "saklig", label: "Saklig och rak" },
    { value: "varm", label: "Varm men professionell" },
    { value: "kort", label: "Så kort det går" },
  ],
};

export const PRODUCTS: DocProduct[] = [
  {
    slug: "personligt-brev",
    name: "Personligt brev",
    short: "Ansökan som låter som du, inte som en mall.",
    pitch:
      "De flesta personliga brev luktar ChatGPT och mall. Det här blir ett brev en rekryterare faktiskt läser färdigt.",
    priceKr: 89,
    category: "jobb",
    outcome: "Ett komplett personligt brev, klart att klistra in.",
    fields: [
      {
        id: "roll",
        label: "Tjänst",
        type: "text",
        placeholder: "T.ex. Kundtjänstmedarbetare, Butikssäljare",
        required: true,
      },
      {
        id: "arbetsgivare",
        label: "Arbetsgivare",
        type: "text",
        placeholder: "Företag eller organisation",
        required: true,
      },
      {
        id: "bakgrund",
        label: "Din bakgrund",
        type: "textarea",
        placeholder: "Vad har du gjort? Utbildning, jobb, grejer som räknas.",
        required: true,
      },
      {
        id: "varfor",
        label: "Varför just den här tjänsten",
        type: "textarea",
        placeholder: "Vad lockar? Vad kan du bidra med?",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett personligt brev på svenska. Inget 'jag är en lagspelare'. Konkreta meningar. Max 420 ord. Inled med namn/plats/datum som platshållare. Avsluta med artig hälsning och [Ditt namn].",
  },
  {
    slug: "cv-text",
    name: "CV-profil",
    short: "Profiltexten längst upp som avgör om de läser resten.",
    pitch: "En skarp profil på 5–7 rader plus omskrivna punktlistor till tre senaste rollerna.",
    priceKr: 89,
    category: "jobb",
    outcome: "Profiltext + tre bearbetade erfarenhetspunkter.",
    fields: [
      {
        id: "mal",
        label: "Vad du söker",
        type: "text",
        placeholder: "T.ex. Lager, ekonomiassistent, undersköterska",
        required: true,
      },
      {
        id: "erfarenhet",
        label: "Erfarenhet i grova drag",
        type: "textarea",
        placeholder: "Roller, år, vad du faktiskt gjorde.",
        required: true,
      },
      {
        id: "styrkor",
        label: "Det du är bäst på",
        type: "textarea",
        placeholder: "Tre saker du vill att de minns.",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv en CV-profil (5–7 rader) plus tre avsnitt med rubrik + 3–4 punktlistor. Svenska. Inga klyschor. Använd [företag], [år] där det saknas.",
  },
  {
    slug: "linkedin-profil",
    name: "LinkedIn-text",
    short: "Om-sektion som inte låter som en pressrelease.",
    pitch: "Rubrik, om-text och tre erfarenhetsrader redo att klistra in.",
    priceKr: 79,
    category: "jobb",
    outcome: "LinkedIn-rubrik + om-text.",
    fields: [
      {
        id: "roll",
        label: "Nuvarande eller önskad roll",
        type: "text",
        placeholder: "T.ex. Projektledare, Elektriker, Säljare",
        required: true,
      },
      {
        id: "bakgrund",
        label: "Vem du är i korthet",
        type: "textarea",
        placeholder: "Bransch, år, vad folk kommer till dig för.",
        required: true,
      },
      {
        id: "mal",
        label: "Vad du vill att profilen ska leda till",
        type: "text",
        placeholder: "Jobb, kunder, nätverk…",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv: 1) headline max 110 tecken 2) Om-text 120–180 ord, stycken, inte emojis 3) tre korta erfarenhetspunkter. Svenska.",
  },
  {
    slug: "uppsagning",
    name: "Uppsägningsbrev",
    short: "Säg upp jobbet utan att bränna bron – eller rummet.",
    pitch: "Kort, sakligt, datum. Det HR faktiskt behöver. Inte ett avskedsbrev till chefen.",
    priceKr: 89,
    category: "jobb",
    outcome: "Uppsägningsbrev redo att skicka.",
    fields: [
      {
        id: "arbetsgivare",
        label: "Arbetsgivare",
        type: "text",
        placeholder: "Företag",
        required: true,
      },
      {
        id: "roll",
        label: "Din tjänst",
        type: "text",
        placeholder: "T.ex. Säljare, Undersköterska",
        required: true,
      },
      {
        id: "sista-dag",
        label: "Sista anställningsdag du räknar med",
        type: "text",
        placeholder: "T.ex. 30 september, eller 'enligt avtal'",
        required: true,
      },
      {
        id: "anledning",
        label: "Vill du nämna varför? (valfritt)",
        type: "textarea",
        placeholder: "Lämna tomt om du inte vill. En mening räcker.",
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett uppsägningsbrev på svenska. Kort. Datum, tjänst, sista dag, begäran om bekräftelse och arbetsgivarintyg. Ingen drama. Max 220 ord.",
  },
  {
    slug: "hyresansokan",
    name: "Hyresansökan",
    short: "Brevet som gör att värden ringer dig först.",
    pitch:
      "Stockholmsvärdar drunknar i 'vi är skötsamma'. Det här brevet är konkret, lugnt och svårt att sålla bort.",
    priceKr: 89,
    category: "bostad",
    outcome: "Komplett ansökningsbrev till hyresvärd.",
    fields: [
      {
        id: "objekt",
        label: "Lägenheten",
        type: "text",
        placeholder: "T.ex. 2:a på Södermalm, Blocket-annons",
        required: true,
      },
      {
        id: "hushall",
        label: "Vem ska bo där",
        type: "textarea",
        placeholder: "Antal, jobb, inkomst ungefär, husdjur.",
        required: true,
      },
      {
        id: "varfor",
        label: "Varför just den",
        type: "textarea",
        placeholder: "Område, avstånd till jobb, tidslinje.",
        required: true,
      },
      {
        id: "trygghet",
        label: "Varför du är en säker hyresgäst",
        type: "textarea",
        placeholder: "Referenser, bindningstid, skötsamhet – konkret.",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett hyresansökningsbrev. Sakligt, varmt, inga tiggarmenningar. Max 380 ord. Inkludera [telefon] [e-post] som platshållare.",
  },
  {
    slug: "andrahandskontrakt",
    name: "Andrahandskontrakt",
    short: "Utkast till andrahandsuthyrning som båda kan skriva under.",
    pitch: "Hyra ut eller hyra? Ett begripligt kontrakt med hyra, period, skick och uppsägning.",
    priceKr: 149,
    category: "bostad",
    outcome: "Avtalsutkast med numrerade paragrafer.",
    fields: [
      {
        id: "parter",
        label: "Parterna",
        type: "textarea",
        placeholder: "Hyresvärd (förstahand) och hyresgäst – namn om du har, annars beskriv.",
        required: true,
      },
      {
        id: "objekt",
        label: "Bostaden",
        type: "text",
        placeholder: "Adress, storlek, vad som ingår",
        required: true,
      },
      {
        id: "villkor",
        label: "Hyra, period, deposition",
        type: "textarea",
        placeholder: "Belopp, datum, el/internet, uppsägningstid.",
        required: true,
      },
      {
        id: "ovrigt",
        label: "Övrigt som måste med",
        type: "textarea",
        placeholder: "Husdjur, rökning, andrahands godkännande från förening/värd.",
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett andrahandskontrakt på svenska med numrerade paragrafer: parter, objekt, period, hyra, skick, uppsägning, tvister. Platshållare i [hakparentes] där fakta saknas. Inte juridiskt ombud-språk, men formellt.",
  },
  {
    slug: "overklagande",
    name: "Överklagande",
    short: "Svaret till Försäkringskassan, CSN, Skatteverket eller a-kassan.",
    pitch:
      "Du är arg och trött. Texten ska vara kall, precis och svår att avfärda. Inte ett känslobrev.",
    priceKr: 199,
    category: "myndighet",
    outcome: "Ett komplett överklagande redo att skickas.",
    fields: [
      {
        id: "myndighet",
        label: "Myndighet",
        type: "select",
        placeholder: "Välj",
        required: true,
        options: [
          { value: "forsakringskassan", label: "Försäkringskassan" },
          { value: "csn", label: "CSN" },
          { value: "skatteverket", label: "Skatteverket" },
          { value: "akassa", label: "A-kassan" },
          { value: "kommun", label: "Kommun / socialtjänst" },
          { value: "annan", label: "Annan" },
        ],
      },
      {
        id: "beslut",
        label: "Vad beslutet säger",
        type: "textarea",
        placeholder: "Avslag på vad? Diarienummer om du har. Datum.",
        required: true,
      },
      {
        id: "fel",
        label: "Varför beslutet är fel",
        type: "textarea",
        placeholder: "Fakta de missat, felaktiga antaganden, vad du kan visa.",
        required: true,
      },
      {
        id: "yrkande",
        label: "Vad du vill ska hända",
        type: "textarea",
        placeholder: "T.ex. att beslutet upphävs och ersättning beviljas.",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett formellt överklagande. Struktur: rubrik, diarienummer-platshållare, bakgrund, grunder, bevisning, yrkande, underskrift. Sakligt. Inga utropstecken. Hänvisa till 'beslutet den [datum]'. Svenska myndighetssvenska, inte advokatjargong.",
  },
  {
    slug: "myndighetsbrev",
    name: "Myndighetsbrev",
    short: "Vad FK, Skatteverket eller Kronofogden egentligen säger.",
    pitch:
      "Klistra in brevet. Du får det på vanlig svenska, med datum och vad du ska göra. Sen kan du skriva svaret.",
    priceKr: 79,
    category: "myndighet",
    outcome: "En tolkning du kan agera på, plus länk till överklagande.",
    fields: [
      {
        id: "brevet",
        label: "Brevet",
        type: "textarea",
        placeholder: "Klistra in texten. Stryk personnummer.",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv en rak svensk sammanfattning av myndighetsbrevet: avsändare, vad de kräver, datum, vad mottagaren bör göra. Inte juridisk rådgivning. Platshållare i [hakparentes] om fakta saknas.",
  },
  {
    slug: "reklamation",
    name: "Reklamation",
    short: "Kräv pengarna eller bytet – utan att låta knäpp.",
    pitch: "Konsumentköplagen på din sida, i ett brev företaget inte kan ignorera.",
    priceKr: 79,
    category: "myndighet",
    outcome: "Reklamationsbrev med tydligt krav.",
    fields: [
      {
        id: "foretag",
        label: "Företag",
        type: "text",
        placeholder: "Butik, e-handel, hantverkare…",
        required: true,
      },
      {
        id: "kop",
        label: "Vad du köpte och när",
        type: "textarea",
        placeholder: "Vara/tjänst, pris, ordernummer, datum.",
        required: true,
      },
      {
        id: "fel",
        label: "Felet",
        type: "textarea",
        placeholder: "Vad är fel, när upptäckte du det, vad har du redan sagt.",
        required: true,
      },
      {
        id: "krav",
        label: "Vad du kräver",
        type: "select",
        placeholder: "Välj",
        required: true,
        options: [
          { value: "avhjalpande", label: "Reparation" },
          { value: "omleverans", label: "Ny vara / gör om" },
          { value: "prisavdrag", label: "Prisavdrag" },
          { value: "hagang", label: "Häva köpet och få pengarna tillbaka" },
        ],
      },
      TONE,
    ],
    extraPrompt:
      "Skriv en reklamation enligt svensk konsumenträtt i tonen, utan att påstå att du är jurist. Tydligt krav, skälig frist (14 dagar), orderreferens som platshållare. Max 350 ord.",
  },
  {
    slug: "klagomal",
    name: "Klagomål",
    short: "Formellt klagomål till bolag, nämnd eller kommun.",
    pitch: "När chatten sagt 'vi kan inte göra mer' och du vill ha det på pränt.",
    priceKr: 89,
    category: "myndighet",
    outcome: "Klagomålsbrev med kronologi och yrkande.",
    fields: [
      {
        id: "mottagare",
        label: "Vem det ska till",
        type: "text",
        placeholder: "T.ex. Hyresnämnden, ARN, kommunen, bolagets klagomål",
        required: true,
      },
      {
        id: "arende",
        label: "Vad det gäller",
        type: "textarea",
        placeholder: "Kronologi. Vad hände, när, vilka du pratat med.",
        required: true,
      },
      {
        id: "krav",
        label: "Vad du vill",
        type: "textarea",
        placeholder: "Ersättning, rättelse, skriftligt svar…",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett formellt klagomål. Kronologi i datumordning, bilagehänvisningar som platshållare, tydligt yrkande. Ingen ilska.",
  },
  {
    slug: "arn-anmalan",
    name: "ARN-anmälan",
    short: "När företaget sagt nej och du vill ha det prövat.",
    pitch: "Strukturen ARN förväntar sig: parter, avtal, vad som hänt, yrkande, bilagor.",
    priceKr: 149,
    category: "myndighet",
    outcome: "Utkast till anmälan till Allmänna reklamationsnämnden.",
    fields: [
      {
        id: "foretag",
        label: "Företaget",
        type: "text",
        placeholder: "Namn, gärna org.nr om du har",
        required: true,
      },
      {
        id: "kop",
        label: "Köpet",
        type: "textarea",
        placeholder: "Vad, när, pris, ordernummer.",
        required: true,
      },
      {
        id: "fel",
        label: "Vad som hänt",
        type: "textarea",
        placeholder: "Felet, hur du reklamerat, vad de svarat.",
        required: true,
      },
      {
        id: "krav",
        label: "Vad du vill att ARN ska besluta",
        type: "textarea",
        placeholder: "Pengarna tillbaka, prisavdrag, reparation…",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv en ARN-anmälan på svenska. Rubriker: parter, avtalet, händelseförlopp, yrkande, bilagor. Sakligt. Inte rättegångssvenska. Platshållare i [hakparentes].",
  },
  {
    slug: "samboavtal",
    name: "Samboavtal",
    short: "Vem äger vad om det tar slut. Innan det tar slut.",
    pitch:
      "Billigare än en kväll hos jurist. Ni fyller i, läser, skriver under. Inte juridisk rådgivning – ett skarpt utkast.",
    priceKr: 149,
    category: "avtal",
    outcome: "Samboavtal med bohag, bostad och bodelning.",
    fields: [
      {
        id: "parter",
        label: "Ni två",
        type: "textarea",
        placeholder: "Namn om du vill, annars 'Sambo A / Sambo B'. Bodde ihop sedan?",
        required: true,
      },
      {
        id: "bostad",
        label: "Bostaden",
        type: "textarea",
        placeholder: "Hyresrätt/bostadsrätt/hus, vem står på kontraktet, insats.",
        required: true,
      },
      {
        id: "egendom",
        label: "Vad som är vems",
        type: "textarea",
        placeholder: "Bil, sparande, bohag ni vill hålla utanför.",
        required: true,
      },
      {
        id: "onskemal",
        label: "Särskilda önskemål",
        type: "textarea",
        placeholder: "T.ex. att samboegendom inte ska ingå, eller att den ska.",
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett samboavtal enligt sambolagens logik, på begriplig svenska, numrerade paragrafer, underskriftsrader, plats för vittnen. Platshållare i [hakparentes]. Påminn inte inne i avtalet att det 'inte är juridisk rådgivning'.",
  },
  {
    slug: "skuldebrev",
    name: "Skuldebrev",
    short: "När du lånar ut till någon du tycker om – på papper.",
    pitch: "Belopp, ränta, amortering, förfallodag. Så vänskapen överlever pengarna.",
    priceKr: 99,
    category: "avtal",
    outcome: "Enkelt skuldebrev redo att skrivas under.",
    fields: [
      {
        id: "parter",
        label: "Långivare och låntagare",
        type: "textarea",
        placeholder: "Namn eller 'A lånar ut till B'.",
        required: true,
      },
      {
        id: "villkor",
        label: "Belopp, ränta, återbetalning",
        type: "textarea",
        placeholder: "Hur mycket, när, ränta eller räntefritt, delbetalning?",
        required: true,
      },
      {
        id: "ovrigt",
        label: "Övrigt",
        type: "textarea",
        placeholder: "Säkerhet, vad som händer vid försening.",
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett enkelt löpande/enkelt skuldebrev på svenska. Paragrafer: parter, belopp, ränta, återbetalning, dröjsmål, underskrift. Platshållare i [hakparentes].",
  },
  {
    slug: "sekretessavtal",
    name: "Sekretessavtal",
    short: "NDA på svenska, utan amerikansk mallöversättning.",
    pitch: "När du ska visa en idé, kundlista eller kod för någon utomstående.",
    priceKr: 99,
    category: "avtal",
    outcome: "Sekretessavtal / NDA-utkast.",
    fields: [
      {
        id: "parter",
        label: "Parterna",
        type: "textarea",
        placeholder: "Vem avslöjar, vem tar emot. Företag eller privat.",
        required: true,
      },
      {
        id: "vad",
        label: "Vad som är hemligt",
        type: "textarea",
        placeholder: "Affärsidé, kod, kundlista, priser…",
        required: true,
      },
      {
        id: "tid",
        label: "Hur länge",
        type: "text",
        placeholder: "T.ex. 2 år, 5 år, så länge samarbetet pågår + 2 år",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett svenskt sekretessavtal (NDA), dual-use enparts/tvåparts med platshållare. Paragrafer: definition, undantag, tid, återlämning, vite som [belopp] valfritt, tillämplig lag Sverige. Begriplig svenska.",
  },
  {
    slug: "konsultavtal",
    name: "Konsultavtal",
    short: "Uppdrag, arvode, IP och uppsägning – ett utkast du kan skicka.",
    pitch: "Sluta starta jobb på en Slack-rad. Det här är avtalet du skickar innan du börjar.",
    priceKr: 149,
    category: "avtal",
    outcome: "Konsultavtal för enskild / AB.",
    fields: [
      {
        id: "parter",
        label: "Uppdragsgivare och konsult",
        type: "textarea",
        placeholder: "Bolag, org.nr om du har, annars beskriv.",
        required: true,
      },
      {
        id: "uppdrag",
        label: "Vad som ska göras",
        type: "textarea",
        placeholder: "Leverans, period, var arbetet sker.",
        required: true,
      },
      {
        id: "arvode",
        label: "Arvode och betalning",
        type: "textarea",
        placeholder: "Timpris eller fast, betalvillkor, utlägg.",
        required: true,
      },
      {
        id: "ovrigt",
        label: "IP, konkurrens, övrigt",
        type: "textarea",
        placeholder: "Vem äger resultatet, uppsägningstid.",
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett svenskt konsultavtal. Paragrafer: parter, uppdrag, arvode, F-skatt/ansvar, IP, sekretess, uppsägning, tillämplig lag. Platshållare i [hakparentes].",
  },
  {
    slug: "anstallningsavtal",
    name: "Anställningsavtal",
    short: "Tjänst, lön, form – ett utkast ni båda kan läsa högt.",
    pitch: "För den som anställer utan HR-avdelning. Inte ett 18-sidigt byråpaket.",
    priceKr: 149,
    category: "avtal",
    outcome: "Anställningsavtal med de punkter som måste med.",
    fields: [
      {
        id: "arbetsgivare",
        label: "Arbetsgivare",
        type: "textarea",
        placeholder: "Bolag, org.nr om du har.",
        required: true,
      },
      {
        id: "arbetstagare",
        label: "Arbetstagare",
        type: "text",
        placeholder: "Namn, eller 'Arbetstagaren'",
        required: true,
      },
      {
        id: "roll",
        label: "Tjänst och tillträde",
        type: "textarea",
        placeholder: "Befattning, plats, startdatum.",
        required: true,
      },
      {
        id: "form",
        label: "Anställningsform",
        type: "textarea",
        placeholder: "Tillsvidare/visstid, heltid/deltid, kollektivavtal?",
        required: true,
      },
      {
        id: "lon",
        label: "Lön och förmåner",
        type: "textarea",
        placeholder: "Månadslön, semester, övrigt.",
        required: true,
      },
      {
        id: "ovrigt",
        label: "Övrigt",
        type: "textarea",
        placeholder: "Sekretess, bisyssla, provanställning.",
      },
      TONE,
    ],
    extraPrompt:
      "Skriv ett svenskt anställningsavtal. Paragrafer: parter, tjänst, form, lön, semester, uppsägning, kollektivavtal-platshållare. Begriplig svenska. Inte juridisk rådgivning inne i texten.",
  },
  {
    slug: "fullmakt",
    name: "Fullmakt",
    short: "Någon får göra en sak åt dig. På papper.",
    pitch: "Bank, flytt, Skatteverket, lägenhetsköp. En sida, två vittnen om du vill.",
    priceKr: 79,
    category: "avtal",
    outcome: "Fullmakt redo att skrivas under.",
    fields: [
      {
        id: "givare",
        label: "Vem ger fullmakten",
        type: "text",
        placeholder: "Ditt namn, eller 'Fullmaktsgivaren'",
        required: true,
      },
      {
        id: "mottagare",
        label: "Vem får den",
        type: "text",
        placeholder: "Namn på den som ska agera",
        required: true,
      },
      {
        id: "uppdrag",
        label: "Vad den får göra",
        type: "textarea",
        placeholder: "T.ex. hämta paket, skriva under hyresavtal, företräda mot banken.",
        required: true,
      },
      {
        id: "tid",
        label: "Hur länge",
        type: "text",
        placeholder: "T.ex. t.o.m. 31 december, eller tills vidare",
        required: true,
      },
      TONE,
    ],
    extraPrompt:
      "Skriv en svensk fullmakt. Parter, uppdragets gränser, giltighetstid, återkallelse, underskrift och vittnen. Platshållare i [hakparentes]. Kort.",
  },
];

export const PRO_PRICE_KR = 249;

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCategory(cat: Category | "alla") {
  if (cat === "alla") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === cat);
}
