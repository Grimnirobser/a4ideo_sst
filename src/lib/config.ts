import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/vendor/db";
import { AuthOptions } from "next-auth";
import { Config } from 'sst/node/config'
import { PrismaClient } from "@prisma/client";



export const authOptions: AuthOptions = {
    // adapter: PrismaAdapter(prisma),
    adapter: PrismaAdapter(prisma as unknown as PrismaClient),  // make typescript happy since currently next-auth not support extended prisma
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: Config.GOOGLE_CLIENT_SECRET as string,
        authorization: {
          params: {
            prompt: "consent",
            access_type: "offline",
            response_type: "code"
          }
        }
      }),
    ],
    callbacks: {
      async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      }
    },
    pages: {
      signIn: "/",
    },
    debug: process.env.NODE_ENV === "development",
    session: {
      strategy: "jwt",
      // maxAge: 5 * 60 * 60 // 5 hours
    },
    secret: Config.NEXTAUTH_SECRET,
  };
  
  