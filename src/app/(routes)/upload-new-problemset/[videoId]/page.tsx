"use client";

import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast"
import { useForm, FieldValues, SubmitHandler, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query"
import Button from "@/components/shared/Button";
import ProblemsetUploadForm from "@/components/studio/upload/ProblemsetUploadForm";
import { createProblemset } from "@/actions/createProblemset";


interface ChannelPageParams {
  videoId?: string;
}

interface ProblemsetDataType{
  videoId: string | undefined,
  channelId: string,
  problems: ProblemDataType[]
}
interface ProblemDataType{
  question: string,
  type: string,
  answer: AnswerType[],
}

interface AnswerType{
  sentence: string,    
  emphasis: boolean    
}


export default function UploadProblemset({params}: {params: ChannelPageParams}) {

    const { videoId } = params;
    const router = useRouter();
    const currentChannel = useContext(CurrentChannelContext);
    const { toast } = useToast();

    useEffect(() => {
      if (!currentChannel) {
        router.push("/");
        toast({
          variant: "error",
          title: "Error",
          description: "You need to sign in to upload.",
        });
      }
    }, [ currentChannel, router, toast]); 

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
      } = useForm<FieldValues>({
        defaultValues: {
          problems: [{question: "", type:"reason", answer: []}],
        },
      });

      const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "problems", // unique name for your Field Array
      });
      
      const thumbnailSrc: string = watch("thumbnailSrc");
    
      const changeValue = (id: string, value: string) => {
        setValue(id, value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      };
    
    
      const [totalProblems, setTotalProblems] = useState(1);
    
      let incrementTotalProblems = () => setTotalProblems(totalProblems + 1);
      let decrementTotalProblems = () => (totalProblems === 1) ? {} : setTotalProblems(totalProblems - 1);
    
      
      const { mutate, mutateAsync, isPending } = useMutation({
        mutationKey: ["UploadNewProblemset"],
        mutationFn: async(problemsetData: ProblemsetDataType) => await createProblemset(problemsetData),
    
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Success",
            description: "Problemset successfully published.",
          });
          router.push(process.env.NEXT_PUBLIC_SERVER_URL +`/video/${videoId}`);
          router.refresh();
        },
    
        onError: () => toast({
          variant: "error",
          title: "Error",
          description: "Something went wrong, please try again.",
        })
      })
    
      const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        const problemsetData = {
            videoId: videoId,
            channelId: currentChannel!.id,
            problems: data.problems,
          };

        mutateAsync(problemsetData);
      }
    
      return (
        <>
          <div className="flex flex-col px-6 pt-4 ">
    
            <div className="flex justify-between">
              <h1 className="text-2xl">Video details</h1>
              <span className="flex gap-4">
                <Button type="secondary" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="box" onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              </span>
            </div>
    
    
            <div className="flex flex-row mt-4 gap-4">
    
              
              <div className="w-full space-y-2">
    
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <ProblemsetUploadForm
                        index={index}
                        totalProblems={totalProblems}
                        control={control}
                        register={register}
                        errors={errors}
                        changeValue={changeValue}
                        isLoading={isPending}
                        removeFunction={remove}
                        decrement={decrementTotalProblems}
                      />
    
                    </div>
                    ))}
    
                <div className="relative w-26 h-10 mb-2 mt-2">
                <Button className="absolute inset-y-0 left-0 h-full" type="box" onClick={() => {append({question: "", type:"reason" ,answer: []});incrementTotalProblems()}}>
                    Add Question
                </Button>   
              </div>


              </div>
            </div>
    
          </div>
        </>
      );
    }
    