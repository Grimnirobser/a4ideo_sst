"use client";

import Image from "next/image";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { FaRegSquarePlus } from "react-icons/fa6";
import { ChevronRight } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import MediaUploadMultiple from "../shared/MediaUploadMultiple";
import { CirclePlus, CircleX } from 'lucide-react';
import { Button } from "../ui/button";


interface CommunityUploadFormProps {
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    changeValue: (id: string, value: string) => void;
    imageSrcs: string[];
    isLoading: boolean;
    appendImage: (value: string) => void;
    removeImage: (index: number) => void;
}

const CommunityUploadForm: React.FC<CommunityUploadFormProps> = ({
    register,
    errors,
    changeValue,
    imageSrcs,
    isLoading,
    appendImage,
    removeImage,
}) => {
  return (
    <div className="bg-slate-100 h-full space-y-4">
        <Label htmlFor="name" className="text-base">Community Name</Label>
        <Input id="name" className="text-slate-900 text-xl font-sans antialiased border-zinc-500"
                    placeholder="Community Name"
                    {...register("name", { required: false })}
                    onChange={(ev) => changeValue?.("name", ev.target.value || "")}
                    disabled={isLoading}
                />

         {/* imageSrc input */}

         <div className="flex flex-row gap-2"> 
            <Label className="text-base">Image(s)</Label>
            <MediaUploadMultiple onChange={appendImage}>
                <CirclePlus className="cursor-pointer h-6 w-6"/>
            </MediaUploadMultiple>
        </div>

        <div className="grid grid-cols-5 grid-flow-row border-[1px] border-zinc-500 min-h-[150px] rounded-md">
            {imageSrcs.map((src, index) => (
                <div key={src} className="col-span-1 aspect-w-2 aspect-h-3">
                    <CircleX color='red' 
                        className="absolute top-1 right-2 h-6 cursor-pointer" 
                        onClick={() => removeImage(index)}/>
                    <Image
                        unoptimized
                        fill
                        sizes="100%"
                        className='-z-10 object-cover object-center rounded-md'
                        src={src}
                        alt='uploaded image'
                    />
                </div>
            ))}
        </div>

          <Label htmlFor="description" className="text-base">Description</Label>
          <Textarea 
              id="description" 
              className="text-slate-900 text-xl font-sans antialiased border-zinc-500"
              placeholder="Description"
              {...register("description", { required: true })}
              onChange={(ev) => changeValue?.("description", ev.target.value || "")}
              disabled={isLoading}                      
            />
      </div>
  );
};

export default CommunityUploadForm;
