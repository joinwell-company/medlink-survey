import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full border-b-2 border-[#ccc] bg-transparent px-3 py-2 text-sm transition-colors",
          "placeholder:text-[#999]",
          "focus:border-[#D3F898] focus:outline-none",
          "hover:border-[#B5E060]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
