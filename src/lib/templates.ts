/** Offline/fallback writer so a sale still delivers if the model is down. */

function val(answers: Record<string, string>, key: string, fallback: string) {
  const v = answers[key]?.trim();
  return v || fallback;
}

function previewOf(full: string) {
  const parts = full.split(/\n\n+/);
  const take = parts.slice(0, 2).join("\n\n");
  if (take.length > 80) return `${take}\n\n…`;
  return `${full.slice(0, 420).trim()}\n\n…`;
}

export function fallbackDocument(
  slug: string,
  answers: Record<string, string>,
  mode: "preview" | "full",
) {
  const full = write(slug, answers);
  return mode === "preview" ? previewOf(full) : full;
}

function write(slug: string, a: Record<string, string>): string {
  switch (slug) {
    case "personligt-brev":
      return personligtBrev(a);
    case "cv-text":
      return cvText(a);
    case "linkedin-profil":
      return linkedin(a);
    case "hyresansokan":
      return hyresansokan(a);
    case "andrahandskontrakt":
      return andrahand(a);
    case "overklagande":
      return overklagande(a);
    case "reklamation":
      return reklamation(a);
    case "klagomal":
      return klagomal(a);
    case "samboavtal":
      return samboavtal(a);
    case "skuldebrev":
      return skuldebrev(a);
    case "sekretessavtal":
      return nda(a);
    case "konsultavtal":
      return konsult(a);
    case "uppsagning":
      return uppsagning(a);
    case "arn-anmalan":
      return arn(a);
    case "anstallningsavtal":
      return anstallning(a);
    case "fullmakt":
      return fullmakt(a);
    default:
      return "Kunde inte skriva det dokumentet just nu.";
  }
}

function personligtBrev(a: Record<string, string>) {
  const roll = val(a, "roll", "[tjänst]");
  const bolag = val(a, "arbetsgivare", "[arbetsgivare]");
  const bakgrund = val(a, "bakgrund", "[din bakgrund]");
  const varfor = val(a, "varfor", "[varför tjänsten]");
  return `[Ort] den [datum]

Ansökan: ${roll}, ${bolag}

Jag söker tjänsten som ${roll} hos er.

${bakgrund}

${varfor}

Jag tar gärna en intervju och kan börja enligt överenskommelse.

Med vänlig hälsning
[Ditt namn]
[telefon]
[e-post]`;
}

function cvText(a: Record<string, string>) {
  const mal = val(a, "mal", "[önskad roll]");
  const exp = val(a, "erfarenhet", "[erfarenhet]");
  const styrkor = val(a, "styrkor", "[styrkor]");
  return `Profil
${mal}. ${exp} Jag vill att ni minns: ${styrkor}

Erfarenhet
[Roll], [företag] ([år]–[år])
• Ansvar och resultat i en mening.
• Verktyg eller metod du faktiskt använde.
• Något mätbart om du har det.

[Roll], [företag] ([år]–[år])
• Tre punkter, samma logik.

[Roll], [företag] ([år]–[år])
• Tre punkter, samma logik.`;
}

function linkedin(a: Record<string, string>) {
  const roll = val(a, "roll", "[roll]");
  const bakgrund = val(a, "bakgrund", "[bakgrund]");
  const mal = val(a, "mal", "[mål]");
  return `Headline
${roll} | ${mal}

Om
${bakgrund}

Jag är mest intressant för folk som behöver ${roll.toLowerCase()} och vill ha någon som levererar utan teater.

Erfarenhet
• ${roll} — [företag], [år]
• [tidigare roll] — [företag], [år]
• [tidigare roll] — [företag], [år]`;
}

function hyresansokan(a: Record<string, string>) {
  return `[Ort] den [datum]

Hyresansökan: ${val(a, "objekt", "[lägenhet]")}

Hej,

Jag vill hyra ${val(a, "objekt", "[lägenheten]")}.

Hushåll: ${val(a, "hushall", "[hushåll]")}

Varför just den: ${val(a, "varfor", "[varför]")}

Varför jag är en säker hyresgäst: ${val(a, "trygghet", "[trygghet]")}

Jag kan tillträda [datum] och skickar gärna referens, anställningsavtal och senaste lönespecifikation.

Med vänlig hälsning
[Namn]
[telefon]
[e-post]`;
}

