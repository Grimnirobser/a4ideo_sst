import * as React from "react"

import { cn } from "@/lib/utils"
import { FieldErrors, FieldValues } from "react-hook-form";


export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    errors?: FieldErrors<FieldValues>;
    mark?: string;
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({mark, errors, className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            errors && mark && errors[mark]
              ? "border-red-500 focus:border-red-500"
              : "border-zinc-500"
          }`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
