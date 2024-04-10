import dayjs from "@/vendor/dayjs";
import { compactNumberFormat } from "@/lib/numUtils";
import PosterForCommunity from "@/components/shared/PosterForCommunity";
import getCommunityByName from "@/actions/getCommunityByName";
import LikeDislikeCommunityButton from "@/components/community/LikeDislikeCommunityButton";
import { notFound } from "next/navigation";
import { CommunityComponentsWrapper } from "@/components/community/CommunityComponentsWrapper";

interface CommunityPageParams {
    communityName?: string;
  }

export default async function CommunityPage({
    params,
  }: {
    params: CommunityPageParams;
  }) {

    const { communityName } = params;
    const community =  await getCommunityByName({communityName});

    return community ? <CommunityComponentsWrapper community={community}/>
    : (
        notFound()
    );
}