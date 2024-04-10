"use client";

import { Problemset, Problem, Video, Channel} from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dayjs from "@/vendor/dayjs";
import { compactNumberFormat } from "@/lib/numUtils";
import { useQuery, useMutation } from "@tanstack/react-query"
import getVideoById from "@/actions/getVideoById";
import Avatar, { AvatarSize } from "./Avatar";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { set } from "react-hook-form";



interface HomePageProblemsetProps {
  problemset: Problemset & {channel: Channel} & {problems: Problem[]};
}

const HomePageProblemset: React.FC<HomePageProblemsetProps> = ({ problemset }) => {

  const {data: video, isLoading} = useQuery({
    queryKey: ['problemsetVideo', problemset.videoId],
    queryFn: async() => await getVideoById({ videoId: problemset.videoId}),
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchInterval: 0,
  });
    const [questionIndex, setQuestionIndex] = useState(0);

    const activeStyles = 'active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300'
    const inactiveStyles = 'hidden text-gray-400'

  if (!video) return null;

  return (

        <div className="group bg-white hover:bg-slate-50 border rounded-md">
            <Link className="w-full h-full" href={`/video/${video.id}?psid=${problemset.id}`}>
            <div className="flex items-start flex-col cursor-pointer overflow-hidden px-2 py-2 w-full h-full">
                
                <div className="flex flex-row justify-between gap-2 items-center w-full h-full">
                    <Image
                    unoptimized
                    className="object-contain object-center rounded-md"
                    alt={`${video.title} thumbnail`}
                    src={video!.imageSrc}
                    width={100}
                    height={150}
                    />


                    <div className="relative w-full h-full">
                    <div className='absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition'>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setQuestionIndex((prev) => prev - 1);
                            }}
                            className={cn(activeStyles, 'left-0 top-4 transition', {
                                [inactiveStyles]: questionIndex === 0,
                                'hover:bg-primary-300 text-primary-800 opacity-100':
                                questionIndex !== 0,
                            })}
                            aria-label='previous question'>
                            <ChevronLeft className='h-4 w-4 text-zinc-700' />{' '}
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setQuestionIndex((prev) => prev + 1);
                            }}
                            className={cn(
                                activeStyles,
                                'right-0 top-4 transition',
                                {
                                [inactiveStyles]: questionIndex === problemset.problems.length - 1,
                                'hover:bg-primary-300 text-primary-800 opacity-100':
                                    questionIndex !== problemset.problems.length - 1,
                                }
                            )}
                            aria-label='next question'>
                            <ChevronRight className='h-4 w-4 text-zinc-700' />{' '}
                        </button>
                    </div>


                        <div className="flex w-full h-full items-center indent-4 font-serif text-lg">
                            {problemset.problems[questionIndex].question}
                        </div>
                    </div>
                    
        
                </div>
                      

                        <div className="flex flex-row w-full justify-between place-items-end">
                                <div className="flex flex-col justify-between">
                                    <p className="text-neutral-400 text-sm">
                                        Pass/Attempt: {compactNumberFormat(problemset.passCount)} / {compactNumberFormat(problemset.attemptCount)}
                                    </p>
                                    <p className="text-neutral-400 text-sm">
                                        Like/Vote: {compactNumberFormat(problemset.likeCount)} / {compactNumberFormat(problemset.likeCount + problemset.dislikeCount)}
                                    </p>
                                </div>


                                <div className="flex place-items-end justify-end gap-2">
                                
                                <Avatar className="mt-1" imageSrc={problemset.channel.imageSrc} />
                                <div className="flex flex-col">
                                    <div className="flex gap-2 items-center">
                                        <p className="line-clamp-2 text-md leading-5">
                                        {problemset.channel.username}
                                        </p>
                                    </div>
                                    <p className="text-neutral-400 text-sm">
                                    {compactNumberFormat(problemset.channel.reputation)} reputation
                                    </p>
                                    <p className="text-neutral-400 text-sm">
                                    {dayjs(video.createdAt).fromNow()}
                                    </p>
                                </div>
                            </div>
                            </div>
                </div>
                </Link>
        </div>
  );
};

export default HomePageProblemset;
