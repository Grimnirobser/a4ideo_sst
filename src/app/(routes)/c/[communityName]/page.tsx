import dayjs from "@/vendor/dayjs";
import { compactNumberFormat } from "@/lib/numUtils";
import PosterForCommunity from "@/components/shared/PosterForCommunity";
import getCommunityByName from "@/actions/getCommunityByName";
import LikeDislikeCommunityButton from "@/components/community/LikeDislikeCommunityButton";

interface CommunityPageParams {
    communityName: string;
  }

export default async function CommunityPage({
    params,
  }: {
    params: CommunityPageParams;
  }) {

    const { communityName } = params;
    const community =  await getCommunityByName({communityName});

    return (

        <div className="bg-slate-100 h-full space-y-4">
            <div className="grid grid-cols-5 grid-flow-row gap-2 mx-20">
                <div className="col-span-1 aspect-w-2 aspect-h-3">
                    <PosterForCommunity community={community} questions={null}/>
                </div>

                    <div className="col-span-4 space-y-6">
                        <h3 className="top-6 line-clamp-2 text-xl font-medium italic">
                            {community.name}
                        </h3>

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
                            {compactNumberFormat(community.memberCount)} members passed entrance test
                        </p>
                        
                        <div className="text-neutral-400 text-sm">
                            <p>Total Votes collected {compactNumberFormat(community.likeCount + community.dislikeCount)}</p>
                        </div>

                        <LikeDislikeCommunityButton community={community}/>

                </div>
            </div>

            {/* <div className="flex flex-col items-center gap-4">
                { posts.map((post, index) => 
                    <Post key={index} {...post}/>
                )}
            </div> */}

        </div>
    )
}