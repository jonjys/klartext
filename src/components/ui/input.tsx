import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-line bg-paper px-3 text-base text-ink placeholder:text-subtle",
        "transition-[border-color,box-shadow] duration-150 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
