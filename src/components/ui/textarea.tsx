'use client';
import * as React from "react"
import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
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
          "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-hidden",
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