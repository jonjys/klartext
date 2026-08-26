import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";
import { askSupport } from "@/lib/ai";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Msg = { role: "user" | "assistant"; content: string };

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Vad behöver du skriva? Personligt brev, överklagande, avtal – säg vad som fastnat så pekar jag rätt.",
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
    <div className="fixed right-4 bottom-4 z-50" data-print-hide>
      {open ? (
        <div className="mb-3 flex h-[min(420px,70dvh)] w-[min(360px,calc(100vw-2rem))] flex-col rounded-xl border border-line bg-paper shadow-[var(--shadow-soft)]">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-medium">Rådgivaren</p>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-md text-muted hover:text-ink"
              aria-label="Stäng"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <p
                key={i}
                className={
                  m.role === "user"
                    ? "ml-8 rounded-lg bg-bg px-3 py-2 text-sm leading-relaxed"
                    : "mr-6 text-sm leading-relaxed text-muted"
                }
              >
                {m.content}
              </p>
            ))}
            {busy ? <p className="text-sm text-subtle">Skriver…</p> : null}
          </div>
          <form
            className="flex gap-2 border-t border-line p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Vad behöver du?"
              aria-label="Meddelande"
            />
            <Button type="submit" size="icon" disabled={busy} aria-label="Skicka">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      ) : null}
      <Button
        type="button"
        className="ml-auto flex shadow-[var(--shadow-soft)]"
        onClick={() => setOpen((v) => !v)}
      >
        <MessageCircle className="size-4" />
        Fråga
      </Button>
    </div>
  );
}
