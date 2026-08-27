import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFrame } from "@/components/site-frame";

export const Route = createFileRoute("/om")({
  component: OmPage,
});

function OmPage() {
  return (
    <SiteFrame>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl tracking-tight">Om Skrivklart</h1>
        <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
          <p>
            De flesta fastnar inte för att de inte kan skriva. De fastnar för att texten ska vara
            formell, svensk och omöjlig att ångra – och blanketten sitter i kroppen.
          </p>
          <p>
            Skrivklart tar dina fakta och skriver utkastet. Du läser. Du ändrar. Du skickar. Vi är
            inte en juristbyrå, inte ett fackförbund, inte Skatteverket.
          </p>
          <p>
            Priset är lågt med flit. Ett personligt brev ska inte kosta en timmes konsult. Ett
            överklagande ska inte kräva att du sätter dig tre kvällar.
          </p>
          <p>
            <Link to="/dokument" className="text-pine hover:underline">
              Skriv ett dokument
            </Link>
            . Eller fråga{" "}
            <Link to="/support" className="text-pine hover:underline">
              Rådgivaren
            </Link>{" "}
            vad du egentligen behöver.
          </p>
        </div>
      </div>
    </SiteFrame>
  );
}
