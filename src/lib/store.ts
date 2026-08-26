import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JOB_PACK_UNLOCKS } from "./stripe-map";

export type Draft = {
  slug: string;
  answers: Record<string, string>;
  preview: string;
  full: string;
  unlocked: boolean;
};

type State = {
  drafts: Record<string, Draft>;
  proUntil: number | null;
  packUntil: number | null;
  setAnswers: (slug: string, answers: Record<string, string>) => void;
  setPreview: (slug: string, preview: string) => void;
  setFull: (slug: string, full: string) => void;
  unlock: (slug: string) => void;
  unlockPro: () => void;
  unlockJobPack: () => void;
  isUnlocked: (slug: string) => boolean;
  hasPro: () => boolean;
};

const empty = (slug: string): Draft => ({
  slug,
  answers: {},
  preview: "",
  full: "",
  unlocked: false,
});

export const useKlartext = create<State>()(
  persist(
    (set, get) => ({
      drafts: {},
      proUntil: null,
      packUntil: null,
      setAnswers: (slug, answers) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [slug]: { ...(s.drafts[slug] ?? empty(slug)), answers },
          },
        })),
      setPreview: (slug, preview) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [slug]: { ...(s.drafts[slug] ?? empty(slug)), preview },
          },
        })),
      setFull: (slug, full) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [slug]: { ...(s.drafts[slug] ?? empty(slug)), full },
          },
        })),
      unlock: (slug) =>
        set((s) => ({
          drafts: {
            ...s.drafts,
            [slug]: { ...(s.drafts[slug] ?? empty(slug)), unlocked: true },
          },
        })),
      unlockPro: () => set({ proUntil: Date.now() + 30 * 24 * 60 * 60 * 1000 }),
      unlockJobPack: () => {
        const drafts = { ...get().drafts };
        for (const slug of JOB_PACK_UNLOCKS) {
          drafts[slug] = { ...(drafts[slug] ?? empty(slug)), unlocked: true };
        }
        set({ drafts, packUntil: Date.now() + 30 * 24 * 60 * 60 * 1000 });
      },
      isUnlocked: (slug) => {
        const s = get();
        if (s.proUntil && s.proUntil > Date.now()) return true;
        if (
          s.packUntil &&
          s.packUntil > Date.now() &&
          (JOB_PACK_UNLOCKS as readonly string[]).includes(slug)
        ) {
          return true;
        }
        return Boolean(s.drafts[slug]?.unlocked);
      },
      hasPro: () => {
        const until = get().proUntil;
        return Boolean(until && until > Date.now());
      },
    }),
    { name: "klartext-v1" },
  ),
);
