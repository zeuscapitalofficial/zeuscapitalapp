import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  getPasswordResetHtml,
  getVerificationHtml,
  sendEmail,
} from "@/lib/email";
import prisma from "@/lib/prisma";

const baseURL = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const secret = process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET;
const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const auth = betterAuth({
  baseURL,
  ...(secret ? { secret } : {}),
  ...(trustedOrigins.length > 0 ? { trustedOrigins } : {}),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
      referralCode: {
        type: "string",
        required: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user, context) => {
          try {
            // Process ref parameter from signup request headers or query
            const req = context?.request;
            let refCode: string | null = null;

            if (req) {
              const url = new URL(req.url);
              refCode = url.searchParams.get("ref");
            }

            if (!refCode && (user as any).referralCodeInput) {
              refCode = (user as any).referralCodeInput;
            }

            // Generate user's own unique referral code
            const ownReferralCode = `zc-${user.id.slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;

            let referrerUser = null;
            if (refCode) {
              referrerUser = await prisma.user.findFirst({
                where: { referralCode: refCode },
              });
            }

            // Update new user's referral code and referrer link
            await prisma.user.update({
              where: { id: user.id },
              data: {
                referralCode: ownReferralCode,
                referredById: referrerUser ? referrerUser.id : null,
                bonusRewards: referrerUser ? 25.0 : 0.0, // Referred user gets $25 signup bonus
              },
            });

            // If user was referred by someone, credit referrer a bigger bonus ($100) and send notifications
            if (referrerUser) {
              const updatedReferrer = await prisma.user.update({
                where: { id: referrerUser.id },
                data: {
                  bonusRewards: { increment: 100.0 }, // Referrer gets $100 bonus
                },
              });

              // Send in-app notification to Referrer
              await prisma.notification.create({
                data: {
                  userId: referrerUser.id,
                  title: "Referral Bonus Received! 🎉",
                  message: `${user.name || "A new user"} signed up using your referral link! $100.00 USD bonus reward has been added to your balance.`,
                  type: "REWARDS",
                },
              });

              // Send in-app notification to Referred User
              await prisma.notification.create({
                data: {
                  userId: user.id,
                  title: "Welcome Bonus Claimed! 🎁",
                  message: `Welcome to Zeus Capital! $25.00 USD referral welcome bonus has been added to your reward balance.`,
                  type: "REWARDS",
                },
              });
            }
          } catch (error) {
            console.error("[Referral Signup Hook Error]:", error);
          }
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(
        `[BetterAuth] sendResetPassword callback triggered for: ${user.email}`,
      );
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
