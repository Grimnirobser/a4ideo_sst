'use client';

import { Community } from "@prisma/client";
import dayjs from "@/vendor/dayjs";
import { compactNumberFormat } from "@/lib/numUtils";
import PosterForCommunity from "@/components/shared/PosterForCommunity";
import LikeDislikeCommunityButton from "@/components/community/LikeDislikeCommunityButton";
import { CurrentChannelContext } from "@/context/CurrentChannelContext";

interface CommunityComponentsWrapperParams {
    community: Community;
}

// have to do this, wrap all the community components in a single client component
// so problemset section and community player section can communicate
export const CommunityComponentsWrapper = ({
    community, 
}: CommunityComponentsWrapperParams) => {
    

    return (
        <div className="flex bg-slate-100 w-full h-full mx-12 md:mx-24 py-8 gap-8">
        <div className="flex size-60 aspect-w-2 aspect-h-3">
            <PosterForCommunity community={community} questions={null} foot={false}/>
        </div>

        <div className="flex flex-col w-full h-full space-y-6 items-start">
            <h1 className="top-6 line-clamp-2 text-xl font-medium italic">
                /{community.name}
            </h1>

            <div className="whitespace-pre-line text-sm text-neutral-400">
                    {community.description.split("\n").map((line, index) => {
                    return line === "" ? (
                        <br key={index} />
                    ) : (
                        <p key={index}>{line}</p>
                    );
                    })}
            </div>

            <p className="text-neutral-400 text-sm">
                Community created {dayjs(community.createdAt).fromNow()}
            </p>

            <p className="text-neutral-400 text-sm">
                {compactNumberFormat(community.memberCount)} 
                <span className="italic">{' '}members have passed the entrance problemset</span>
            </p>
            
            <div className="gap-4">
                <p className="text-neutral-400 text-sm items-end">
                {compactNumberFormat(community.likeCount + community.dislikeCount)} 
                <span className="italic"> {' '}Total Votes collected</span>
                </p>
                <LikeDislikeCommunityButton community={community}/>
            </div>
    </div>


    </div>
    );

}