"use client";

import { Channel, Problemset as ProblemsetType } from "@prisma/client";
import { useState } from 'react'
import ProblemPagination from "./ProblemPagination";
import { QuestionAndAnswer as Problem } from "@prisma/client";
import getAttemptByChannelId from "@/actions/getAttemptByChannelId"
import {StatusBasedTag} from "./StatusBasedTag"
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { useSearchParams } from 'next/navigation'
import { useForm, FieldValues, SubmitHandler, useFieldArray } from "react-hook-form";



interface ProblemsetSectionProps {
  problemsets: (ProblemsetType & { channel: Channel })[];
  problems: (Problem[] | null)[]
  videoId: string
}

const ProblemsetSection: React.FC<ProblemsetSectionProps> = ({
  problemsets,
  problems,
  videoId,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const ps = searchParams.get('ps')
  const [problemsetNum, setProblemsetNum] = useState(1);
  const totalProblemset = problemsets.length;


  if (ps && 1 <= parseInt(ps) && parseInt(ps) <= totalProblemset) {
    setProblemsetNum(parseInt(ps));
  }

  let incrementProblemNum = () => setProblemsetNum(problemsetNum + 1);
  let decrementProblemNum = () => setProblemsetNum(problemsetNum - 1);
  if(problemsetNum <= 1) {
    decrementProblemNum = () => setProblemsetNum(1);
  }
  if (problemsetNum >= totalProblemset) {
    incrementProblemNum = () => setProblemsetNum(totalProblemset);
  }

  const currentChannel = useContext(CurrentChannelContext);


  const {
      control,
      register,
      handleSubmit,
      formState: { errors },
      watch,
      setValue,
    } = useForm<FieldValues>({
      defaultValues: {
        problemsetId: `${problemsets[problemsetNum-1].id}`,
        attempts: [{attempt: ""}],
      },
    });

    const { fields, append, remove } = useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "attempts", // unique name for your Field Array
    });


    
    

    const changeValue = (id: string, value: string) => {
      setValue(id, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    };
 

  const {data: attemptStatus, isLoading: LoadingStatus} = useQuery({
    queryKey: ['attemptStatus'],
    queryFn: () => getAttemptByChannelId({ problemsetId: problemsets[problemsetNum-1].id, channelId: currentChannel?.id}),
    staleTime: 1000 * 60,
  });


  if (!problems || problems[problemsetNum-1] === undefined) {return <div>Loading...</div>}
  else{

  return (
    <>
    <ProblemPagination
      end = {totalProblemset}
      current = {problemsetNum}
      increment = {incrementProblemNum}
      decrement = {decrementProblemNum}
    />

        {problems[problemsetNum-1]!.map((problem, index) => (
          <FormField
            key={index}
            control={control}
            name="perspective"
            render={({ field }) => (
            <FormItem>
                {/* <FormLabel>Question(s):</FormLabel> */}
                <FormDescription>
                  {problem.question}
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
        ))}

          
          <div className="flex flex-row gap-2">
            <Button type="submit">Submit</Button>
            <StatusBasedTag status={attemptStatus} />
            <FileQuestion className='cursor-pointer w-10 h-10 hover:bg-slate-200 rounded-lg' onClick={() => {router.push(`/upload-new-problemset/${videoId}`);}}/>

          </div>

    <div className="peer w-full mt-4 px-4 pt-2 pb-2  rounded-md outline-none border-[1px] bg-slate-100 transition">
      <div className="">
      If you are unsatisfied to those questions, you can click the button next to PASS/UNPASSED tag to upload a new problemset.
      </div>
    </div>
    </>
  )}
};

export default ProblemsetSection;
