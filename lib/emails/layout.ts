export function getEmailLayout(title: string, contentHtml: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          body {
            background-color: #F5F5F5;
            color: #000000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            margin: 0;
            padding: 40px 20px;
            -webkit-font-smoothing: antialiased;
          }
          .email-wrapper {
            max-width: 580px;
            margin: 0 auto;
          }
          .email-card {
            background-color: #FFFFFF;
            border-radius: 21px;
            border: 1px solid rgba(0, 0, 0, 0.08);
            padding: 40px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
          }
          .email-header {
            margin-bottom: 34px;
            text-align: center;
          }
          .logo-text {
            font-size: 21px;
            font-weight: 600;
            letter-spacing: -0.03em;
            color: #000000;
            text-transform: uppercase;
          }
          .email-footer {
            margin-top: 40px;
            text-align: center;
            font-size: 13px;
            color: rgba(0, 0, 0, 0.55);
            line-height: 1.6;
          }
          .email-footer a {
            color: #000000;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-card">
            <div class="email-header">
              <span class="logo-text">Zeus Capital</span>
            </div>
            ${contentHtml}
          </div>
          <div class="email-footer">
            <p>
              This is an automated transactional message. You are receiving this because you registered for a Zeus Capital account.
            </p>
            <p>
              &copy; ${new Date().getFullYear()} Zeus Capital. All rights reserved.<br>
              100 Wealth Boulevard, Suite 500, New York, NY 10005
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
