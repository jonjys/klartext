import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-paper shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
