"use client";
import TextArea from "@/components/shared/TextArea";
import { FieldErrors, FieldValues, UseFormRegister, Controller, Control } from "react-hook-form";
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

import { ChevronDown } from 'lucide-react';


interface AttemptUploadFormProps {
  index: number;
  totalProblems: number;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  changeValue: (id: string, value: string) => void;
  isLoading: boolean;
  removeFunction: (index: number) => void;
  decrement: () => void;
}

interface OptionType {
  value: string;
  label: string;
};


const AttemptUploadForm: React.FC<AttemptUploadFormProps> = ({
  index,
  totalProblems,
  register,
  errors,
  changeValue,
  isLoading,
  removeFunction,
  decrement
}) => {


  if (totalProblems <= 1) {
    return (
      <>
      <div className="flex gap-1">
      <div className="w-full flex flex-col gap-2">
  
        <div className="flex flex-row gap-2">
  
          <div className="w-3/5">
            <TextArea
              register={register}
              id={`problems.${index}.question`}
              label="Question (required)"
              errors={errors}
              disabled={isLoading}
              changeValue={changeValue}
              required
            />
          </div>
        
          <div className="w-2/5">
                  <div className="flex w-full h-2/5 mb-2 rounded-md border-[1px] bg-slate-100 border-zinc-500 text-center items-center justify-center">
                    Question Type
                    <ChevronDown className="h-6 w-6"/>
                  </div>
          </div>
        </div>
        <TextArea
          register={register}
          id={`problems.${index}.answer`}
          label="Answer (required)"
          errors={errors}
          disabled={isLoading}
          changeValue={changeValue}
          required
        />
  
        </div>
        
      </div>
      </>
    );
  }else{
    return (
      <>
      <div className="flex gap-1">
      <div className="w-full flex flex-col gap-2">
  
        <div className="flex flex-row gap-2">
  
          <div className="w-3/5">
            <TextArea
              register={register}
              id={`problems.${index}.question`}
              label="Question (required)"
              errors={errors}
              disabled={isLoading}
              changeValue={changeValue}
              required
            />
          </div>
        
          <div className="w-2/5">
              <div className="flex w-full h-2/5 mb-2 rounded-md border-[1px] bg-slate-100 border-zinc-500 text-center items-center justify-center">
                    Question Type
                    <ChevronDown className="h-6 w-6"/>
                  </div>
          
          </div>
        </div>
        <TextArea
          register={register}
          id={`problems.${index}.answer`}
          label="Answer (required)"
          errors={errors}
          disabled={isLoading}
          changeValue={changeValue}
          required
        />
  
  
        </div>
        <Button variant="destructive" className="items-center justify-center h-52" onClick={() => {removeFunction(index);decrement()}}>
          <Trash2 className="w-6 h-6"/>
        </Button>
        
      </div>
      </>
    );
  }
  
};

export default AttemptUploadForm;
