import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sek(kr: number) {
  return `${new Intl.NumberFormat("sv-SE").format(kr)}\u00a0kr`;
}

export function uid() {
  return crypto.randomUUID();
}

export function isLocalHost() {
  if (typeof window === "undefined") return true;
  const h = window.location.hostname;
  return h === "127.0.0.1" || h === "localhost" || h === "0.0.0.0";
}
