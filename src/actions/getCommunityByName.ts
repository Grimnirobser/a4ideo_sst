'use server';

import prisma from "@/vendor/db";
import { Community } from "@prisma/client";

interface GetCommunityByNameParams {
  communityName?: string;
}

export default async function getCommunityByName(
  params: GetCommunityByNameParams
): Promise<Community | null> {
  try {
    const { communityName } = params;

    const query: any = {};

    if (communityName) {
      query.name = communityName;
    }

    const community = await prisma.community.findUnique({
      where: query,
    });

    return community;
  } catch (error: any) {
    throw new Error(error);
  }
}
