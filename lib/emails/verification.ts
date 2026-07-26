import { getEmailLayout } from "./layout";

export function getVerificationHtml(name: string, url: string): string {
  const content = `
    <h1 style="font-size: 28px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2; margin-top: 0; margin-bottom: 21px; color: #000000;">
      Verify your email address
    </h1>
    <p style="font-size: 16px; line-height: 1.6; color: rgba(0, 0, 0, 0.7); margin-bottom: 34px;">
      Hello ${name},<br><br>
      Welcome to Zeus Capital. To get started and secure your account, please verify your email address by clicking the button below.
    </p>
    <div style="text-align: center; margin-bottom: 34px;">
      <a href="${url}" style="background-color: #000000; color: #ffffff; display: inline-block; padding: 13px 34px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 14px;">
        Verify Email Address
      </a>
    </div>
    <p style="font-size: 13px; line-height: 1.6; color: rgba(0, 0, 0, 0.55); margin-bottom: 0;">
      If you did not sign up for a Zeus Capital account, you can safely ignore this email. This link will expire in 24 hours.
    </p>
    <hr style="border: 0; border-top: 1px solid rgba(0,0,0,0.08); margin: 24px 0;">
    <p style="font-size: 12px; line-height: 1.6; color: rgba(0, 0, 0, 0.55); word-break: break-all; margin: 0;">
      Button not working? Copy and paste this URL into your browser:<br>
      <a href="${url}" style="color: #000000;">${url}</a>
    </p>
  `;
  return getEmailLayout("Verify your email address", content);
}
