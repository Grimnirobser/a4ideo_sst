'use client';

import { Community } from "@prisma/client";
import dayjs from "@/vendor/dayjs";
import { compactNumberFormat } from "@/lib/numUtils";
import PosterForCommunity from "@/components/shared/PosterForCommunity";
import LikeDislikeCommunityButton from "@/components/community/LikeDislikeCommunityButton";
import { ArrowRight } from 'lucide-react'
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query"
import checkChannelMembership from "@/actions/checkChannelMembership";
import { useContext, useState } from "react";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";


interface CommunityComponentsWrapperParams {
    community: Community;
}

// have to do this, wrap all the community components in a single client component
// so problemset section and community player section can communicate
export const CommunityComponentsWrapper = ({
    community, 
}: CommunityComponentsWrapperParams) => {
    const router = useRouter();
    const currentChannel = useContext(CurrentChannelContext);
    const {data: isMember, isLoading} = useQuery({
      queryKey: ['checkChannelMembership', currentChannel?.id, community.id],
      queryFn: async() => await checkChannelMembership({communityId: community.id}),
    });

    
    return (
        <div className="flex bg-slate-100 max-w-screen h-full mx-12 md:mx-24 py-8 gap-8">
        <div className="flex size-60 aspect-w-2 aspect-h-3">
            <PosterForCommunity community={community} questions={null} foot={false}/>
        </div>

        <div className="flex flex-col w-full h-full space-y-6 items-start">

            <h1 className="top-6 line-clamp-2 text-xl font-medium italic w-full">
                /{community.name}
            </h1>

            {isMember ? 
            <p className="inline-flex items-center italic text-green-500 justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            You have passed the entrance problemset
            </p>
            : <h2 onClick={() => router.push(`/`)}
            className="inline-flex items-center hover:underline decoration-rose-500 justify-center cursor-pointer whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            <p className='text-rose-500 italic'> 
                Give entrance problemsets a try
            </p>
            <ArrowRight className='h-4 w-4' color='red'/>
            </h2>}

            
            <div className="whitespace-pre-line text-sm text-neutral-400 w-full">
                    {community.description.split("\n").map((line, index) => {
                    return line === "" ? (
                        <br key={index} />
                    ) : (
                        <p key={index}>{line}</p>
                    );
                    })}
            </div>
            
            <div className="space-y-2">
                <p className="text-neutral-400 text-sm">
                    {dayjs(community.createdAt).fromNow()}
                    <span className="italic">{' '}this community was created</span>
                </p>
                <p className="text-neutral-400 text-sm">
                    {compactNumberFormat(community.memberCount)} 
                    <span className="italic">{' '}members have passed the entrance problemset</span>
                </p>
                <p className="text-neutral-400 text-sm items-end">
                {compactNumberFormat(community.likeCount + community.dislikeCount)} 
                <span className="italic"> {' '}total votes collected</span>
                </p>
                <LikeDislikeCommunityButton community={community}/>
            </div>
    </div>


    </div>
    );

}