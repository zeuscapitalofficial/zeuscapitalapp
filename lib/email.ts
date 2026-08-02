import { Resend } from "resend";
import { getPasswordResetHtml } from "./emails/password-reset";
import { getVerificationHtml } from "./emails/verification";

export { getVerificationHtml, getPasswordResetHtml };

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Zeus Capital <onboarding@resend.dev>";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  idempotencyKey,
}: SendEmailParams) {
  if (resend) {
    const { data, error } = await resend.emails.send(
      {
        from: RESEND_FROM_EMAIL,
        to: [to],
        subject,
        html,
        text,
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );

    if (error) {
      console.error(`[Resend_ERROR] Failed to send email to ${to}:`, error.message);
      return { success: false, error };
    }

    console.log(`[Resend] Email successfully sent to ${to} (ID: ${data?.id})`);
    return { success: true, id: data?.id };
  }

  console.log("\n=========================================");
  console.log(
    `[Resend_LOGGER] (RESEND_API_KEY missing in .env, logging to console)`
  );
  console.log(`To:      ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text:    ${text}`);
  console.log("=========================================\n");
  return { success: true, mocked: true };
}
