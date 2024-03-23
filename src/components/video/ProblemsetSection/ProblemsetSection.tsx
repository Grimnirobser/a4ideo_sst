"use client";

import { Channel, Problemset, Problem } from "@prisma/client";
import { useState } from 'react'
import ProblemPagination from "./ProblemPagination";
import getAttemptStatusByChannelId from "@/actions/getAttemptStatusByChannelId";
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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton"
import { zodResolver } from "@hookform/resolvers/zod"
import { set, z } from "zod"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from 'lucide-react'
import { compliment, insult } from "@/lib/words";
import { submitAttempt } from "@/actions/submitAttempt";
import { SingleFeedback } from "@/components/shared/SingleFeedback";
import LikeSubscribeProblemsetSection from "../LikeSubscribeSection/LikeSubscribeProblemsetSection";
import getChannelById from "@/actions/getChannelById";

interface ProblemsetSectionProps {
  problemsets: (Problemset & { channel: Channel, problems: Problem[] })[];
  videoId: string,
}

interface readyDataType{
  channelId: string,
  problemsetId: string,
  problemsetAuthorId: string,
  problems: Problem[],
  attempts: {attempt: string}[]
}

const ProblemsetSection: React.FC<ProblemsetSectionProps> = ({
  problemsets,
  videoId,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const totalProblemset = problemsets.length;
  const searchParams = useSearchParams();
  const ps = searchParams.get('ps');
  const pathname = usePathname();

  const targetProblemset = ps ? parseInt(ps) : 1;
  const target = 1 <= targetProblemset && targetProblemset <= totalProblemset ? targetProblemset : 1;

  const incrementProblemNum = () => {
    if(target < totalProblemset){
      router.push(`${pathname}?ps=${target + 1}`);
    }
  }

  const decrementProblemNum = () => {
    if(target > 1){
      router.push(`${pathname}?ps=${target - 1}`);
    }
  }

  const currentChannel = useContext(CurrentChannelContext);


  const {data: problemsetCreatorChannel, isLoading: LoadingCreator} = useQuery({
    queryKey: ['problemsetCreatorChannel', problemsets[target-1].id],
    queryFn: async() => await getChannelById({ channelId: problemsets[target-1].channelId}),
  });

  const {data: attemptStatus, isLoading: LoadingStatus, refetch} = useQuery({
    queryKey: ['attemptStatus', currentChannel?.id, problemsets[target-1].id],
    queryFn: async() => await getAttemptStatusByChannelId({ problemsetId: problemsets[target-1].id, channelId: currentChannel?.id}),
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchInterval: 0,
  });
  

  const attemptSchema = z.object({
    attempt: z.string()
          .min(1, {
            message: "At least 1 character to answer the question.",
          })
          .max(250, {
            message: "Answer cannot exceed 250 characters.",
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


  const { data: attemptFeedback, mutate, mutateAsync, isPending } = useMutation({
    mutationKey: ["attemptProblemset", currentChannel?.id, problemsets[target-1].id],
    mutationFn: async(readyData: readyDataType) => await submitAttempt(readyData),

    onSuccess: () => {
      const min = 1;
      const max = 10;
      const rand = Math.floor(Math.random() * (max - min + 1) ) + min;
      refetch().then((response) => {
          if (response.data === true){
            // toast.success(compliment[rand]);
            toast({
              variant: "success",
              title: "Right",
              description: compliment[rand],
            });
          }else if (response.data === false){
            // toast.error(insult[rand]);
            toast({
              variant: "error",
              title: "Wrong",
              description: insult[rand], 
             })
          }
          else{
            toast({
              variant: "error",
              title: "Error",
              description: "Something went wrong, please try again.", 
             })
          }
      });
      router.refresh();
    },

    onError: () => toast({
      variant: "error",
      title: "Error",
      description: "Something went wrong, please try again.", 
     })
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!currentChannel) {
      alert("Please sign in to submit your perspective.");
      return;
    }

    const readyData = {
      channelId: currentChannel.id,
      problemsetId: problemsets[target-1].id,
      problemsetAuthorId: problemsets[target-1].channelId,
      problems: problemsets[target-1].problems,
      attempts: data.attempts,
    }
    mutateAsync(readyData);
  };



  if ( problemsets[target-1].problems === undefined || problemsetCreatorChannel === null ||
        problemsetCreatorChannel === undefined|| LoadingStatus || LoadingCreator) {
    return (
        <>
        <ProblemPagination
        end = {totalProblemset}
        current = {target}
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
      current = {target}
      increment = {incrementProblemNum}
      decrement = {decrementProblemNum}
    />

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {problemsets[target-1].problems.map((problem, index) => (
          
          <div key={index} className="space-y-2">
            <FormField
              key={"FormField"+problem.id+index}
              control={form.control}
              name={`attempts.${index}.attempt`}
              render={({ field }) => (
              <FormItem>
                  <FormDescription className="text-lg">
                    {problem.question}
                  </FormDescription>
                  <FormControl>
                    <Textarea
                      key={"Textarea"+problem.id+index}
                      placeholder="Your perspective"
                      className="resize-none h-52 text-lg"
                      {...field}
                    />
                  </FormControl>
                
                  <FormMessage />
              </FormItem>
            )}
          />

          {attemptFeedback ? <SingleFeedback key={"SingleFeedback"+problem.id+index} 
                          problemsetNum={target} 
                          index={index}
                          {...attemptFeedback[index]}/> : null
          }
        </div>
        ))}

          <LikeSubscribeProblemsetSection channel={problemsetCreatorChannel} problemset={problemsets[target-1]}/>
          <div className="flex flex-row gap-2">
            <Button type="submit" disabled={isPending}>
            {isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}Submit</Button>
            <StatusBasedTag status={attemptStatus}/>
            <FileQuestion className='cursor-pointer w-10 h-10 hover:bg-slate-200 rounded-lg' onClick={() => {router.push(`/upload-new-problemset/${videoId}`);}}/>

          </div>

    <div className="peer w-full mt-4 mb-4 px-4 pt-2 pb-2  rounded-md outline-none border-[1px] bg-slate-100 transition">
        Note if all sentences are not red but the result is &quot;fail&quot;, it means the answer is missing an emphasis.
        You can try click the question mark next to PASS/UNPASSED badge to upload your own questions.
    </div>


      </form> 
    </Form>
    </>
  )}
};

export default ProblemsetSection;