export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  productSlug: string;
  minutes: number;
  body: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "personligt-brev-som-las",
    title: "Personligt brev som någon faktiskt läser",
    excerpt: "Skippa mallarna. Tre grejer rekryterare skummar efter – och hur du ger dem det.",
    productSlug: "personligt-brev",
    minutes: 4,
    body: [
      "Rekryterare läser inte brev. De skummar. Första meningen avgör om de går vidare till stycke två. Om stycke ett är 'jag söker härmed tjänsten som' är du redan borta.",
      "Öppna med något som bara du kan säga: en siffra, ett ansvar, ett problem du löst. Inte en känsla.",
      "Andra stycket: varför just det här bolaget. En konkret sak från annonsen räcker. Tredje: vad du vill göra i rollen, inte vad du hoppas få.",
      "Håll det under en sida. Avsluta med att du tar en intervju, inte att du 'ser fram emot återkoppling i den mån det är möjligt'.",
    ],
  },
  {
    slug: "overklaga-utan-att-skrika",
    title: "Överklaga Försäkringskassan utan att skrika",
    excerpt: "Myndigheter struntar i känslor. De struntar inte i fakta de missat.",
    productSlug: "overklagande",
    minutes: 5,
    body: [
      "Ett överklagande är inte ett brev till en vän. Det är en begäran att ett beslut ska ändras, med grunder.",
      "Skriv vad beslutet säger, vilket datum, och vad du yrkar. Sen: vilka fakta som saknades eller tolkades fel. Punkt. Inte din livshistoria.",
      "Bifoga det du hänvisar till. Om du inte har diarienummer, lämna en lucka och fyll i från beslutet.",
      "Skicka i tid. Frist står i beslutet. En dag för sent och texten är värdelös oavsett hur bra den är.",
    ],
  },
  {
    slug: "mall-overklagande-forsakringskassan",
    title: "Mall: överklaga Försäkringskassan",
    excerpt: "Strukturen en handläggare förväntar sig. Inte en mall att klistra i blint.",
    productSlug: "overklagande",
    minutes: 5,
    body: [
      "Rubrik: Överklagande av beslut den [datum], diarienummer [nr]. Mottagare: den instans som står i beslutet, ofta Förvaltningsrätten via Försäkringskassan.",
      "1) Vad beslutet säger. En mening. 2) Vad du yrkar: att beslutet upphävs och att [ersättning/insats] beviljas. 3) Grunder: fakta som saknades, felaktig bedömning, läkarintyg de inte vägt in.",
      "Håll känslor utanför. 'Jag är förtvivlad' flyttar inget. 'Läkarintyg 12 mars anger nedsättning 75 %, vilket inte nämns i beslutet' gör det.",
      "Skicka inom den frist som står i beslutet, vanligen tre veckor. Behåll kopia. Det här är ett utkast, inte juridisk rådgivning.",
    ],
  },
  {
    slug: "samboavtal-innan-det-brinner",
    title: "Samboavtal innan det brinner",
    excerpt: "Inte romantiskt. Billigare än att bråka om soffan och insatsen.",
    productSlug: "samboavtal",
    minutes: 4,
    body: [
      "Sambolagen är inte samma sak som äktenskapsbalken. Bodelning gäller samboegendom – främst gemensam bostad och bohag ni skaffat för gemensamt bruk.",
      "Ett samboavtal kan ta undan det, eller slå fast det. Poängen är att ni vet vad som gäller den dag någon av er vill det.",
      "Skriv vem som äger bostaden, vem som lagt insats, vad som är enskilt. Underskrift av båda. Vittnen är bra vana, inte alltid ett lagkrav för just samboavtal – men gör det ändå.",
      "Det här är ett utkast, inte juridisk rådgivning. Har ni hus, bolag eller barn: visa en jurist innan ni skriver under.",
    ],
  },
  {
    slug: "samboavtal-mall",
    title: "Samboavtal mall – vad som måste med",
    excerpt: "Parter, bostad, bohag, bodelning, underskrift. Resten är brus.",
    productSlug: "samboavtal",
    minutes: 4,
    body: [
      "Ett samboavtal som håller att läsa högt: namn och personnummer på er båda, datum ni flyttade ihop, adressen.",
      "Bostaden: hyresrätt, bostadsrätt eller hus. Vem som står på kontraktet. Vem som la kontantinsats. Om den ska vara samboegendom eller inte.",
      "Bohag ni vill hålla utanför – räkna upp. Bil, sparande, arv. Det som inte nämns kan bli en slagsmålspunkt senare.",
      "Avsluta med att sambolagens bodelningsregler ersätts eller gäller, datum, ort, två underskrifter. Utkast, inte rådgivning.",
    ],
  },
  {
    slug: "hyresansokan-stockholm",
    title: "Hyresansökan i Stockholm som inte hamnar i högen",
    excerpt: "Värdar drunknar i 'vi är skötsamma'. Ge dem risk, inkomst och datum.",
    productSlug: "hyresansokan",
    minutes: 3,
    body: [
      "Värden vill veta tre saker: kan du betala, kommer du sköta lägenheten, kan du flytta när de vill.",
      "Skriv hushåll, ungefärlig inkomst, anställning, om du har referens, och när du kan tillträda. Husdjur i en mening, inte en uppsats.",
      "Koppla till just den lägenheten. Område, storlek, varför den passar. Generiska kärleksbrev till 'er vackra tvåa' åker ut.",
    ],
  },
  {
    slug: "reklamera-ratt",
    title: "Reklamera så företaget inte kan låtsas att de inte förstått",
    excerpt: "Krav, frist, kvitto. Inte en recension.",
    productSlug: "reklamation",
    minutes: 3,
    body: [
      "Säg vad du köpt, när, vad som är fel, och vad du kräver: reparation, ny vara, prisavdrag eller häva köpet.",
      "Ge en frist. 14 dagar är begripligt. Skriv att du vänder dig vidare om de tiger.",
      "Spara mailet. Chattar försvinner. Ett brev på pränt är det som räknas om ARN kommer in.",
    ],
  },
  {
    slug: "lana-ut-till-en-van",
    title: "När du lånar ut till en vän",
    excerpt: "Skuldebrevet är inte misstro. Det är hur vänskapen överlever beloppet.",
    productSlug: "skuldebrev",
    minutes: 3,
    body: [
      "Skriv belopp, om det är ränta eller inte, när det ska vara tillbaka, och vad som händer om det drar ut.",
      "Båda skriver under. En kopia var. Swish-historik är inte ett avtal.",
      "Om summan gör ont i magen redan nu: låna inte ut. Papperet räddar inte en dålig magkänsla.",
    ],
  },
  {
    slug: "konsultavtal-enskild-firma",
    title: "Konsultavtal för enskild firma",
    excerpt: "Uppdrag, arvode, IP. Innan du börjar i Slack.",
    productSlug: "konsultavtal",
    minutes: 4,
    body: [
      "Skriv vem som är uppdragsgivare och vem som är konsult, org.nr om ni har. Vad som ska levereras, när, var.",
      "Arvode: timme eller fast. När fakturan går. Dröjsmålsränta. Utlägg. F-skatt – du ansvarar för egna avgifter.",
      "IP: vem äger resultatet. Standard i Sverige är att kunden får det ni avtalat, resten stannar hos konsulten om ni inte säger annat.",
      "Uppsägning i dagar, inte 'när det känns'. Tillämplig lag Sverige. Utkast, inte juridisk rådgivning.",
    ],
  },
  {
    slug: "cv-profil-utan-floskler",
    title: "CV-profil utan floskler",
    excerpt: "Fem rader som avgör om de läser erfarenheten.",
    productSlug: "cv-text",
    minutes: 3,
    body: [
      "Profilen är inte en sammanfattning av allt du gjort. Den är ett svar på 'varför just du till den här tjänsten'.",
      "Börja med roll + år + en konkret effekt. Inte 'driven lagspelare med öga för detaljer'.",
      "Tre styrkor max, kopplade till sådant du kan peka på i punkterna under. Resten är brus de redan sett hundra gånger.",
    ],
  },
];

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug);
}
