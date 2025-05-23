import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "active";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "active", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-start gap-[20px] rounded-md pl-5 pr-4 py-2 text-sm transition-colors group hover:text-black dark:text-white",
          variant === "active" &&
          "bg-[var(--color-secondary)] hover:bg-[var(--color-secondary)] text-black font-semibold",
          
          variant === "default" &&
          "bg-transparent text-gray-600 font-normal",
            
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
