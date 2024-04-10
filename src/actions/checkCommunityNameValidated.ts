'use server';

import prisma from "@/vendor/db";

interface GetCommunityByUsernameParams {
  name: string;
}

export default async function checkCommunityNameValidated(
  params: GetCommunityByUsernameParams
): Promise<Boolean> {
  try {
    const { name } = params;

    if (!name || name.length === 0 || name.length > 100 || /^[a-zA-Z0-9_\-]+$/.test(name) === false) {
        return false;
    }

    const community = await prisma.community.findFirst({
      where: {
        name: name,
      },
    });

    if (!community) {
        return true;
    }else{
        return false;
    }

  } catch (error: any) {
    throw new Error(error);
  }
}
