"use client";

import { Channel, Problemset, Problem } from "@prisma/client";
import { useState } from 'react'
import ProblemPagination from "./ProblemPagination";
import getAttemptByChannelId from "@/actions/getAttemptByChannelId"
import {StatusBasedTag} from "./StatusBasedTag"
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query"
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
import { FileQuestion } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useForm, FieldValues, SubmitHandler, useFieldArray } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton"
import getProblemsByProblemsetId  from "@/actions/getProblemsByProblemsetId"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-hot-toast";
import { Loader2 } from 'lucide-react'
import { compliment, insult } from "@/lib/words";

interface ProblemsetSectionProps {
  problemsets: (Problemset & { channel: Channel, problems: Problem[] })[];
  videoId: string,
}

interface readyDataType{
  channelId: string,
  problemsetId: string,
  attempts: {attempt: string}[]
}

const ProblemsetSection: React.FC<ProblemsetSectionProps> = ({
  problemsets,
  videoId,
}) => {
  const router = useRouter();

  const [problemsetNum, setProblemsetNum] = useState(1);
  const totalProblemset = problemsets.length;

  let incrementProblemNum = () => setProblemsetNum(problemsetNum + 1);
  let decrementProblemNum = () => setProblemsetNum(problemsetNum - 1);
  if(problemsetNum <= 1) {
    decrementProblemNum = () => setProblemsetNum(1);
  }
  if (problemsetNum >= totalProblemset) {
    incrementProblemNum = () => setProblemsetNum(totalProblemset);
  }

  const currentChannel = useContext(CurrentChannelContext);

  const {data: attemptStatus, isLoading: LoadingStatus, refetch} = useQuery({
    queryKey: ['attemptStatus'],
    queryFn: async() => await getAttemptByChannelId({ problemsetId: problemsets[problemsetNum-1].id, channelId: currentChannel?.id}),
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchInterval: 0,
  });
  

  const attemptSchema = z.object({
    attempt: z.string()
          .min(1, {
            message: "At least 1 character to answer the question.",
          })
          .max(200, {
            message: "Answer cannot exceed 200 characters.",
          }),
  })

  const attemptsetSchema = z.object({
    attempts: z.array(attemptSchema)
  })
  

  const form = useForm<z.infer<typeof attemptsetSchema>>({
    resolver: zodResolver(attemptsetSchema),
    defaultValues: {
      attempts: [{attempt: ""}],
    },
  })


  const { mutate, mutateAsync, isPending } = useMutation({
    mutationKey: ["attemptProblemset"],
    mutationFn: async(readyData: readyDataType) => await fetch(process.env.NEXT_PUBLIC_SERVER_URL + `/api/attempts/${problemsets[problemsetNum-1].id}`, {
      method: "POST",
      body: JSON.stringify(readyData),
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
    
    }),

    onSuccess: () => {
      const min = 1;
      const max = 10;
      const rand = Math.floor(Math.random() * (max - min + 1) ) + min;
      refetch().then((response) => {
          if (response.data === true){
            toast.success(compliment[rand]);
          }else if (response.data === false){
            toast.error(insult[rand]);
          }
          else{
            toast.error("Something went wrong. Please try again.");
          }
      });
      router.refresh();
    },

    onError: () => toast.error("Could not submit you answer.")
  })


  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!currentChannel) {
      alert("Please sign in to comment");
      return;
    }
    if (attemptStatus === true){
      alert("Note that your PASSED status will be overwritten by this submission.");
    }

    const readyData = {
      channelId: currentChannel.id,
      problemsetId: problemsets[problemsetNum-1].id,
      attempts: data.attempts,
    }
    mutateAsync(readyData);
  };



  if ( problemsets[problemsetNum-1].problems === undefined || LoadingStatus) {
    return (
        <>
        <ProblemPagination
        end = {totalProblemset}
        current = {problemsetNum}
        increment = {incrementProblemNum}
        decrement = {decrementProblemNum}
        />
        <div className="flex flex-col space-y-3 mt-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-[225px] w-full rounded-xl" />
        </div>
        </>
    )}
  else{

  return (
    <>
    <ProblemPagination
      end = {totalProblemset}
      current = {problemsetNum}
      increment = {incrementProblemNum}
      decrement = {decrementProblemNum}
    />

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {problemsets[problemsetNum-1].problems.map((problem, index) => (
          <FormField
            key={index}
            control={form.control}
            name={`attempts.${index}.attempt`}
            render={({ field }) => (
            <FormItem>
                {/* <FormLabel>Question(s):</FormLabel> */}
                <FormDescription className="text-lg">
                  {problem.question}
                </FormDescription>
                <FormControl>
                  <Textarea
                    placeholder="Your perspective"
                    className="resize-none h-52 text-lg"
                    {...field}
                  />
                </FormControl>
              
                <FormMessage />
            </FormItem>
          )}
        />
        ))}

          
          <div className="flex flex-row gap-2">
            <Button type="submit" disabled={isPending}>
              {isPending && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}Submit</Button>
            <StatusBasedTag status={attemptStatus}/>
            <FileQuestion className='cursor-pointer w-10 h-10 hover:bg-slate-200 rounded-lg' onClick={() => {router.push(`/upload-new-problemset/${videoId}`);}}/>

          </div>

    <div className="peer w-full mt-4 px-4 pt-2 pb-2  rounded-md outline-none border-[1px] bg-slate-100 transition">
      <div className="">
      If you are unsatisfied to those questions, you can click the button next to PASS/UNPASSED tag to upload a new problemset.
      </div>
    </div>


      </form> 
    </Form>
    </>
  )}
};

export default ProblemsetSection;