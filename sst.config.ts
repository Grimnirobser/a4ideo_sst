import { SSTConfig } from "sst";
import { Config, NextjsSite } from "sst/constructs";


export default {
  config(_input) {
    return {
      name: "a4ideo",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const NEXTAUTH_SECRET = new Config.Secret(stack, "NEXTAUTH_SECRET");
      const GOOGLE_CLIENT_SECRET = new Config.Secret(stack, "GOOGLE_CLIENT_SECRET");
      const CLOUDINARY_UPLOAD_PRESET = new Config.Secret(stack, "CLOUDINARY_UPLOAD_PRESET");
      const HUGGINGFACE_ACCESS_TOKEN = new Config.Secret(stack, "HUGGINGFACE_ACCESS_TOKEN");
      const HUGGINGFACE_INFERENCE_ENDPOINT = new Config.Secret(stack, "HUGGINGFACE_INFERENCE_ENDPOINT");

      const site = new NextjsSite(stack, "web", {
        bind: [NEXTAUTH_SECRET, GOOGLE_CLIENT_SECRET, CLOUDINARY_UPLOAD_PRESET, 
              HUGGINGFACE_ACCESS_TOKEN, HUGGINGFACE_INFERENCE_ENDPOINT],
        // customDomain: {
        //   domainName: "a4ideo.com",
        //   domainAlias: "www.a4ideo.com",
        // },
        warm: 20,
        timeout: "5 seconds",
        memorySize: "2048 MB",
        environment: {
          NEXT_PUBLIC_SERVER_URL: stack.stage === "prod" ? "http://a4ideo.com" : "http://localhost:3000",
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
          NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID!,
          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          DATABASE_URL: process.env.DATABASE_URL!,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
