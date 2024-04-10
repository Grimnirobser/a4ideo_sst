"use client";

import { FieldErrors, FieldValues, UseFormRegister, UseFormWatch, set } from "react-hook-form";
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

    return (
        <div className="flex flex-col space-y-4">
                <h1 className="text-2xl">Community Badge details</h1>

                <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                <Label htmlFor="textColor" className="block text-base font-medium mb-2">Text Color</Label>
                <Input id="textColor" 
                        type="color"
                        className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                        {...register("textColor", { required: false })}
                        onChange={(ev) => changeValue?.("textColor", ev.target.value || "")}
                        value = {watch('textColor')}
                        disabled={isLoading}
                    />
                </div>

                <div className="flex flex-col">
                <Label htmlFor="bgColor" className="block text-base font-medium mb-2">Background Color</Label>
                <Input id="bgColor" 
                        type="color"
                        className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                        {...register("backgroundColor", { required: false })}
                        onChange={(ev) => changeValue?.("backgroundColor", ev.target.value || "")}
                        value = {watch('backgroundColor')}
                        disabled={isLoading}
                    />

                </div>
                </div>
                <p className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Community Badge Preview</p> 
                <Badge 
                    style={{color: watch('textColor'), backgroundColor: watch('backgroundColor')}}
                    className="items-center justify-center w-fit">
                    <p id="badgePreview" className="text-base">{watch('name') ? watch('name') : "Community Name"}</p>
                </Badge>
        </div>
    );
};

export default AddNewTag;
