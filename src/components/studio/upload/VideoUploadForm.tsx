"use client";

import MediaUpload from "@/components/shared/MediaUpload";
import Image from "next/image";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, ArrowRight } from 'lucide-react';
import { buttonVariants} from '@/components/ui/button'
import { useState } from "react";



interface VideoUploadFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  changeValue: (id: string, value: string) => void;
  imageSrc: string;
  isLoading: boolean;
  isVideo: boolean;
  setIsVideo: (value: boolean) => void;
}

const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  register,
  errors,
  changeValue,
  imageSrc,
  isLoading,
  isVideo,
  setIsVideo,
}) => {
  const [uploadedFilename, setUploadedFilename] = useState<string>("");

  return (
      <div className="grid grid-cols-3 grid-flow-row gap-4">
        <div className="col-span-2 space-y-8">

          <div className="row-span-1">
              {isVideo ? 
              <>
              <div className="flex flex-row items-center justify-between">
              <Label htmlFor="video" className="text-base">Youtube Video ID</Label>
              <span
                    onClick={() => {setIsVideo(false); changeValue("youtubeId", ""); setUploadedFilename("")}}
                    className={buttonVariants({
                    variant: 'link',
                    className: 'cursor-pointer text-sm text-rose-600',
                  })}
                  >
                  Upload document(s)
                  <ArrowRight className='h-4 w-4'/>
                </span>
                </div>
                <Input id="video" className="text-slate-900 text-xl font-sans antialiased border-zinc-500"
                      placeholder="Type Youtube video ID here"
                      {...register("youtubeId", { required: true })}
                      onChange={(ev) => changeValue?.("youtubeId", ev.target.value || "")}
                      disabled={isLoading}
                      errors={errors}
                      mark="youtubeId"
                  />  
              </>
              :<>
              <div className="flex flex-row items-center justify-between">
              <Label htmlFor="document" className="text-base">Document(s)</Label>
              <span
                    onClick={() => {setIsVideo(true); changeValue("youtubeId", ""); setUploadedFilename("")}}
                    className={buttonVariants({
                    variant: 'link',
                    className: 'cursor-pointer text-sm text-rose-600',
                  })}
                  >
                  Use Youtube video ID
                  <ArrowRight className='h-4 w-4'/>
                </span>
                </div>
                <div className="flex items-center gap-1">
                <MediaUpload onChange={(value) => !isLoading && changeValue("youtubeId", value)} setValue={setUploadedFilename}>
                      <button className="border-zinc-500 text-center h-10 text-slate-900 border rounded-md text-sm bg-slate-100 hover:opacity-80"
                              disabled={isLoading}>
                        <p>Click to Upload</p>
                      </button>
                </MediaUpload>
              
                <Input id="document" className="text-slate-900 text-xl italic font-sans antialiased border-zinc-500"
                          {...register("youtubeId", { required: true })}
                          value={uploadedFilename}
                          disabled={true}
                          errors={errors}
                          mark="youtubeId"
                      />
              </div>
              </>}
          </div>

          <div className="row-span-1">
            <Label htmlFor="title" className="text-base">Title</Label>
            <Textarea id="title" className="text-slate-900 text-xl font-sans antialiased mt-2 border-zinc-500"
                      placeholder="Title"
                      {...register("title", { required: true })}
                      onChange={(ev) => changeValue?.("title", ev.target.value || "")}
                      disabled={isLoading}
                      errors={errors}
                      mark="title"
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
                  className="-z-10 object-contain object-center rounded-md mt-3 w-full h-full cursor-pointer border-[1px] border-zinc-500"
                />
              </div>
            ) : (
              <div
                {...register("imageSrc", { required: true })}
                className={`flex flex-col gap-2 mt-3 w-full h-full rounded-md items-center cursor-pointer border-[1px] justify-center object-contain ${
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
              errors={errors}
              mark="description"         
            />
      </div>
    </div>
  );
};

export default VideoUploadForm;
