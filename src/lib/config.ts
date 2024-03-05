import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/vendor/db";
import { AuthOptions } from "next-auth";
import { Config } from 'sst/node/config'


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: Config.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    pages: {
      signIn: "/",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
      strategy: "jwt",
    },
    secret: Config.NEXTAUTH_SECRET,
  };
  
  