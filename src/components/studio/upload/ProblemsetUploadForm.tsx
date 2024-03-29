"use client";
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

import { Textarea } from "@/components/ui/textarea"
import { SingleSentence } from "@/components/shared/SingleSentence"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


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
      <div className="w-full flex flex-col gap-2">
  
        <Label className="text-base">Question type</Label>
        <Controller 
              control={control}
              name={`problems.${index}.type`}
              defaultValue={options[0].value}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="flex h-auto text-2xl font-sans subpixel-antialiased mt-2 border-zinc-500">
                        <SelectValue id={`problems.${index}.type`} />
                      </SelectTrigger>
                    <SelectContent >
                      <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[0].value}>{options[0].label}</SelectItem>
                      <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[1].value}>{options[1].label}</SelectItem>
                      <SelectItem className="text-2xl font-sans subpixel-antialiased" value={options[2].value}>{options[2].label}</SelectItem>
                    </SelectContent>
                  </Select>
              )}
          />

        <div>

        <Label htmlFor={`problems.${index}.question`} className="text-base">Question</Label>
        <Textarea 
          id={`problems.${index}.question`}
          className="text-slate-900 text-xl font-sans antialiased mt-2 border-zinc-500"
          placeholder="Question"
          {...register(`problems.${index}.question`, { required: true })}
          onChange={(ev) => changeValue?.(`problems.${index}.question`, ev.target.value || "")}
          disabled={isLoading}                      
        />
        </div>

        <Label className="text-base">Answer</Label>
          <div className="relative">
          <div className="flex w-full h-[300px] mb-2 rounded-md border-[1px] border-zinc-500 text-center">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" disabled={isLoading} className="absolute px-2 top-2 right-2 z-[1] ">
                        <FaRegSquarePlus className="w-4 h-4"/>
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
                      <Textarea id={`answerInput${index}`} className="text-slate-900 text-xl font-sans antialiased border-zinc-500"
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
      </>
    );
  }else{
    return (
      <>
      <div className="flex gap-1">
      <div className="w-full flex flex-col gap-2">
        <div>
        <Label className="text-base">Question type</Label>
        <Controller 
              control={control}
              name={`problems.${index}.type`}
              defaultValue={options[0].value}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="flex h-auto text-2xl font-sans subpixel-antialiased mt-2 border-zinc-500">
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

        <div>

        <Label htmlFor={`problems.${index}.question`} className="text-base">Question</Label>
        <Textarea 
          id={`problems.${index}.question`}
          className="text-slate-900 text-xl font-sans antialiased mt-2 border-zinc-500"
          placeholder="Question"
          {...register(`problems.${index}.question`, { required: true })}
          onChange={(ev) => changeValue?.(`problems.${index}.question`, ev.target.value || "")}
          disabled={isLoading}                      
        />
        </div>

        <Label className="text-base">Answer</Label>
          <div className="relative">
          <div className="flex w-full h-[300px] mb-2 rounded-md border-[1px] border-zinc-500 text-center">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" disabled={isLoading} className="absolute px-2 top-2 right-2 z-[1] ">
                        <FaRegSquarePlus className="w-4 h-4"/>
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
                      <Textarea id={`answerInput${index}`} className="text-slate-900 text-xl font-sans antialiased border-zinc-500"
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
