'use client';

import {useState} from "react";
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
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
import { Button } from "@/components/ui/button"
import { Trash2, Pencil } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea"



interface SingleSentenceProps {
    sentence: string;
    emphasis: boolean;
    emphasisIndex: number;
    removeSentence: (index: number) => void;
    updateSentence: (index: number, value: string) => void;
    updateEmphasis: (index: number) => void;
}

export const SingleSentence: React.FC<SingleSentenceProps> = ({
    sentence, 
    emphasis,
    emphasisIndex,
    removeSentence,
    updateSentence,
    updateEmphasis
}) => {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSentence, setNewSentence] = useState(sentence);


  return (
    <div className="relative">
        <Badge className="flex w-full" variant="outline">
            <Checkbox className="absolute left-2 top-2 h-4 w-4" checked={emphasis} onClick={() => updateEmphasis(emphasisIndex)}/>
            <div className="flex ml-6 mr-8 text-left text-xl text-slate-700 font-sans antialiased break-words hyphens-auto">
                {sentence}
            </div>
 
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                        <Pencil className="absolute right-8 top-2 h-4 w-4 cursor-pointer" />
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[725px]">
                    <DialogHeader>
                      <DialogTitle className="text-xl">Modify Answer</DialogTitle>
                      <DialogDescription className="text-base">
                        Modify you answer below. Answers will be separated by slashes(/).
                        Please note that the modified answer will be removed from the emphasis list by default.
                      </DialogDescription>
                    </DialogHeader>
                      <Textarea id={`answerModify${emphasisIndex}`} className="text-slate-900 text-xl font-sans antialiased"
                          placeholder="Type your answer here . . ."
                          value={newSentence}
                          onChange={(ev) => setNewSentence(ev.target.value)}
                      />
                    <DialogFooter>

                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Close
                        </Button>
                      </DialogClose>
                    
                      <Button type="button" onClick={()=>{updateSentence(emphasisIndex, newSentence);setDialogOpen(false)}}>
                          Save Answer
                      </Button>

                    </DialogFooter>
                  </DialogContent>
                </Dialog>

            

            <Trash2 className="absolute right-2 top-2 h-4 w-4 cursor-pointer" onClick={() => removeSentence(emphasisIndex)}/>
        
        </Badge>
        
    </div>
  );
}