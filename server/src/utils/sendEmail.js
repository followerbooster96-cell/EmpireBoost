import nodemailer from "nodemailer";

const getRequiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing in .env`);
  }

  return value;
};

const createTransporter = () => {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const fromName = process.env.MAIL_FROM_NAME || "EmpireBoost";
  const fromEmail = getRequiredEnv("MAIL_FROM_EMAIL");

  const transporter = createTransporter();

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};

export const buildPasswordResetEmail = ({ resetUrl }) => {
  const subject = "Reset your EmpireBoost password";

  const text = `
You requested a password reset for your EmpireBoost account.

Open this link to create a new password:
${resetUrl}

This link expires in 30 minutes.

If you did not request this, you can ignore this email.
`;

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Reset your EmpireBoost password</title>
  </head>

  <body style="margin:0;padding:0;background:#050914;font-family:Arial,Helvetica,sans-serif;color:#e5f0ff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#050914;padding:32px 14px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:linear-gradient(145deg,#081226,#030815);border:1px solid rgba(147,197,253,0.18);border-radius:26px;overflow:hidden;box-shadow:0 28px 80px rgba(0,0,0,0.45);">
            <tr>
              <td style="padding:34px 34px 10px;">
                <div style="display:inline-block;padding:10px 14px;border-radius:999px;background:rgba(37,99,235,0.18);border:1px solid rgba(147,197,253,0.22);font-size:12px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#bfdbfe;">
                  EmpireBoost Security
                </div>

                <h1 style="margin:22px 0 10px;font-size:34px;line-height:1.05;color:#ffffff;letter-spacing:-1px;">
                  Reset your password
                </h1>

                <p style="margin:0;color:#9fb2cf;font-size:15px;line-height:1.65;font-weight:600;">
                  We received a request to reset the password for your EmpireBoost account.
                  Click the button below to create a new password.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:22px 34px;">
                <a href="${resetUrl}" style="display:block;text-align:center;text-decoration:none;padding:16px 20px;border-radius:16px;background:linear-gradient(135deg,#2563eb,#4f46e5 48%,#0ea5e9);color:#ffffff;font-size:15px;font-weight:900;box-shadow:0 18px 42px rgba(37,99,235,0.35);">
                  Reset password
                </a>
              </td>
            </tr>

            <tr>
              <td style="padding:0 34px 24px;">
                <p style="margin:0;color:#8fa4c2;font-size:13px;line-height:1.6;">
                  This link expires in <strong style="color:#ffffff;">30 minutes</strong>.
                  If the button does not work, copy and paste this link into your browser:
                </p>

                <p style="margin:12px 0 0;word-break:break-all;color:#93c5fd;font-size:12px;line-height:1.55;">
                  ${resetUrl}
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:18px 34px 34px;border-top:1px solid rgba(147,197,253,0.12);">
                <p style="margin:0;color:#64748b;font-size:12px;line-height:1.6;">
                  If you did not request this password reset, you can safely ignore this email.
                  Your password will not change unless you open the link and create a new one.
                </p>
              </td>
            </tr>
          </table>

          <p style="margin:18px 0 0;color:#475569;font-size:12px;">
            EmpireBoost • Secure account recovery
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  return {
    subject,
    text,
    html,
  };
};