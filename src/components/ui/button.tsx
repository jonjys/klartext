import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary: "bg-pine text-pine-fg hover:opacity-90",
        solid: "bg-ink text-paper hover:opacity-90",
        outline: "border border-line bg-paper text-ink hover:bg-bg-elevated",
        ghost: "text-ink hover:bg-bg-elevated",
        danger: "bg-danger text-paper hover:opacity-90",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-11 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-5 text-base",
        icon: "size-11 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
