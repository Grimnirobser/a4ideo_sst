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
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { CurrentUserContext } from "@/context/CurrentUserContext";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";
import { useContext } from "react";
import { toast } from "react-hot-toast";
import { ZodError, z } from 'zod'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Avatar, { AvatarSize } from "@/components/shared/Avatar";
import Button from "@/components/shared/Button";
import MediaUpload from "@/components/shared/MediaUpload";
import getChannelByUsername from '@/actions/getChannelByUsername'

interface readyDataType{
  userId: string,
  username: string,
  handle: string,
  imageSrc: string,
}


export default function UpdateChannelPage() {

    const currentUser = useContext(CurrentUserContext);
    const currentChannel = useContext(CurrentChannelContext);
    const router = useRouter()
    
    const channelSchema = z.object({
        username: z.string()
          .min(1, {
          message: "Username at least contains 1 character",
          })
          .max(20, {
            message: "Username at most contains 20 character",
          }),
        imageSrc: z.string(),
        })
          .superRefine(({ username }, checkUsernameComplexity) => {
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
              checkUsernameComplexity.addIssue({
                code: "custom",
                path: ["username"],
                message: "Username can only contain '_-/\\' as special characters",
              });
            }
          })
          .superRefine(({ username }, checkUsernameUniqueness) => {
            const existingChannel = await getChannelByUsername({username});
            if (existingChannel && existingChannel.username === username) {
              checkUsernameUniqueness.addIssue({
                code: "custom",
                path: ["username"],
                message: "Username already exists. Please choose another one.",
              });
            }
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
  
  
    const { mutate, mutateAsync, isPending } = useMutation({
      mutationKey: ["createChannel"],
      mutationFn: async(readyData: readyDataType) => await createChannel(readyData),
  
      onSuccess: () => {
        toast.success("Channel created successfully.");
        router.back();
        router.refresh();
      },
  
      onError: () => toast.error("Could not create a channel.")
    })
  
    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
  
      const readyData = {
        userId: currentUser!.id,
        username: data.username,
        imageSrc: data.imageSrc,
      }
      
      mutateAsync(readyData);
    };
  
  
    if (!currentUser) {
      router.push("/");
      toast.error("Please sign in to create a channel.");
      return;
    }else if(currentChannel) {
      router.push("/");
      return;
    }else{
      return (
      <>
        <title>Create Channel </title>
        <div className='container relative flex pt-20 flex-col items-center justify-center lg:px-0'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
            <div className='flex flex-col items-center space-y-2 text-center'>
              {/* <Icons.logo className='h-20 w-20' /> */}
              <h1 className='text-2xl font-semibold tracking-tight'>
                Join In A4ideo
              </h1>
              <Avatar size={AvatarSize.large} imageSrc={imageSrc} />
               <MediaUpload onChange={handleImageUpload}>
                  <Button type="primary">Upload picture</Button>
              </MediaUpload>
            </div>
  
            <div className='grid gap-6'>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='grid gap-2'>
                  <div className='grid gap-1 py-2'>
                    <Label htmlFor={"username"+currentUser.id}>Username</Label>
                    <Input
                      {...register('username')}
                      className={cn({
                        'focus-visible:ring-red-500':
                          errors.username,
                      })}
                      placeholder='username'
                      id={"username"+currentUser.id}
                    />
                    {errors?.username && (
                      <p className='text-sm text-red-500'>
                        {errors.username.message}
                      </p>
                    )}
                  </div>
  
                  <div className='grid gap-1 py-2'>
                    <Label htmlFor={"handle"+currentUser.id}>Handle</Label>
                    <Input
                      {...register('handle')}
                      type='handle'
                      className={cn({
                        'focus-visible:ring-red-500':
                          errors.handle,
                      })}
                      placeholder='handle'
                      id={"handle"+currentUser.id}
                    />
                    {errors?.handle && (
                      <p className='text-sm text-red-500'>
                        {errors.handle.message}
                      </p>
                    )}
                  </div>
                  
                  <h2 className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    By create a channel, you agree to our
                  <Link
                    className={buttonVariants({
                      variant: 'link',
                      className: 'gap-1.5',
                    })}
                    href='/terms'>
                    Terms
                    </Link>
                    &
                    <Link
                      className={buttonVariants({
                        variant: 'link',
                        className: 'gap-1.5',
                      })}
                      href='/privacy-policy'>
                      Privacy
                    </Link>
                  </h2>
  
                  <UIButton disabled={isPending} className='text-lg'>
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
    )}
  }
  