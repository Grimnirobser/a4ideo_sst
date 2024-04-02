'use client';
import * as React from "react"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";


export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  errors?: FieldErrors<FieldValues>;
  mark?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({mark, errors, className, ...props }, ref) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null)

    React.useImperativeHandle(ref, () => textAreaRef.current!);


    useEffect(() => {
      const ref = textAreaRef?.current

      const updateTextareaHeight = () => {
        if (ref) {
          ref.style.height = "auto"
          ref.style.height = ref?.scrollHeight + "px"
        }
      }

      updateTextareaHeight()
      ref?.addEventListener("input", updateTextareaHeight)

      return () => ref?.removeEventListener("input", updateTextareaHeight)
    }, [])

    return (
      <textarea
        className={cn(
          `flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-hidden ${
            errors && mark && errors[mark]
              ? "border-red-500 focus:border-red-500"
              : "border-zinc-500"
          }`,
          className
        )}
        ref={textAreaRef}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
Textarea.displayName = "Textarea"