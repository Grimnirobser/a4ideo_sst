"use client";

import Button from "@/components/shared/Button";
import UploadVideoModal from "@/components/shared/Modal/UploadVideoModal";
import VideoPreview from "@/components/studio/upload/VideoPreview";
import VideoUploadForm from "@/components/studio/upload/VideoUploadForm";
import { UploadVideoModalContext } from "@/context/UploadVideoModalContext";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import ProblemsetUploadForm from "@/components/studio/upload/ProblemsetUploadForm";
import { useForm, FieldValues, SubmitHandler, useFieldArray } from "react-hook-form";

import { toast } from "react-hot-toast";
import TextArea from "@/components/shared/TextArea";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useMutation } from "@tanstack/react-query"
import { on } from "events";


export default function UploadPage() {
  useProtectedRoute();

  // const uploadVideoModal = useContext(UploadVideoModalContext);
  // useEffect(() => uploadVideoModal?.onOpen(), []);

  const router = useRouter();

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
      problems: [{question: "", type:"step" ,answer: ""}],
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
    mutationFn: async(data: FieldValues) => await fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/api/videos", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
    
    }),

    onSuccess: () => {
      toast.success("Video published successfully");
      router.push("/studio");
      router.refresh();
    },

    onError: () => toast.error("Could not publish video")
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    mutateAsync(data);
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
            <Button className="absolute inset-y-0 left-0 h-full" type="box" onClick={() => {append({question: "", type:"step" ,answer: ""});incrementTotalProblems()}}>
                Add Question
            </Button>   
          </div>
          </div>
        </div>

      </div>
    </>
  );
}
