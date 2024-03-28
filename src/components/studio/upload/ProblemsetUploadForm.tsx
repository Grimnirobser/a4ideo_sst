"use client";
import TextArea from "@/components/shared/TextArea";
import { FieldErrors, FieldValues, UseFormRegister, Controller, Control, useFieldArray } from "react-hook-form";

import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown } from 'lucide-react';
import { FaRegSquarePlus } from "react-icons/fa6";
import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import { AutosizeTextarea } from "@/components/ui/auto-resize"
import { SingleSentence } from "@/components/shared/SingleSentence"


interface ProblemUploadFormProps {
  index: number;
  totalProblems: number;
  control: Control<FieldValues, any, FieldValues>;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors<FieldValues>;
  changeValue: (id: string, value: string)  => void;
  isLoading: boolean;
  removeFunction: (index: number) => void;
  decrement: () => void;
}

interface OptionType {
  value: string;
  label: string;
};

interface AnswerType{
  sentence: string,    
  emphasis: boolean    
}


const ProblemUploadForm: React.FC<ProblemUploadFormProps> = ({
  index,
  totalProblems,
  control,
  register,
  errors,
  changeValue,
  isLoading,
  removeFunction,
  decrement
}) => {

    const options: OptionType[] = [
      { value: 'reason', label: 'reason'},
      { value: 'step', label: 'step'},
      { value: 'exact', label: 'exact'},
    ];
    

    // state will have punctuation but the content in form will not have punctuation
    const [sentenceEmphasis, setSentenceEmphasis] = useState<AnswerType[]>([]);
    // const [sentenceToShow, setSentenceToShow] = useState<string[]>([]);

    const [answerInput, setAnswerInput] = useState<string>('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const { fields: answerFields, append, remove, insert, update } = useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      shouldUnregister: false,
      name: `problems.${index}.answer`, // unique name for your Field Array
    });


    const addSentence = (content: string) => {
      const newSentences = content.split(/[,.;?!]+/).map((sentence) => sentence.trim()).filter(sentence => sentence.trim() !== '');
      const newSentencesToShow = content.split(/(?<=[,.;?!])/).filter(sentence => sentence.trim().replace(/[,.;?!]/, '') !== '');
      
      const newSentenceEmphasis = newSentencesToShow.map(sentence => ({sentence: sentence, emphasis: false}));
      
      setSentenceEmphasis(sentenceEmphasis => [...sentenceEmphasis, ...newSentenceEmphasis]);

      newSentences.map((sentence) => {
        append({sentence: sentence, emphasis: false});
      });   

    }

    const removeSentence = (emphasisIndex: number) => {
      setSentenceEmphasis(sentenceEmphasis.filter((_, i) => i !== emphasisIndex));

      remove(emphasisIndex);

    }

    const updateSentence = (emphasisIndex: number, content: string) => {
      const newSentences = content.split(/[,.;?!]+/).map((sentence) => sentence.trim()).filter(sentence => sentence.trim() !== '');
      const newSentencesToShow = content.split(/(?<=[,.;?!])/).filter(sentence => sentence.trim().replace(/[,.;?!]/, '') !== '');
      const newSentenceEmphasis = newSentencesToShow.map(sentence => ({sentence: sentence, emphasis: false}));

      setSentenceEmphasis(sentenceEmphasis => [...sentenceEmphasis.slice(0, emphasisIndex), ...newSentenceEmphasis, ...sentenceEmphasis.slice(emphasisIndex + 1)]);

      remove(emphasisIndex);

      newSentences.map((sentence, ind) => {
        insert(emphasisIndex+ind, {sentence: sentence, emphasis: false});
      });

    }


    const updateEmphasis = (emphasisIndex: number) => {

      // did not store sentence without punctuation and trimming so need to do it here
      update(emphasisIndex, {sentence: sentenceEmphasis[emphasisIndex].sentence.replace(/[,.;?!]/, '').trim(), 
                            emphasis: !sentenceEmphasis[emphasisIndex].emphasis});
      
      setSentenceEmphasis(sentenceEmphasis => sentenceEmphasis.map((item, ind) => ind === emphasisIndex ? {sentence: sentenceEmphasis[ind].sentence, emphasis: !sentenceEmphasis[ind].emphasis} : item));
    }

    const handleAnswerAdd = (ev: any) => {
      ev.preventDefault();
      addSentence(answerInput);
      setAnswerInput('');
      setDialogOpen(false);
    }


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
              label="Question"
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
            <Controller 
                  control={control}
                  name={`problems.${index}.type`}
                  defaultValue={options[0].value}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="flex h-auto text-2xl font-sans subpixel-antialiased">
                            <SelectValue />
                          </SelectTrigger>
                        <SelectContent >
                          <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[0].value}>{options[0].label}</SelectItem>
                          <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[1].value}>{options[1].label}</SelectItem>
                          <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[2].value}>{options[2].label}</SelectItem>
                        </SelectContent>
                      </Select>
                  )}
              />
          </div>
        </div>
          
          <div className="relative ">
            <div className="flex w-full min-h-[300px] max-h-[300px] mb-2 rounded-md border-[1px] bg-slate-100 border-zinc-500 focus:border-blue-400 text-center">
                <Label htmlFor={`answerInput${index}`} className="absolute bg-slate-100 px-1 top-2 left-4 z-[1] text-zinc-500 text-base font-sans antialiased">
                    Answer
                </Label>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" disabled={isLoading} className="absolute bg-slate-100 px-1 top-2 right-4 z-[1] ">
                        <FaRegSquarePlus className="w-6 h-6"/>
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[725px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Answer</DialogTitle>
                      <DialogDescription className="text-base">
                        Type your answer below, answer would be split into sentences 
                        and you need to emphasize those necessary sentences that an acceptable solution must have.
                      </DialogDescription>
                    </DialogHeader>
                      <AutosizeTextarea id={`answerInput${index}`} className="text-slate-900 text-xl font-sans antialiased"
                          placeholder="Type your answer here . . ."
                          value={answerInput}
                          onChange={(ev) => setAnswerInput(ev.target.value)}
                      />
                    <DialogFooter>

                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    
                      <Button type="button" onClick={handleAnswerAdd}>
                          Save Answer
                      </Button>

                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="flex flex-col space-y-2 w-full mx-2 mt-12 mb-2 scroll-smooth overflow-y-auto overflow-x-hidden no-scrollbar">
                    {sentenceEmphasis.map((item, emphasisIndex) => (
                        <SingleSentence {...item}
                                        key={item.sentence + emphasisIndex}
                                        emphasisIndex={emphasisIndex} 
                                        removeSentence={removeSentence} 
                                        updateSentence={updateSentence} 
                                        updateEmphasis={updateEmphasis}/>

                    )
                  )}
                </div>
            </div>
          </div>
  
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
              label="Question"
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
          <Controller
                control={control}
                name={`problems.${index}.type`}
                defaultValue={options[0].value}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="flex h-auto text-2xl font-sans subpixel-antialiased">
                          <SelectValue />
                        </SelectTrigger>
                      <SelectContent >
                        <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[0].value}>{options[0].label}</SelectItem>
                        <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[1].value}>{options[1].label}</SelectItem>
                        <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[2].value}>{options[2].label}</SelectItem>
                      </SelectContent>
                    </Select>
                )}
            />
          </div>
        </div>


        <div className="relative ">
            <div className="flex w-full min-h-[422px] max-h-[422px] mb-2 rounded-md border-[1px] bg-slate-100 border-zinc-500 focus:border-blue-400 text-center">
                <Label htmlFor={`answerInput${index}`} className="absolute bg-slate-100 px-1 top-2 left-4 z-[1] text-zinc-500 text-base font-sans antialiased">
                    Answer
                </Label>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" disabled={isLoading} className="absolute bg-slate-100 px-1 top-2 right-4 z-[1] ">
                        <FaRegSquarePlus className="w-6 h-6"/>
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[725px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Answer</DialogTitle>
                      <DialogDescription className="text-base">
                        Type your answer below, answer would be split into sentences 
                        and you need to emphasize those necessary sentences that an acceptable solution must have.
                      </DialogDescription>
                    </DialogHeader>
                      <AutosizeTextarea id={`answerInput${index}`} className="text-slate-900 text-xl font-sans antialiased"
                          placeholder="Type your answer here . . ."
                          value={answerInput}
                          onChange={(ev) => setAnswerInput(ev.target.value)}
                      />
                    <DialogFooter>

                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    
                      <Button type="button" onClick={handleAnswerAdd}>
                          Save Answer
                      </Button>

                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="flex flex-col space-y-2 w-full mx-2 mt-12 mb-2 scroll-smooth overflow-y-auto overflow-x-hidden no-scrollbar">
                    {sentenceEmphasis.map((item, emphasisIndex) => (
                        <SingleSentence {...item}
                                        key={item.sentence + emphasisIndex}
                                        emphasisIndex={emphasisIndex} 
                                        removeSentence={removeSentence} 
                                        updateSentence={updateSentence} 
                                        updateEmphasis={updateEmphasis}/>

                    )
                  )}
                </div>
            </div>
          </div>
  
  
        </div>
        <Button variant="destructive" className="items-center justify-center h-[314px]" onClick={() => {removeFunction(index);decrement()}}>
          <Trash2 className="w-6 h-6"/>
        </Button>
        
      </div>
      </>
    );
  }
  
};

export default ProblemUploadForm;
