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
      const AWS_SMTP_ENDPOINT = new Config.Secret(stack, "AWS_SMTP_ENDPOINT");
      const AWS_SMTP_USERNAME = new Config.Secret(stack, "AWS_SMTP_USERNAME");
      const AWS_SMTP_PASSWORD = new Config.Secret(stack, "AWS_SMTP_PASSWORD");

      const site = new NextjsSite(stack, "web", {
        bind: [NEXTAUTH_SECRET, GOOGLE_CLIENT_SECRET, CLOUDINARY_UPLOAD_PRESET, 
              HUGGINGFACE_ACCESS_TOKEN, HUGGINGFACE_INFERENCE_ENDPOINT, 
              AWS_SMTP_ENDPOINT, AWS_SMTP_USERNAME, AWS_SMTP_PASSWORD],
        customDomain: {
          domainName: "a4ideo.com",
          domainAlias: "www.a4ideo.com",
        },
        warm: 50,
        timeout: "30 seconds",
        memorySize: "2048 MB",
        environment: {
          NEXT_PUBLIC_SERVER_URL: stack.stage === "prod" ? "https://a4ideo.com" : "http://localhost:3000",
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
          NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
          DATABASE_URL: process.env.DATABASE_URL!,
          NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
          EMAIL_FROM: process.env.EMAIL_FROM!,
        },
      });
      app.setDefaultFunctionProps({
        timeout: 30,
        memorySize: 512,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
