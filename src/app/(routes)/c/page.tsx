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
import Link from 'next/link'
import { useForm, FieldValues, SubmitHandler, set } from "react-hook-form";
import { CurrentUserContext } from "@/context/CurrentUserContext";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useContext, useState, useEffect } from "react";
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

export default function CreateCommunityPage() {

  const currentUser = useContext(CurrentUserContext);
  const currentChannel = useContext(CurrentChannelContext);
  const router = useRouter()
  const { toast } = useToast()

  const channelSchema = z.object({
      username: z.string()
        .min(1, {
        message: "Username at least contains 1 character",
        }),
      imageSrc: z.string(),
      })

        
    const form = useForm<z.infer<typeof channelSchema>>({
      resolver: zodResolver(channelSchema),
      defaultValues: {
        username: "",
        imageSrc: "",
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
      queryKey: ['isUsernameUnique', tryUsername],
      queryFn: async() => await getChannelByUsername({username: tryUsername}),

  });

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationKey: ["createChannel", tryUsername],
    mutationFn: async(readyData: readyDataType) => await fetch(process.env.NEXT_PUBLIC_SERVER_URL + `/api/channels/${currentUser!.id}`, {
      method: "POST",
      body: JSON.stringify(readyData),
      headers: {
        'Accept': 'application/json',
        "Content-Type": "application/json",
      },
    
    }),

    onSuccess: () => {
      router.push(`/c/${communityId}`);
      toast({
        variant: "success",
        title: "Success",
        description: "Channel successfully created.",
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


  if (!checked) {
    return null;
  }

    return (
    <>
      <title>Create Community </title>
      <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <h1 className='text-2xl font-semibold'>
              Creating a channel 
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
                    { tryUsername ? (isLoading ? (<Loader2 className='h-6 w-6 animate-spin' />) : ( isUnique ? (<RightWrongIcon isCorrect={true} />) : <RightWrongIcon isCorrect={false} />)) : null}
                    </div>
                  </div>
                  {errors?.username && (
                    <p className='text-sm text-red-500'>
                      {errors.username.message}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            
                  By creating a channel, you agree to our
                
                  <div>
                    <Link
                      className={buttonVariants({
                        variant: 'link',
                        className: 'gap-1.5 text-blue-500 cursor-pointer',
                      })}
                      href='/terms'>
                      Terms
                      </Link>
                      &
                      <Link
                        className={buttonVariants({
                          variant: 'link',
                          className: 'gap-1.5 text-blue-500 cursor-pointer',
                        })}
                        href='/privacy-policy'>
                        Privacy
                      </Link>
                  </div>
                </div>

                <UIButton disabled={isPending || isLoading} className='text-lg'>
                  {isPending && (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  )}
                  Create Channel
                </UIButton>

              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
