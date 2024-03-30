'use server';

import prisma from "@/vendor/db";
import { Community } from "@prisma/client";

interface GetCommunityByNameParams {
  communityName: string;
}

export default async function getCommunityByName(
  params: GetCommunityByNameParams
): Promise<Community> {
  try {
    const { communityName } = params;

    const query: any = {};

    if (communityName) {
      query.name = communityName;
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
