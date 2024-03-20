"use client";

import Button from "@/components/shared/Button";
import UploadVideoModal from "@/components/shared/Modal/UploadVideoModal";
import VideoPreview from "@/components/studio/upload/VideoPreview";
import VideoUploadForm from "@/components/studio/upload/VideoUploadForm";
import { UploadVideoModalContext } from "@/context/UploadVideoModalContext";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import ProblemsetUploadForm from "@/components/studio/upload/ProblemsetUploadForm";
import { useForm, FieldValues, SubmitHandler, useFieldArray } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast"
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useMutation } from "@tanstack/react-query"
import { createVideo } from "@/actions/createVideo";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";


interface VideoDataType{
  channelId: string,
  title: string,
  description: string,
  youtubeId: string,
  thumbnailSrc: string,
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

export default function UploadPage() {
  useProtectedRoute();

  // const uploadVideoModal = useContext(UploadVideoModalContext);
  // useEffect(() => uploadVideoModal?.onOpen(), []);

  const currentChannel = useContext(CurrentChannelContext);
  const router = useRouter();
  const { toast } = useToast();

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
      thumbnailSrc: "",
      youtubeId: "",
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
    mutationKey: ["uploadVideo"],
    mutationFn: async(videoData: VideoDataType) => await createVideo(videoData),

    onSuccess: () => {
      toast({
        variant: "success",
        title: "Success",
        description: "Video successfully published.",
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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!currentChannel) {
      alert("Please sign in to upload video.");
      return;
    }

    const videoData = {
        channelId: currentChannel.id,
        title: data.title,
        description: data.description,
        youtubeId: data.youtubeId,
        thumbnailSrc: data.thumbnailSrc,
        problems: data.problems,
      };

    // console.log(videoData);
    mutateAsync(videoData);
  }


  return (
    <>
      {/* {uploadVideoModal?.isOpen && (
        <UploadVideoModal
          onUpload={(value) => changeValue("videoSrc", value)}
        />
      )} */}
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

          <VideoUploadForm
            register={register}
            errors={errors}
            changeValue={changeValue}
            thumbnailSrc={thumbnailSrc}
            isLoading={isPending}
          />
          
          <div className="w-2/6 space-y-2">

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
            <Button className="absolute inset-y-0 left-0 h-full" type="box" onClick={() => {append({question: "", type:"reason", answer: []});incrementTotalProblems()}}>
                Add Question
            </Button>   
          </div>
          </div>
        </div>

      </div>
    </>
  );
}
