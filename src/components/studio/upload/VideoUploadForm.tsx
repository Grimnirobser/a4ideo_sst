"use client";

import MediaUpload from "@/components/shared/MediaUpload";
import Image from "next/image";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Icons } from "@/components/shared/Icons";
import { ChevronRight } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from 'lucide-react';

interface VideoUploadFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  changeValue: (id: string, value: string) => void;
  imageSrc: string;
  isLoading: boolean;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  register,
  errors,
  changeValue,
  imageSrc,
  isLoading,
}) => {
  return (
      <div className="grid grid-cols-3 grid-flow-row gap-4">
        <div className="col-span-2 space-y-8">

          <div className="row-span-1">
            <Label htmlFor="youtubeId" className="text-base">Youtube video ID</Label>
            <Input id="youtubeId" className="text-slate-900 text-xl font-sans antialiased mt-2 border-zinc-500"
                      placeholder="Youtube video ID"
                      {...register("youtubeId", { required: false })}
                      onChange={(ev) => changeValue?.("youtubeId", ev.target.value || "")}
                      disabled={isLoading}
                  />
          </div>

          <div className="row-span-1">
            <Label htmlFor="title" className="text-base">Title</Label>
            <Textarea id="title" className="text-slate-900 text-xl font-sans antialiased mt-2 border-zinc-500"
                      placeholder="Title"
                      {...register("title", { required: true })}
                      onChange={(ev) => changeValue?.("title", ev.target.value || "")}
                      disabled={isLoading}
                  />
          </div>
        </div>

         {/* imageSrc input */}
         <div className="col-span-1 aspect-w-2 aspect-h-3"> 
          <MediaUpload
            onChange={(value) => !isLoading && changeValue("imageSrc", value)}
          >
            <Label className="text-base">Image</Label>

            {imageSrc ? (
              <div className="flex w-full h-full cursor-pointer aspect-w-2 aspect-h-3">
                <Image
                  id="imageSrc"
                  unoptimized
                  src={imageSrc}
                  alt="imageSrc"
                  fill
                  sizes="100%"
                  className="-z-10 object-contain object-center rounded-md mt-2 w-full h-full cursor-pointer border-[1px] border-zinc-500"
                />
              </div>
            ) : (
              <div
                {...register("imageSrc", { required: true })}
                className={`flex flex-col gap-2 mt-2 w-full h-full rounded-md items-center cursor-pointer border-[1px] justify-center object-contain ${
                  errors["imageSrc"] ? "border-red-500" : "border-zinc-500"
                }`}
              >
                <Upload className="h-6 w-6"/> 
                <p>Click to upload</p>
              </div>
            )}
          </MediaUpload>
          </div>

        <div className="col-span-3">
          <Label htmlFor="description" className="text-base">Description</Label>
          <Textarea 
              id="description" 
              className="text-slate-900 text-xl font-sans antialiased mt-2 border-zinc-500"
              placeholder="Description"
              {...register("description", { required: true })}
              onChange={(ev) => changeValue?.("description", ev.target.value || "")}
              disabled={isLoading}                      
            />
      </div>
    </div>
  );
};

export default VideoUploadForm;
