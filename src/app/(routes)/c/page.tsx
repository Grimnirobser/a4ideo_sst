"use client";

import Button from "@/components/shared/Button";
import { useRouter } from "next/navigation";
import { useContext, useState, useEffect } from "react";
import ProblemsetUploadForm from "@/components/studio/upload/ProblemsetUploadForm";
import { useForm, FieldValues, SubmitHandler, useFieldArray } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast"
import { useMutation } from "@tanstack/react-query"
import { createVideo } from "@/actions/createVideo";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} from 'obscenity';
import { createCommunity } from "@/actions/createCommunity";
import CommunityCreateForm from "@/components/community/CommunityCreateForm";


interface CommunityDataType{
    channelId: string,
    name: string,
    description: string,
    imageSrcs: string[],
}


interface AnswerType{
  sentence: string,    
  emphasis: boolean    
}

export default function CreateCommunityPage() {

    const [checked, setChecked] = useState(false);
    const currentChannel = useContext(CurrentChannelContext);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (!currentChannel || currentChannel.reputation < 1000) {
            router.push("/");
            toast({
                variant: "error",
                title: "Error",
                description: "You have no permission.",
            });
        }else{
            setChecked(true);
        }
    }, [currentChannel, router, toast]); 

    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            description: "",
            imageSrcs: [],
        },
    });

    const { fields: imageSrcFields, append: appendImage, remove: removeImage } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "imageSrcs", // unique name for your Field Array
    });

    const { fields: problemsetFields, append: appendProblemset, remove: removeProblemset } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "problems", // unique name for your Field Array
    });
    
    const imageSrcs: string[] = watch("imageSrcs");

    const changeValue = (id: string, value: string) => {
        setValue(id, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
        });
    };


    const [totalProblems, setTotalProblems] = useState(1);

    let incrementTotalProblems = () => setTotalProblems(totalProblems + 1);
    let decrementTotalProblems = () => (totalProblems === 1) ? {} : setTotalProblems(totalProblems - 1);

    const { data: community, mutate, mutateAsync, isPending } = useMutation({
        mutationKey: ["createCommunity"],
        mutationFn: async(communityData: CommunityDataType) => await createCommunity(communityData),

        onSuccess: () => {
        toast({
            variant: "success",
            title: "Success",
            description: "Community successfully submitted for review.",
        });
            router.push(`/c/${community?.name}`);
            router.refresh();
        },

        onError: () =>  toast({
        variant: "error",
        title: "Error",
        description: "Something went wrong, please try again.", 
        })
    })

    const matcher = new RegExpMatcher({
        ...englishDataset.build(),
        ...englishRecommendedTransformers,
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        if (!currentChannel || currentChannel.reputation < 1000) {
            toast({
                variant: "error",
                title: "Error",
                description: "You have no permission.",
            });
            return;
        }

        if (matcher.hasMatch(data.name) || matcher.hasMatch(data.description)){
            toast({
                variant: "error",
                title: "Error",
                description: "Please remove inappropriate words.",
            });
            return;
        }

        const communityData = {
            channelId: currentChannel.id,
            name: data.name,
            description: data.description,
            imageSrcs: data.imageSrcs,
            problems: data.problems,
        };

        // console.log(communityData);
        mutateAsync(communityData);
    }

    if (!checked) {
        return null;
    }

    // return (
    //     <>
    //     <div className="flex flex-col px-6 pt-4">

    //         <div className="flex justify-between">
    //         <h1 className="text-2xl">Community details & Entrance questions</h1>
    //         <span className="flex gap-4">
    //             <Button type="secondary" onClick={() => router.back()}>
    //             Cancel
    //             </Button>
    //             <Button type="box" onClick={handleSubmit(onSubmit)}>
    //             Create Community
    //             </Button>
    //         </span>
    //         </div>


    //         <div className="w-full flex flex-col">
    //             <CommunityCreateForm
    //                 register={register}
    //                 errors={errors}
    //                 changeValue={changeValue}
    //                 imageSrcs={imageSrcs}
    //                 isLoading={isPending}
    //                 appendImage={appendImage}
    //                 removeImage={removeImage}
    //             />
    //         </div>
            
    //     </div>
    //     </>
    // );

    return (
        <>
          <title>Create Community </title>
          <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
              <div className='flex flex-col items-center space-y-2 text-center'>
                <h1 className='text-2xl font-semibold'>
                  Creating a channel 
                </h1>
              </div>
    
              <div className='grid gap-6'>
                <div className="w-full flex flex-col">
                 <CommunityCreateForm
                    register={register}
                    errors={errors}
                    changeValue={changeValue}
                    imageSrcs={imageSrcs}
                    isLoading={isPending}
                    appendImage={appendImage}
                    removeImage={removeImage}
                />
            </div>
              </div>
            </div>
          </div>
        </>
      )
}
