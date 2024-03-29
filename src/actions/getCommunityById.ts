'use server';

import prisma from "@/vendor/db";
import { Community, Problemset } from "@prisma/client";

interface GetCommunityByIdParams {
  communityId: string;
}

export default async function getCommunityById(
  params: GetCommunityByIdParams
): Promise<Community> {
  try {
    const { communityId } = params;

    const query: any = {};

    if (communityId) {
      query.id = communityId;
    }

    const community = await prisma.community.findUnique({
      where: query,
    });

    if (!community) {
      throw new Error("Community not found");
    }

    return community;
  } catch (error: any) {
    throw new Error(error);
  }
}
