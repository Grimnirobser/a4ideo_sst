import { Auth } from "sst/constructs";

const auth = new Auth(stack, "auth", {
  authenticator: {
    handler: "packages/functions/src/auth.handler",
  },
});

auth.attach(stack, {
  api,
  prefix: "/auth", // optional
});