import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { useState } from "react";
import { SiteFrame } from "@/components/site-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { askSupport } from "@/lib/ai";

export const Route = createFileRoute("/support")({
  component: SupportPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function SupportPage() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Jag är Rådgivaren. Säg vilket dokument du behöver – eller vad som fastnat – så pekar jag på rätt typ och pris.",
    },
  ]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setBusy(true);
    const res = await askSupport({ data: { messages: next } });
    setBusy(false);
    if (res.ok) setMessages([...next, { role: "assistant", content: res.text }]);
    else setMessages([...next, { role: "assistant", content: res.error }]);
  }

  return (
    <SiteFrame>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl tracking-tight">Support</h1>
        <p className="mt-3 text-muted">
          Rådgivaren svarar direkt. Inte juridisk rådgivning – hjälp att välja dokument och förstå
          hur Skrivklart fungerar.
        </p>
        <div className="mt-8 rounded-xl border border-line bg-paper p-5 shadow-[var(--shadow-soft)]">
          <div className="min-h-72 space-y-3">
            {messages.map((m, i) => (
              <p
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-lg bg-bg px-3 py-2 text-sm leading-relaxed"
                    : "mr-8 text-sm leading-relaxed text-muted"
                }
              >
                {m.content}
              </p>
            ))}
            {busy ? <p className="text-sm text-subtle">Skriver…</p> : null}
          </div>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="T.ex. Försäkringskassan sa nej"
              aria-label="Meddelande"
            />
            <Button type="submit" size="icon" disabled={busy} aria-label="Skicka">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </SiteFrame>
  );
}
