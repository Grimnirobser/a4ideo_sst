import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/vendor/db";
import { AuthOptions } from "next-auth";
import { Config } from 'sst/node/config'
import { PrismaClient } from "@prisma/client";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer"

interface EmailRequestParams {
  identifier: string;
  url: string;
  provider: { server: any, from: string }
}

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
      // EmailProvider({
      //   server: {
      //     host: Config.AWS_SMTP_ENDPOINT as string,
      //     port: 465,
      //     auth: {
      //       user: Config.AWS_SMTP_USERNAME as string,
      //       pass: Config.AWS_SMTP_PASSWORD as string,
      //     }
      //   },
      //   from: process.env.EMAIL_FROM as string,
      //   sendVerificationRequest({
      //     identifier: email,
      //     url,
      //     provider: { server, from },
      //   }){
      //     sendVerificationRequestSES({ identifier: email, url, provider: { server, from }})
      //   }
      // }),
    ],
    callbacks: {
      async redirect({ url, baseUrl }) {
        if (url.startsWith("/")) return `${baseUrl}${url}`
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
      maxAge: 5 * 60 * 60 // 5 hours
    },
    secret: Config.NEXTAUTH_SECRET,
  };
  
  
  async function sendVerificationRequestSES(params: EmailRequestParams) {
    const { identifier, url, provider} = params
    const { host } = new URL(url)

    const transport = createTransport({
      ...provider.server,
      secure: true,
      debug: process.env.NODE_ENV === "development",
    });

    const result = await transport.sendMail({
      to: identifier,
      from: provider.from,
      subject: `Sign in to ${host}`,
      text: text({ url, host }),
      html: html({ url, host }),
    })
    const failed = result.rejected.concat(result.pending).filter(Boolean)
    if (failed.length) {
      throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
    }
  }
    
  function html(params: { url: string, host: string}) {
    const { url, host} = params
  
    const escapedHost = host.replace(/\./g, "&#8203;.")
  
    const brandColor = "#346df1"
    const color = {
      background: "#f9f9f9",
      text: "#444",
      mainBackground: "#fff",
      buttonBackground: brandColor,
      buttonBorder: brandColor,
      buttonText: "#fff",
    }
  
    return `
  <body style="background: ${color.background};">
    <table width="100%" border="0" cellspacing="20" cellpadding="0"
      style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
      <tr>
        <td align="center"
          style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          Sign in to <strong>${escapedHost}</strong>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table border="0" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                  target="_blank"
                  style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Sign
                  in</a></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center"
          style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
          If you did not request this email you can safely ignore it.
        </td>
      </tr>
    </table>
  </body>
  `
  }
  
  /** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
  function text({ url, host }: { url: string, host: string }) {
    return `Sign in to ${host}\n${url}\n\n`
  }