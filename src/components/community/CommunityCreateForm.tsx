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
import { useQuery } from '@tanstack/react-query'
import { useState } from "react";
import { Loader2 } from 'lucide-react'
import { RightWrongIcon } from "@/components/shared/RightWrongIcon";
import checkCommunityNameValidated from "@/actions/checkCommunityNameValidated";

interface CommunityUploadFormProps {
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    changeValue: (id: string, value: string) => void;
    imageSrcs: string[];
    isLoading: boolean;
    appendImage: (value: string) => void;
    removeImage: (index: number) => void;
    setUniqueName: (value: boolean) => void;
}

const CommunityUploadForm: React.FC<CommunityUploadFormProps> = ({
    register,
    errors,
    changeValue,
    imageSrcs,
    isLoading,
    appendImage,
    removeImage,
    setUniqueName
}) => {

    const [tryUsername, setTryUsername] = useState<string>('');

    const {data: isUnique, isLoading: LoadingUniqueness} = useQuery({
        queryKey: ['isCommunityNameUnique', tryUsername],
        queryFn: async() => await checkCommunityNameValidated({name: tryUsername}),
    });

    if(isUnique){
        setUniqueName(true);
    }else{
        setUniqueName(false);
    }

  return (
    <div className="flex flex-col space-y-4">

        <Label htmlFor="CommunityName" className="text-base">Community Name</Label>
        <div className="flex flex-row items-center gap-2">
            <Input id="CommunityName" className="w-1/2 text-slate-900 text-xl font-sans antialiased border-zinc-500"
                        placeholder="Community Name"
                        {...register("name", { required: false })}
                        onChange={(ev) => {changeValue?.("name", ev.target.value || ""); setTryUsername(ev.target.value);}}
                        disabled={isLoading}
                    />
            { tryUsername ? (LoadingUniqueness ? (<Loader2 className='h-6 w-6 animate-spin' />) : ( isUnique ? (<RightWrongIcon isCorrect={true} />) : <RightWrongIcon isCorrect={false} />)) : null}
        </div>


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
                        className="z-10 absolute top-1 right-2 h-6 cursor-pointer" 
                        onClick={() => removeImage(index)}/>
                    <Image
                        unoptimized
                        fill
                        sizes="100%"
                        className='object-cover object-center rounded-md'
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
