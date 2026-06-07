import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(to: string, resetLink: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || "no-reply@carbazaar.local";

  if (!host || !user || !pass) {
    console.warn("SMTP not configured. Reset link:", resetLink);
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to,
    subject: "Car Bazaar password reset",
    html: `
      <p>You requested to reset your password.</p>
      <p><a href="${resetLink}">Click here to reset your password</a></p>
      <p>This link expires in 1 hour.</p>
    `,
  });
}
