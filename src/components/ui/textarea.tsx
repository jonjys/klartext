import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-base text-ink placeholder:text-subtle",
        "transition-[border-color,box-shadow] duration-150 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
