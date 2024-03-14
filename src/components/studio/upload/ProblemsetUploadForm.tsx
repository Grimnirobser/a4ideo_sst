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

import { useState } from "react";
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
  changeValue: (id: string, value: string | string[] | number[])  => void;
  isLoading: boolean;
  removeFunction: (index: number) => void;
  decrement: () => void;
}

interface OptionType {
  value: string;
  label: string;
};


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
    ];

    const [sentence, setSentence] = useState<string[]>([]);
    const [emphasis, setEmphasis] = useState<boolean[]>([]);
    const [sentenceToShow, setSentenceToShow] = useState<string[]>([]);

    const [answerInput, setAnswerInput] = useState<string>('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const { fields: answerFields, append: appendAnswer, remove: removeAnswer, insert: insertAnswer, update: updateAnswer } = useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `problems.${index}.answer`, // unique name for your Field Array
    });

    const { fields: emphasisFields, append: appendEmphasis, remove: removeEmphasis, insert: insertEmphasis, update: updateEmphasis } = useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: `problems.${index}.emphasis`, // unique name for your Field Array
    });


    const addSentence = (content: string) => {
      const newSentences = content.split(/[,.;?!]+/).filter(sentence => sentence.trim() !== '');
      const newSentencesToShow = content.split(/(?<=[,.;?!])/).filter(sentence => sentence.trim().replace(/[,.;?!]/, '') !== '');
      setSentence(sentence => [...sentence, ...newSentences]);
      setEmphasis(emphasis => [...emphasis, ...newSentences.map(() => false)]);
      setSentenceToShow(sentenceToShow => [...sentenceToShow, ...newSentencesToShow]);

      newSentences.map(sentence => {
        appendAnswer(sentence);
        appendEmphasis(false);
      });

    }

    const removeSentence = (emphasisIndex: number) => {
      setSentence(sentence.filter((_, i) => i !== emphasisIndex));
      setEmphasis(emphasis.filter((_, i) => i !== emphasisIndex));
      setSentenceToShow(sentenceToShow.filter((_, i) => i !== emphasisIndex));

      removeAnswer(emphasisIndex);
      removeEmphasis(emphasisIndex);
    }

    const updateSentence = (emphasisIndex: number, content: string) => {
      const newSentences = content.split(/[,.;?!]+/).filter(sentence => sentence.trim() !== '');
      const newSentencesToShow = content.split(/(?<=[,.;?!])/).filter(sentence => sentence.trim().replace(/[,.;?!]/, '') !== '');

      setSentence(sentence => [...sentence.slice(0, emphasisIndex), ...newSentences, ...sentence.slice(emphasisIndex + 1)]);
      setEmphasis(emphasis => [...emphasis.slice(0, emphasisIndex), ...newSentences.map(() => false), ...emphasis.slice(emphasisIndex + 1)]);
      setSentenceToShow(sentenceToShow => [...sentenceToShow.slice(0, emphasisIndex), ...newSentencesToShow, ...sentenceToShow.slice(emphasisIndex + 1)]);

      removeAnswer(emphasisIndex);
      removeEmphasis(emphasisIndex);

      newSentences.map((sentence, ind) => {
        insertAnswer(emphasisIndex+ind, sentence);
        insertEmphasis(emphasisIndex+ind, false);
      });

    }


    const updateEmphasisWithIndex = (emphasisIndex: number) => {

      // state emphasis is not changed yet
      updateEmphasis(emphasisIndex, !emphasis[emphasisIndex]);

      // now change the state emphasis
      setEmphasis(emphasis => emphasis.map((value, ind) => ind === emphasisIndex ? !value : value));

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
                        </SelectContent>
                      </Select>
                  )}
              />
          </div>
        </div>
          
          <div className="relative ">
            <div className="flex w-full min-h-[422px] max-h-[422px] mb-2 rounded-md border-[1px] bg-slate-100 border-zinc-500 focus:border-blue-400 text-center">
                <Label htmlFor={`answerInput${index}`} className="absolute bg-slate-100 px-1 top-2 left-4 z-[1] text-zinc-500 text-base font-sans antialiased">
                    Answer (required)
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

                <div className="flex flex-col space-y-2 w-full mx-2 mt-12 mb-2 scroll-smooth overflow-y-auto overflow-x-hidden">
                    {sentenceToShow.map((sentence, emphasisIndex) => (
                      <div key={emphasisIndex} >
                        <SingleSentence sentence={sentence} emphasis={emphasis[emphasisIndex]} emphasisIndex={emphasisIndex} 
                                        removeSentence={removeSentence} updateSentence={updateSentence} updateEmphasis={updateEmphasisWithIndex}/>

                      </div>
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
                      </SelectContent>
                    </Select>
                )}
            />
          </div>
        </div>


        <div className="relative ">
            <div className="flex w-full min-h-[422px] max-h-[422px] mb-2 rounded-md border-[1px] bg-slate-100 border-zinc-500 focus:border-blue-400 text-center">
                <Label htmlFor={`answerInput${index}`} className="absolute bg-slate-100 px-1 top-2 left-4 z-[1] text-zinc-500 text-base font-sans antialiased">
                    Answer (required)
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

                <div className="flex flex-col space-y-2 w-full mx-2 mt-12 mb-2 scroll-smooth overflow-y-auto overflow-x-hidden">
                    {sentenceToShow.map((sentence, emphasisIndex) => (
                      <div key={emphasisIndex} >
                        <SingleSentence sentence={sentence} emphasis={emphasis[emphasisIndex]} emphasisIndex={emphasisIndex} 
                                        removeSentence={removeSentence} updateSentence={updateSentence} updateEmphasis={updateEmphasisWithIndex}/>

                      </div>
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