function andrahand(a: Record<string, string>) {
  return `ANDRAHANDSAVTAL

1. Parter
${val(a, "parter", "[hyresvärd i första hand / hyresgäst]")}

2. Objekt
${val(a, "objekt", "[adress, storlek, vad som ingår]")}

3. Hyra, period, deposition
${val(a, "villkor", "[hyra, datum, el/internet, uppsägning]")}

4. Skick
Lägenheten hyrs i det skick den visats. Skador utöver normalt slitage ersätts av hyresgästen.

5. Andrahandsuthyrning och regler
Andrahandsuthyrning kräver giltigt godkännande från förening/värd. ${val(a, "ovrigt", "")}

6. Uppsägning
Skriftlig uppsägning enligt villkoren i punkt 3.

7. Tvist
Svensk lag. Tvist prövas av svensk allmän domstol.

Ort och datum: [ort], [datum]

______________________          ______________________
Hyresvärd (förstahand)          Hyresgäst`;
}

function overklagande(a: Record<string, string>) {
  const mynd = val(a, "myndighet", "[myndighet]");
  return `Överklagande av beslut

Mottagare: ${mynd}
Diarienummer: [diarienummer]
Beslutets datum: [datum]

1. Bakgrund
${val(a, "beslut", "[vad beslutet säger]")}

2. Yrkande
${val(a, "yrkande", "[vad du vill ska hända]")}

3. Grunder
${val(a, "fel", "[varför beslutet är fel]")}

Jag ber att handlingarna kompletteras med de bilagor som följer, märkta Bilaga 1 och framåt.

Ort och datum: [ort], [datum]

[Namn]
[personnummer utelämnat — fyll i på utskriften]
[adress]
[telefon]
[e-post]`;
}

function reklamation(a: Record<string, string>) {
  const kravMap: Record<string, string> = {
    avhjalpande: "reparation",
    omleverans: "ny vara / att arbetet görs om",
    prisavdrag: "prisavdrag",
    hagang: "att köpet hävs och att pengarna återbetalas",
  };
  const krav = kravMap[a.krav] ?? val(a, "krav", "[krav]");
  return `Reklamation

Till: ${val(a, "foretag", "[företag]")}
Order/avtal: [ordernummer]
Datum: [datum]

Jag reklamerar följande köp:
${val(a, "kop", "[vad du köpte och när]")}

Felet:
${val(a, "fel", "[felet]")}

Jag kräver ${krav}.

Jag ber om skriftligt svar inom 14 dagar. Om ni inte åtgärdar ärendet tar jag det vidare, bland annat till ARN när det är tillämpligt.

Med vänlig hälsning
[Namn]
[telefon]
[e-post]
[adress]`;
}

function klagomal(a: Record<string, string>) {
  return `Klagomål

Till: ${val(a, "mottagare", "[mottagare]")}
Ärende: [diarienummer/ärendenummer om du har]

Vad det gäller
${val(a, "arende", "[kronologi]")}

Yrkande
${val(a, "krav", "[vad du vill]")}

Bilagor: [lista]

Ort och datum: [ort], [datum]

[Namn]
[telefon]
[e-post]`;
}

function samboavtal(a: Record<string, string>) {
  return `SAMBOAVTAL

1. Parter
${val(a, "parter", "[sambo A och sambo B]")}

2. Bostad
${val(a, "bostad", "[bostaden]")}

3. Egendom
${val(a, "egendom", "[vad som är vems]")}

4. Särskilda bestämmelser
${val(a, "onskemal", "Inga utöver detta avtal.")}

5. Bodelning
Parterna är överens om att sambolagens bodelningsregler ersätts av detta avtal i den utsträckning avtalet reglerar egendomen.

6. Underskrift
Avtalet gäller när båda har undertecknat.

Ort och datum: [ort], [datum]

______________________          ______________________
Sambo A                         Sambo B

Vittne: ________________        Vittne: ________________`;
}

function skuldebrev(a: Record<string, string>) {
  return `SKULDEBREV

1. Parter
${val(a, "parter", "[långivare och låntagare]")}

2. Skulden
${val(a, "villkor", "[belopp, ränta, återbetalning]")}

3. Övrigt
${val(a, "ovrigt", "Inga särskilda villkor.")}

4. Dröjsmål
Vid försening utgår dröjsmålsränta enligt räntelagen om inte annat avtalats.

5. Underskrift
Låntagaren erkänner skulden och förbinder sig att betala enligt detta brev.

Ort och datum: [ort], [datum]

______________________          ______________________
Långivare                       Låntagare`;
}

