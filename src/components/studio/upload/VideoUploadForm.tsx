"use client";

import MediaUpload from "@/components/shared/MediaUpload";
import TextArea from "@/components/shared/TextArea";
import Image from "next/image";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { FaRegSquarePlus } from "react-icons/fa6";
import { ChevronRight } from 'lucide-react';



interface VideoUploadFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  changeValue: (id: string, value: string) => void;
  thumbnailSrc: string;
  isLoading: boolean;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  register,
  errors,
  changeValue,
  thumbnailSrc,
  isLoading,
}) => {
  return (
    <div className="w-full md:w-4/6 flex flex-col gap-2">

      <div className="flex flex-row gap-4">
        
        <div className="flex flex-col w-full gap-2">

        {/* youtube id input */}
            <div className="flex gap-2"> 

              <div className="w-full">
                <TextArea
                  register={register}
                  id="youtubeId"
                  label="Youtube video ID (required)"
                  errors={errors}
                  disabled={isLoading}
                  changeValue={changeValue}
                  required
                />
              </div>
                  <div className="flex w-40 ml-2 rounded-md border-[1px] bg-slate-100 border-zinc-500 text-center items-center justify-center">
                    Thumbnail
                    <ChevronRight className="h-6 w-6"/>
                  </div>
            </div>

          {/* title input */}
          <div className="w-full"> 

          <TextArea
            register={register}
            id="title"
            label="Title (required)"
            errors={errors}
            disabled={isLoading}
            changeValue={changeValue}
            required
          />
          </div>
        </div>

        {/* thumbnailSrc input */}
      <div className="">
        <MediaUpload
          onChange={(value) => !isLoading && changeValue("thumbnailSrc", value)}
        >
          {thumbnailSrc ? (
            <Image
              src={thumbnailSrc}
              alt="thumbnail"
              height="124"
              width="192"
              className={`h-52 w-80 overflow-hidden rounded-md border-[1px] border-zinc-500 ${
                !isLoading ? "cursor-pointer" : ""
              }`}
            />
          ) : (
            <div
              id="thumbnailSrc"
              {...register("thumbnailSrc", { required: true })}
              className={`h-52 w-80 bg-slate-100 rounded-md flex items-center justify-center cursor-pointer border-[1px] ${
                errors["thumbnailSrc"] ? "border-red-500" : "border-zinc-500"
              }`}
            >
              <FaRegSquarePlus className="h-6 w-6" />
            </div>
          )}
        </MediaUpload>
      </div>

      </div>

      <TextArea
        register={register}
        id="description"
        label="Description (required)"
        errors={errors}
        disabled={isLoading}
        changeValue={changeValue}
        required
      />
      
    </div>
  );
};

export default VideoUploadForm;
