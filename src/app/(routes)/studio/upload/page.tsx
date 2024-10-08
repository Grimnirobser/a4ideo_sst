"use client";

import Button from "@/components/shared/Button";
import UploadVideoModal from "@/components/shared/Modal/UploadVideoModal";
import VideoPreview from "@/components/studio/upload/VideoPreview";
import VideoUploadForm from "@/components/studio/upload/VideoUploadForm";
import { UploadVideoModalContext } from "@/context/UploadVideoModalContext";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import ProblemsetUploadForm from "@/components/studio/upload/ProblemsetUploadForm";
import { useForm, FieldValues, SubmitHandler, useFieldArray, set } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query"
import { createVideo } from "@/actions/createVideo";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} from 'obscenity';
import { SignInOptionContext } from "@/context/SignInOptionContext";


interface VideoDataType{
  channelId: string,
  title: string,
  description: string,
  youtubeId: string,
  imageSrc: string,
  problems: ProblemDataType[]
  isVideo: boolean,
}

interface ProblemDataType{
  question: string,
  type: string,
  atTime: number,
  answer: AnswerType[],
}

interface AnswerType{
  sentence: string,    
  emphasis: boolean    
}

export default function UploadPage() {

  // const uploadVideoModal = useContext(UploadVideoModalContext);
  // useEffect(() => uploadVideoModal?.onOpen(), []);

  const currentChannel = useContext(CurrentChannelContext);
  const SignInOption = useContext(SignInOptionContext);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentChannel) {
      router.push("/");
      SignInOption?.onOpen();
    }else{
      setChecked(true);
    }
  }, [ currentChannel, router, SignInOption]); 


  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      title: "",
      description: "",
      imageSrc: "",
      youtubeId: "",
      problems: [{question: "", type:"reason", atTime: 0, answer: []}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "problems", // unique name for your Field Array
  });
  
  const imageSrc: string = watch("imageSrc");

  const changeValue = (id: string, value: string | number) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };


  const [totalProblems, setTotalProblems] = useState(1);

  let incrementTotalProblems = () => setTotalProblems(totalProblems + 1);
  let decrementTotalProblems = () => (totalProblems === 1) ? {} : setTotalProblems(totalProblems - 1);

  const [isVideo, setIsVideo] = useState(true);

  
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationKey: ["uploadVideo"],
    mutationFn: async(videoData: VideoDataType) => await createVideo(videoData),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Video successfully submitted for review.",
      });
      router.push("/studio");
      router.refresh();

    },

    onError: () =>  toast({
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
    if (!currentChannel) {
      SignInOption?.onOpen();
      return;
    }

    const problemsCheck = data.problems.map((problem: ProblemDataType) => matcher.hasMatch(problem.question));

    if (matcher.hasMatch(data.title) || matcher.hasMatch(data.description) || problemsCheck.includes(true)){
      toast({
        variant: "error",
        title: "Error",
        description: "Please remove inappropriate words.",
      });
      return;
    }

    const videoData = {
        channelId: currentChannel.id,
        title: data.title,
        description: data.description,
        youtubeId: data.youtubeId,
        imageSrc: data.imageSrc,
        problems: data.problems,
        isVideo: isVideo,
      };

    // console.log(videoData);
    mutateAsync(videoData);
  }

  if (!checked) return null;

  return (
    <>
      {/* {uploadVideoModal?.isOpen && (
        <UploadVideoModal
          onUpload={(value) => changeValue("videoSrc", value)}
        />
      )} */}
      <div className="flex flex-col px-6 pt-4">

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


        <div className="flex flex-col lg:flex-row mt-1 gap-4 max-h-full">

          <div className="w-full lg:w-4/6 flex flex-col">
            <VideoUploadForm
              register={register}
              errors={errors}
              changeValue={changeValue}
              imageSrc={imageSrc}
              isLoading={isPending}
              isVideo={isVideo}
              setIsVideo={setIsVideo}
            />
          </div>
          
          <div className="w-full lg:w-2/6 max-h-screen overflow-y-auto no-scrollbar">
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
            <Button className="absolute inset-y-0 left-0 h-full" type="box" onClick={() => {append({question: "", type:"reason", atTime: 0, answer: []});incrementTotalProblems()}}>
                Add Question
            </Button>   
          </div>
          </div>
        </div>

      </div>
    </>
  );
}