function nda(a: Record<string, string>) {
  return `SEKRETESSAVTAL

1. Parter
${val(a, "parter", "[parterna]")}

2. Konfidentiell information
${val(a, "vad", "[vad som är hemligt]")}

3. Tid
Skyldigheten gäller ${val(a, "tid", "[tid]")} och därefter så länge informationen inte är allmänt känd.

4. Undantag
Avtalet gäller inte information som mottagaren redan hade, som blir offentlig utan brott mot avtalet, eller som måste lämnas enligt lag.

5. Återlämning
På begäran återlämnas eller raderas materialet, så långt det är praktiskt möjligt.

6. Vite
Vite: [belopp] kr per brott, utan att det utesluter skadestånd.

7. Lag
Svensk lag. Tvist i svensk allmän domstol.

Ort och datum: [ort], [datum]

______________________          ______________________
Part 1                          Part 2`;
}

function konsult(a: Record<string, string>) {
  return `KONSULTAVTAL

1. Parter
${val(a, "parter", "[uppdragsgivare och konsult]")}

2. Uppdrag
${val(a, "uppdrag", "[uppdraget]")}

3. Arvode och betalning
${val(a, "arvode", "[arvode]")}

4. Ansvar
Konsulten utför uppdraget som självständig näringsidkare och svarar för egna skatter och avgifter.

5. Immateriella rättigheter, sekretess, uppsägning
${val(a, "ovrigt", "Resultatet av uppdraget tillfaller uppdragsgivaren när det är betalt. Sekretess gäller under uppdraget och 24 månader därefter. Uppsägningstid: [dagar] dagar.")}

6. Lag
Svensk lag.

Ort och datum: [ort], [datum]

______________________          ______________________
Uppdragsgivare                  Konsult`;
}

function uppsagning(a: Record<string, string>) {
  return `${val(a, "ort", "[ort]")} den [datum]

Uppsägning av anställning

Till: ${val(a, "arbetsgivare", "[arbetsgivare]")}

Härmed säger jag upp min anställning som ${val(a, "roll", "[roll]")}.

Sista anställningsdag enligt avtal/lag: ${val(a, "sista-dag", "[datum]")}.
${val(a, "anledning", "")}

Jag ber om skriftlig bekräftelse samt arbetsgivarintyg och slutlön enligt gängse regler.

Med vänlig hälsning
[Namn]
[personnummer utelämnat — fyll i på utskriften]
[telefon]
[e-post]`;
}

function arn(a: Record<string, string>) {
  return `ANMÄLAN TILL ALLMÄNNA REKLAMATIONSNÄMNDEN

1. Parter
Konsument: [ditt namn, adress, e-post, telefon]
Näringsidkare: ${val(a, "foretag", "[företag]")}

2. Avtalet
${val(a, "kop", "[vad du köpte, när, pris]")}

3. Vad som hänt
${val(a, "fel", "[felet och vad företaget svarat]")}

4. Yrkande
${val(a, "krav", "[vad du vill att ARN ska besluta]")}

5. Bilagor
Kvitto/orderbekräftelse, reklamationen, företagets svar, foton. Märk Bilaga 1 och framåt.

Ort och datum: [ort], [datum]

[Namn]`;
}

function anstallning(a: Record<string, string>) {
  return `ANSTÄLLNINGSAVTAL

1. Parter
Arbetsgivare: ${val(a, "arbetsgivare", "[bolag, org.nr]")}
Arbetstagare: ${val(a, "arbetstagare", "[namn]")}

2. Tjänst
${val(a, "roll", "[befattning, plats, tillträde]")}

3. Anställningsform och omfattning
${val(a, "form", "[tillsvidare/visstid, heltid/deltid]")}

4. Lön och förmåner
${val(a, "lon", "[månadslön, semester, övrigt]")}

5. Övrigt
${val(a, "ovrigt", "Kollektivavtal: [ja/nej, vilket]. Bisyssla kräver samtycke om den konkurrerar. Sekretess om affärsförhållanden under anställningen.")}

6. Uppsägning
Enligt lag och eventuellt kollektivavtal, om inte längre tid avtalats.

Ort och datum: [ort], [datum]

______________________          ______________________
Arbetsgivare                    Arbetstagare`;
}

function fullmakt(a: Record<string, string>) {
  return `FULLMAKT

Fullmaktsgivare: ${val(a, "givare", "[namn]")}
Fullmäktig: ${val(a, "mottagare", "[namn]")}

Fullmäktigen får ${val(a, "uppdrag", "[vad fullmakten gäller]")}.

Giltig: ${val(a, "tid", "[t.o.m. datum / tills vidare]")}

Fullmakten kan återkallas skriftligen. Den ska visas i original på begäran.

Ort och datum: [ort], [datum]

______________________
Fullmaktsgivare

Vittne: ________________        Vittne: ________________`;
}
