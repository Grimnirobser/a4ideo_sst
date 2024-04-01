'use client'

import { useForm, FieldValues, SubmitHandler, useFieldArray, set } from "react-hook-form";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import Button from "@/components/shared/Button";
import { useToast } from "@/components/ui/use-toast"
import getProblemsByProblemsetId from '@/actions/getProblemsByProblemsetId'
import getVideoById from '@/actions/getVideoById'
import { DocView } from "@/components/video/DocView";
import YoutubePlayer from "@/components/video/YoutubePlayer";
import { notFound } from 'next/navigation'
import ProblemUpdateForm from '@/components/studio/edit-problemset/ProblemsetUpdateForm'
import {
	RegExpMatcher,
	englishDataset,
	englishRecommendedTransformers,
} from 'obscenity';
import updateProblemset from '@/actions/updateProblemset'
import Description from "@/components/video/Description";
import { Skeleton } from "@/components/ui/skeleton"



interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

interface problemProps {
  question: string,
  type: string,
  atTime: number,
  answer: AnswerType[],
}

interface UpdateProblemsetParams{
    problemsetId: string,
    deleteProblemIds: string[],
    updateProblemIds: string[],
    problems: problemProps[],
}

interface AnswerType{
  sentence: string,    
  emphasis: boolean    
}

