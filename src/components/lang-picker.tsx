import { applyDocumentLang, LANGS, useI18n, type Lang } from "@/lib/i18n";

export function LangPicker() {
  const lang = useI18n((s) => s.lang);
  const setLang = useI18n((s) => s.setLang);

  function pick(next: Lang) {
    setLang(next);
    applyDocumentLang(next);
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-line bg-paper p-0.5" role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => pick(l.id)}
          className={
            l.id === lang
              ? "rounded-md bg-ink px-2 py-1 text-[11px] font-medium tracking-wide text-paper"
              : "rounded-md px-2 py-1 text-[11px] font-medium tracking-wide text-muted hover:text-ink"
          }
          aria-pressed={l.id === lang}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}
