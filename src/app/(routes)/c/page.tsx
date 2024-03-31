"use client";

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
// import { createCommunity } from "@/actions/createCommunity";
import CommunityCreateForm from "@/components/community/CommunityCreateForm";
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import AddNewTag from "@/components/shared/AddNewTag";


interface CommunityDataType{
    channelId: string,
    name: string,
    description: string,
    imageSrcs: string[],
    textColor: string,
    backgroundColor: string,
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
            textColor: "",
            backgroundColor: "",
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

    // const { data: community, mutate, mutateAsync, isPending } = useMutation({
    //     mutationKey: ["createCommunity"],
    //     mutationFn: async(communityData: CommunityDataType) => await createCommunity(communityData),

    //     onSuccess: () => {
    //     toast({
    //         variant: "success",
    //         title: "Success",
    //         description: "Community successfully submitted for review.",
    //     });
    //         router.push(`/c/${community?.name}`);
    //         router.refresh();
    //     },

    //     onError: () =>  toast({
    //     variant: "error",
    //     title: "Error",
    //     description: "Something went wrong, please try again.", 
    //     })
    // })

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
        // mutateAsync(communityData);
    }

    if (!checked) {
        return null;
    }

    return (
        <h1>Under development</h1>
    )

    // return (
    //     <>
    //     <div className="flex flex-col px-6 pt-4">

    //         <div className="flex justify-between">
    //         <h1 className="text-2xl">Create a community</h1>
    //         <span className="flex gap-4">
    //             <Button disabled={isPending} className='text-lg bg-gray-400 text-primary-foreground hover:bg-slate-400/80'>
    //                 Cancel
    //             </Button>

    //             <Button disabled={isPending} className='text-lg'>
    //               {isPending && (
    //                 <Loader2 className='mr-2 h-4 w-4 animate-spin' />
    //               )}
    //               Create Channel
    //             </Button>
    //         </span>
    //         </div>

    //         <div className="flex flex-col lg:flex-row mt-2 gap-4 max-h-full">

    //             <div className="w-full flex flex-col">
    //                 <CommunityCreateForm
    //                     register={register}
    //                     errors={errors}
    //                     changeValue={changeValue}
    //                     imageSrcs={imageSrcs}
    //                     isLoading={isPending}
    //                     appendImage={appendImage}
    //                     removeImage={removeImage}
    //                 />
    //             </div>

    //             <div className="w-full lg:w-2/6 max-h-screen overflow-y-auto no-scrollbar">
    //                 <AddNewTag 
    //                     register={register}
    //                     errors={errors}
    //                     changeValue={changeValue}
    //                     isLoading={isPending}    
    //                     watch={watch}
    //                 />

    //             </div>


            
    //     </div>
    //     </div>
    //     </>
    // );
}
