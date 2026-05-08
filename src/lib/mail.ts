import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Smartstack Support" <${process.env.SMTP_FROM}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h1 style="color: #0f172a; font-size: 24px; font-bold: true; margin-bottom: 16px;">Reset Your Password</h1>
        <p style="color: #64748b; font-size: 16px; line-height: 24px; margin-bottom: 24px;">
          We received a request to reset your password. Click the button below to proceed. This link will expire in 1 hour.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: white; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Reset Password
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendContactEmail(to: string, name: string, email: string, message: string, companySize?: string) {
  await transporter.sendMail({
    from: `"Smartstack Leads" <${process.env.SMTP_FROM}>`,
    to: to,
    subject: `New Lead: ${name} (${companySize || 'N/A'})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h1 style="color: #0f172a; font-size: 24px; font-weight: bold; margin-bottom: 16px;">New Contact Inquiry</h1>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #64748b; margin: 0 0 8px 0;"><strong>Name:</strong> ${name}</p>
          <p style="color: #64748b; margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
          <p style="color: #64748b; margin: 0 0 8px 0;"><strong>Company Size:</strong> ${companySize || 'N/A'}</p>
        </div>
        <p style="color: #64748b; margin-top: 16px;"><strong>Message:</strong></p>
        <p style="color: #0f172a; line-height: 1.6;">${message}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
        <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; text-align: center;">
          Sent from Smartstack Solutions Platform
        </p>
      </div>
    `,
  });
}
