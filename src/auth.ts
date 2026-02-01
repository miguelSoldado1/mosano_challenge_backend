import { betterAuth } from "better-auth";
import dotenv from "dotenv";

dotenv.config();

export const auth = betterAuth({
  trustedOrigins: [process.env.FRONTEND_URL as string],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    // this should only be used for educational purposes to allow for cross-site cookies
    defaultCookieAttributes: {
      sameSite: "none",
      httpOnly: true,
      secure: false,
    },
  },
});
