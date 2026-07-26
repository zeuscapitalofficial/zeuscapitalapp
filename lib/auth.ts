import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  getPasswordResetHtml,
  getVerificationHtml,
  sendEmail,
} from "@/lib/email";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(`[BetterAuth] sendResetPassword callback triggered for: ${user.email}`);
      console.log(`[BetterAuth] Reset URL generated: ${url}`);
      const html = getPasswordResetHtml(user.name || "User", url);
      await sendEmail({
        to: user.email,
        subject: "Reset your Zeus Capital password",
        html,
        text: `Click the link to reset your password: ${url}`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const html = getVerificationHtml(user.name || "User", url);
      await sendEmail({
        to: user.email,
        subject: "Verify your Zeus Capital email address",
        html,
        text: `Click the link to verify your email address: ${url}`,
      });
    },
  },
});