export default function EditProblemsetPage({ searchParams }: PageProps) {
  const encodedProblemsetId = searchParams.p as string;
  const decodedProblemsetId = decodeURIComponent(encodedProblemsetId as string)
  const encodedVideoId = searchParams.v as string;
  const decodedVideoId = decodeURIComponent(encodedVideoId as string)

  const currentChannel = useContext(CurrentChannelContext);
  const router = useRouter()
  const [checked, setChecked] = useState(false);

  const {data: problemsWithChannelId, isLoading: loadingProblemsWithChannelId} = useQuery({
      queryKey: ['queryProblems', decodedProblemsetId],
      queryFn: async() => await getProblemsByProblemsetId(decodedProblemsetId),
  }); 

  const {data: video, isLoading: loadingVideo} = useQuery({
    queryKey: ['problemsetVideo', decodedVideoId],
    queryFn: async() => await getVideoById({ videoId: decodedVideoId}),
  });

  const { toast } = useToast()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      problems: [{question: "", type:"reason", atTime: 0, answer: []}],
    },
  });

  const prevProblemsRef = useRef<problemProps[]>([])
  const [totalProblems, setTotalProblems] = useState(0);

  useEffect(() => {
    if (!loadingProblemsWithChannelId && !loadingVideo){
      if (!problemsWithChannelId || !video || !currentChannel || problemsWithChannelId.channelId !== currentChannel.id) {
        router.push("/");
        toast({
          variant: "error",
          title: "Unauthorized request.",
        });
      }else{
            const prevProblems: problemProps[] | undefined = problemsWithChannelId?.problems.map((problem) => {
              const prevAnswers: AnswerType[] = problem.answer.map((sentence, index) => ({
                  sentence: sentence,
                  emphasis: problem.emphasis[index],
                }));
                // prevProblemsRef.current.push({
                //   question: problem.question,
                //   type: problem.type,
                //   atTime: problem.atTime,
                //   answer: prevAnswers,
                // });
                return {
                  question: problem.question,
                  type: problem.type,
                  atTime: problem.atTime,
                  answer: prevAnswers,
                }
            });
            prevProblemsRef.current = prevProblems;
            setTotalProblems(prevProblems.length);
            reset({problems: prevProblems});
            setChecked(true);
      }
    }
  }, [currentChannel, router, toast, problemsWithChannelId, loadingProblemsWithChannelId, video, loadingVideo, decodedProblemsetId, decodedVideoId, reset]); 

  const [problemTime, setProblemTime] = useState<number>(-1);

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "problems", // unique name for your Field Array
  });
      
  const changeValue = (id: string, value: string | number) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  let incrementTotalProblems = () => setTotalProblems(totalProblems + 1);
  let decrementTotalProblems = () => (totalProblems === 1) ? {} : setTotalProblems(totalProblems - 1);
  
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationKey: ["UpdateProblemset", decodedProblemsetId, decodedVideoId, currentChannel?.id],
    mutationFn: async(problemsetData: UpdateProblemsetParams) => await updateProblemset(problemsetData),

    onSuccess: () => {
        toast({
          variant: "success",
          title: "Success",
          description: "Problemset successfully published.",
        });
        router.push('/studio');
    },

    onError: () => toast({
      variant: "error",
      title: "Error",
      description: "Something went wrong, please try again.",
    })
  })

  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const problemsCheck = data.problems.map((problem: problemProps) => matcher.hasMatch(problem.question));

    if (problemsCheck.includes(true)){
      toast({
        variant: "error",
        title: "Error",
        description: "Please remove inappropriate words.",
      });
      return;
    }

    if (!problemsWithChannelId){
      router.push("/");
      toast({
        variant: "error",
        title: "Error",
        description: "Something went wrong, please try again.",
      });
      return;
    }else{
      const PrevProblemIdList = problemsWithChannelId.problems.map((problem) => problem.id);
      const updateProblemIds = PrevProblemIdList.splice(0, totalProblems);

      const problemsetData: UpdateProblemsetParams = {
        problems: data.problems,
        problemsetId: decodedProblemsetId,
        deleteProblemIds: PrevProblemIdList,
        updateProblemIds: updateProblemIds,
      };

    // console.log("problemsetData", problemsetData);
    mutateAsync(problemsetData);
    }
  }

  if (!checked || loadingProblemsWithChannelId || loadingVideo){
    return (
    <div className="flex flex-col lg:flex-row mx-6 mt-2 gap-4">
    <div className="w-full lg:w-4/6 flex flex-col gap-4 overflow-y-auto max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <Skeleton />
        <Skeleton className="text-2xl font-medium break-words hyphens-auto"/>
        <Skeleton />

    </div>

    <div className="w-full lg:w-2/6 max-h-screen overflow-y-auto no-scrollbar">
    
          <div className="flex flex-col pt-4 ">
    
            <div className="flex justify-between">
              <Skeleton />
              <span className="flex gap-4">
              <Skeleton />
              <Skeleton />
              </span>
            </div>
    
    
            <div className="flex flex-row mt-4 gap-4">
              <div className="w-full space-y-2">
      
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-full"/>
                <Skeleton className="h-4 w-full"/>
    
                <div className="relative w-26 h-10 mb-2 mt-2">
                <Skeleton />
              </div>
              </div>
            </div>
    
          </div>

    </div>
</div>)
  }

  if(!problemsWithChannelId || !video){
    return notFound();
  }

    return (
        <div className="flex flex-col lg:flex-row mx-6 mt-2 gap-4">
            <div className="w-full lg:w-4/6 flex flex-col gap-4 overflow-y-auto max-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {/* <VideoPlayer videoSrc={video.videoSrc} /> */}
                {video.youtubeId === "" ? <DocView imageSrc={video.imageSrc}/> : <YoutubePlayer youtubeId={video.youtubeId} problemTime={problemTime} setProblemTime={setProblemTime}/>}
                <h1 className="text-2xl font-medium break-words hyphens-auto">{video.title}</h1>
                <Description video={video} />

            </div>

            <div className="w-full lg:w-2/6 max-h-screen overflow-y-auto no-scrollbar">
            
                  <div className="flex flex-col pt-4 ">
            
                    <div className="flex justify-between">
                      <h1 className="text-2xl">Edit Problemset</h1>
                      <span className="flex gap-4">
                        <Button type="secondary" onClick={() => router.push('/studio')}>
                          Cancel
                        </Button>
                        <Button type="box" onClick={handleSubmit(onSubmit)}>
                          Save changes
                        </Button>
                      </span>
                    </div>
            
            
                    <div className="flex flex-row mt-4 gap-4">
                      <div className="w-full space-y-2">
            
                          {fields.map((field, index) => (
                            <div key={field.id}>
                              <ProblemUpdateForm
                                index={index}
                                prevProblem={prevProblemsRef.current[index]}
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
                        <Button className="absolute inset-y-0 left-0 h-full" type="box" onClick={() => {append({question: "", type:"reason", atTime: 0, answer: []});incrementTotalProblems()}}>
                            Add Question
                        </Button>   
                      </div>
                      </div>
                    </div>
            
                  </div>
        
            </div>
        </div>
  )
}