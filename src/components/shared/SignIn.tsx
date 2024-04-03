'use client';

import { FC } from 'react'
import { Icons } from '@/components/shared/Icons'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '../ui/input';
import { z } from "zod"
import { ArrowBigRight } from 'lucide-react';
import { useState } from 'react';
import { signIn } from "next-auth/react";

interface SignInButtonProps {
    encodedUrl?: string;
}

const SignIn: FC<SignInButtonProps> = ({encodedUrl}) => {

    const [emailAddress, setEmailAddress] = useState<string>('');
    const emailSchema = z.object({
        email: z.string().email(),
    }).safeParse({ email: emailAddress });
    const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
      <div className='h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20 '>
        <div className='container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]'>
      <div className='flex flex-col space-y-2 text-center'>
        <Icons.logo className='mx-auto h-20 w-20'/>
        <h1 className='text-2xl font-semibold tracking-tight'>Log in to A4ideo</h1>
      </div>
      <div className='flex justify-center items-center'>
        <Button
            type='button'
            size='lg'
            variant={'ghost'}
            className='w-full border border-gray-300'
            onClick={() => {signIn("google", { callbackUrl: `/create-channel?e=${encodedUrl}`});setIsLoading(true);}}
            disabled={isLoading}
            >
            <Icons.google className='h-6 w-6 mr-2' />
            Sign in with Google
        </Button>
        </div>

      <div className="flex items-center">
            <div className="flex-grow bg bg-gray-300 h-0.5"></div>
            <div className="flex-grow-0 mx-5 text dark:text-white text-muted-foreground">OR</div>
            <div className="flex-grow bg bg-gray-300 h-0.5"></div>
         </div>
         <p className='px-8 text-center text-sm text-muted-foreground'>
           Enter your email address below and we will send a login link to your email inbox.
        </p>

        <div className='flex flex-row items-center'>
        <Input
            id='email'
            type='email'
            placeholder='Continue with email'
            className='w-full text-base pr-16'
            onChange={(ev) => setEmailAddress(ev.target.value)}
        />

            <button disabled={!emailSchema.success || isLoading} 
                    onClick={() => {signIn("email", { email: emailAddress, callbackUrl: `/create-channel?e=${encodedUrl}`});setIsLoading(true);}}
                    className={`absolute right-24 w-fit rounded-md ${emailSchema.success ? "cursor-pointer bg-sky-300" : "cursor-not-allowed bg-slate-100"}`}>
                <ArrowBigRight className="h-6 w-6"/>
            </button>
        </div>
        </div>
    </div>
  )
}

export default SignIn;