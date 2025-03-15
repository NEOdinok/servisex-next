"use client";

import * as React from "react";
import { FieldError } from "react-hook-form";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  isError?: FieldError | undefined;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, isError, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        `
          flex h-12 w-full px-3 py-2
          outline-none focus-visible:outline-none border bg-background
          ring-inset focus-visible:ring-2
          file:border-0 file:bg-transparent file:text-base file:font-medium
          placeholder:text-muted-foreground text-base
          transition-shadow duration-150 ease-in-out
          transition-border
          disabled:cursor-not-allowed disabled:opacity-50
          `,
        isError
          ? "border-error focus-visible:ring-error focus-visible:border-error"
          : "border-input focus-visible:ring-primary  focus-visible:border-primary",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
