'use client'

import {
  Button as UIButton,
  buttonVariants,
} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { CurrentUserContext } from "@/context/CurrentUserContext";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useContext, useState, useEffect, use } from "react";
import { ZodError, z } from 'zod'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import Avatar, { AvatarSize } from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import MediaUpload from "@/components/shared/MediaUpload";
import getChannelByUsername from '@/actions/getChannalByUsername'
import { RightWrongIcon } from "@/components/shared/RightWrongIcon";
import { useToast } from "@/components/ui/use-toast"


interface readyDataType{
  userId: string,
  username: string,
  handle: string,
  imageSrc: string,
}

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}


export default function SettingPage({ searchParams }: PageProps) {

  const encodedUrl = searchParams.e as string;
  const decodedUrl = decodeURIComponent(encodedUrl as string)

  const currentUser = useContext(CurrentUserContext);
  const currentChannel = useContext(CurrentChannelContext);
  const router = useRouter()

  const previousImgSrc = currentChannel?.imageSrc;
  const previousUsername = currentChannel?.username;
  const { toast } = useToast()

  useEffect(() => {
    if (!currentUser || !currentChannel) {
      if (decodedUrl === "") {
        router.push("/");
      } else{
        router.push(decodedUrl);
      }
      toast({
        variant: "error",
        title: "Unauthorized request.",
      });
    }
  }, [currentUser, currentChannel, decodedUrl, router, toast]); 


  const [tryUsername, setTryUsername] = useState<string>(currentChannel?.username || "");

  const channelSchema = z.object({
      username: z.string()
        .min(1, {
        message: "Username at least contains 1 character",
        })
        .max(25, {
          message: "Username at most contains 25 character",
        }),
      imageSrc: z.string(),
      })
        .superRefine(({ username }, checkUsernameContent) => {
          const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
          const containsLowercase = (ch: string) => /[a-z]/.test(ch);
          const containsSpecialChar = (ch: string) =>
            /[_\-/\\]/.test(ch);
          let countOfUpperCase = 0,
            countOfLowerCase = 0,
            countOfNumbers = 0,
            countOfSpecialChar = 0;
          for (let i = 0; i < username.length; i++) {
            let ch = username.charAt(i);
            if (!isNaN(+ch)) countOfNumbers++;
            else if (containsUppercase(ch)) countOfUpperCase++;
            else if (containsLowercase(ch)) countOfLowerCase++;
            else if (containsSpecialChar(ch)) countOfSpecialChar++;
          }
          if (
            countOfNumbers+countOfUpperCase+countOfLowerCase+countOfSpecialChar !== username.length
          ) {
            checkUsernameContent.addIssue({
              code: "custom",
              path: ["username"],
              message: "Username can only contain _-/\\ as special characters",
            });
          }
        })
        .refine(({ username,  imageSrc}) => username !== previousUsername || imageSrc !== previousImgSrc,
        {
          path: ["username"],
          message: "No change has been made.",
        })
        

        
    const form = useForm<z.infer<typeof channelSchema>>({
      resolver: zodResolver(channelSchema),
      defaultValues: {
        username: currentChannel?.username || "",
        imageSrc: currentChannel?.imageSrc || "",
      },
    })

  const { register, handleSubmit, formState: { errors }, watch, setValue} = form

  const imageSrc = watch("imageSrc");

  const handleImageUpload = (value: string) => {
    setValue("imageSrc", value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const {data: isUnique, isLoading} = useQuery({
      queryKey: ['isUsernameUniqueForUpdate', tryUsername],
      queryFn: async() => await getChannelByUsername({username: tryUsername}),
  });

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationKey: ["UpdateChannel", tryUsername],
    mutationFn: async(readyData: readyDataType) => await fetch(process.env.NEXT_PUBLIC_SERVER_URL + `/api/update-channel/${currentUser!.id}`, {
      method: "POST",
      body: JSON.stringify(readyData),
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
    
    }),

    onSuccess: () => {
      if (decodedUrl === "") {
        router.push("/");
      } else{
        router.push(decodedUrl);
        router.refresh();
      }
      toast({
        variant: "success",
        title: "Success",
        description: "Changes saved.",
      });
    },

    onError: () => toast({
      variant: "error",
      title: "Error",
      description: "Something went wrong, please try again.",
    })
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {

    const readyData = {
      userId: currentUser!.id,
      username: data.username,
      handle: data.handle,
      imageSrc: data.imageSrc,
    }
    
    mutateAsync(readyData);
  };

  const handleCancel = () => {  
    if (decodedUrl === "") {
      router.push("/");
      router.refresh();
    } else{
      router.push(decodedUrl);
      router.refresh();
    }
  }

    return (
    <>
      <title>Create Channel </title>
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <h1 className='text-2xl font-semibold'>
              Change your preference
            </h1>
            <Avatar size={AvatarSize.large} imageSrc={imageSrc} />
             <MediaUpload onChange={handleImageUpload}>
                <Button type="primary">Upload picture</Button>
            </MediaUpload>
          </div>

          <div className='grid gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-2'>
              <div className='grid gap-1 py-2 space-y-2'>
                  <Label htmlFor={"email"+currentUser?.id}>Email</Label>
                  <div className='relative'> 
                    <Input
                      className={cn({
                        'focus-visible:ring-red-500':
                          errors.username,
                      }, 'mr-6 text-lg'
                      )}
                      id={"email"+currentUser?.id}
                      value={currentUser?.email as string}
                      disabled={true}
                    />
                  </div>
                </div>

                <div className='grid gap-1 py-2 space-y-2'>
                  <Label htmlFor={"username"+tryUsername}>Username</Label>
                  <div className='relative'> 
                    <Input
                      {...register('username')}
                      className={cn({
                        'focus-visible:ring-red-500':
                          errors.username,
                      }, 'mr-6 text-lg'
                      )}
                      placeholder='username'
                      id={"username"+tryUsername}
                      value={tryUsername}
                      onChange={(ev) => setTryUsername(ev.target.value)}
                      maxLength={25}
                    />
                    <div className='absolute right-2 top-2'>
                    { tryUsername ? (isLoading ? (<Loader2 className='h-6 w-6 animate-spin' />) : ( (isUnique || tryUsername === previousUsername) ? (<RightWrongIcon isCorrect={true} />) : <RightWrongIcon isCorrect={false} />)) : null}
                    </div>
                  </div>
                  {errors?.username && (
                    <p className='text-sm text-red-500'>
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <UIButton disabled={isPending || isLoading} className='text-lg'>
                  {isPending && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Confirm Changes
                </UIButton>

              </div>
            </form>
              <UIButton onClick={handleCancel} disabled={isPending || isLoading} className='text-lg bg-gray-400 text-primary-foreground hover:bg-slate-400/80'>
                Cancel
              </UIButton>
          </div>
        </div>
      </div>
    </>
  )
}
