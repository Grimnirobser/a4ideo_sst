"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Textarea } from "@/components/ui/textarea"
import LikeDislikeQuestionButton from "./LikeDislikeQuestionButton"

 
const FormSchema = z.object({
    perspective: z
    .string()
    .min(10, {
      message: "Perspective must be at least 10 characters.",
    })
    .max(160, {
      message: "Perspective must not be longer than 160 characters.",
    }),
})
 
const RightSideInput = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    
  }
 
    return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="perspective"
          render={({ field }) => (
            <FormItem>
                <FormLabel>Question(s):</FormLabel>
                  
                <FormDescription>
                Who is the murder and what is the motivation?
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Your perspective"
                  className="resize-none h-52"
                  {...field}
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
          <Button type="submit">Submit</Button>
      </form>
      </Form>
  )
}

export default RightSideInput