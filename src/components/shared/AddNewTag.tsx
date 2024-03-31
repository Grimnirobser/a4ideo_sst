"use client";

import MediaUpload from "@/components/shared/MediaUpload";
import Image from "next/image";
import { FieldErrors, FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "../ui/badge";

interface AddNewTagProps {
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors<FieldValues>;
    changeValue: (id: string, value: string) => void;
    isLoading: boolean;
    watch: UseFormWatch<FieldValues>;
}

const AddNewTag: React.FC<AddNewTagProps> = ({
    register,
    errors,
    changeValue,
    isLoading,
    watch
}) => {
    // const communityName = watch('name') ? watch('name') : "Type Community Name";
  return (
      <div className="flex flex-col space-y-4">
            <h1 className="text-2xl">Community Badge details</h1>

            <Label htmlFor="textColor" className="text-base">Text Color</Label>
            <Input id="textColor" className="text-slate-900 text-xl font-sans antialiased border-zinc-500"
                      placeholder="Text Color"
                      {...register("textColor", { required: false })}
                      onChange={(ev) => changeValue?.("textColor", ev.target.value || "")}
                      disabled={isLoading}
                  />

            <Label htmlFor="bgColor" className="text-base">Background Color</Label>
            <Input id="bgColor" className="text-slate-900 text-xl font-sans antialiased border-zinc-500"
                      placeholder="Background Color"
                      {...register("bgColor", { required: true })}
                      onChange={(ev) => changeValue?.("bgColor", ev.target.value || "")}
                      disabled={isLoading}
                  />
            <p className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Community Badge Preview</p> 
            <Badge className="items-center justify-center w-fit">
                <p id="badgePreview" className="text-base">{watch('name') ? watch('name') : "Community Name"}</p>
            </Badge>
    </div>
  );
};

export default AddNewTag;
