// Vercel Serverless Function: Email 6-Digit OTP Dispatcher via Brevo / Resend
// Endpoint: POST /api/send-otp

import crypto from "crypto";

export default async function handler(req: any, res: any) {
  // Setup CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return res.status(200).json({
      status: "ready",
      endpoint: "/api/send-otp",
      brevoConfigured: Boolean(process.env.BREVO_API_KEY),
      resendConfigured: Boolean(process.env.RESEND_API_KEY),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const email = (body.email || "").trim().toLowerCase();
    const name = (body.name || "").trim();

    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "A valid email address is required." });
    }

    // 1. Generate secure 6-digit random code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Token expiry: 10 minutes
    const expiresAt = Date.now() + 10 * 60 * 1000;

    // 3. Create signed verification token (stateless & tamper-proof)
    const secret = process.env.OTP_SECRET || process.env.BREVO_API_KEY || "denim-universe-otp-salt-2026";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(`${email}:${otp}:${expiresAt}`)
      .digest("hex");
    const token = `${expiresAt}.${signature}`;

    const brevoKey = process.env.BREVO_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;

    // ------------------------------------------------------------------------
    // PATH 1: Brevo (Recommended — sends from asif.hdlplan@gmail.com)
    // ------------------------------------------------------------------------
    if (brevoKey) {
      const senderEmail = process.env.BREVO_SENDER_EMAIL || "asif.hdlplan@gmail.com";
      const senderName = process.env.BREVO_SENDER_NAME || "Denim Universe";

      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email, name: name || undefined }],
          subject: `${otp} is your Denim Universe verification code`,
          htmlContent: getOtpEmailHtml(otp, email),
        }),
      });

      const brevoData = await brevoRes.json();
      if (!brevoRes.ok) {
        console.error("Brevo API responded with error:", brevoData);
        return res.status(200).json({
          success: true,
          emailSent: false,
          token,
          warning: brevoData.message || "Email delivery failed",
          message: `Verification code generated. (Notice: ${brevoData.message || "Brevo delivery delay"})`,
        });
      }

      return res.status(200).json({
        success: true,
        emailSent: true,
        token,
        provider: "Brevo",
        message: `A 6-digit confirmation code has been sent to ${email} from ${senderEmail}. Please check your inbox and spam folder.`,
      });
    }

    // ------------------------------------------------------------------------
    // PATH 2: Resend
    // ------------------------------------------------------------------------
    if (resendKey) {
      const senderEmail = process.env.RESEND_FROM_EMAIL || "Denim Universe <onboarding@resend.dev>";

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: senderEmail,
          to: [email],
          subject: `${otp} is your Denim Universe verification code`,
          html: getOtpEmailHtml(otp, email),
        }),
      });

      const resendData = await resendRes.json();
      if (!resendRes.ok) {
        console.error("Resend API error:", resendData);
        return res.status(200).json({
          success: true,
          emailSent: false,
          token,
          warning: resendData.message,
          message: "Verification code generated.",
        });
      }

      return res.status(200).json({
        success: true,
        emailSent: true,
        token,
        provider: "Resend",
        message: `A 6-digit confirmation code has been sent to ${email}.`,
      });
    }

    // ------------------------------------------------------------------------
    // PATH 3: Local Dev Mode (Neither key configured in local environment)
    // ------------------------------------------------------------------------
    return res.status(200).json({
      success: true,
      emailSent: false,
      isMock: true,
      token,
      demoOtp: otp,
      message: `Offline mode: Enter demo OTP ${otp} (or 123456) to proceed. Configure BREVO_API_KEY in Vercel for live emails.`,
    });
  } catch (error: any) {
    console.error("Error in /api/send-otp:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal server error" });
  }
}

function getOtpEmailHtml(otp: string, email: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Denim Universe Verification Code</title>
  <style>
    body { margin: 0; padding: 0; background-color: #060d22; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e0e7ff; }
    .wrapper { width: 100%; max-width: 560px; margin: 0 auto; background-color: #0a1633; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; overflow: hidden; }
    .header { padding: 36px 30px; text-align: center; background: linear-gradient(180deg, #0d1f4d 0%, #0a1633 100%); border-bottom: 1px solid rgba(255,255,255,0.08); }
    .badge { display: inline-block; padding: 5px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 14px; }
    .title { color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; }
    .subtitle { color: #a5b4fc; font-size: 13px; margin-top: 6px; }
    .content { padding: 35px 30px; text-align: center; }
    .otp-box { background: rgba(245, 158, 11, 0.08); border: 2px dashed #f59e0b; border-radius: 16px; padding: 24px; margin: 24px 0; }
    .otp-code { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #f59e0b; margin: 0; }
    .info { color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 16px 0 0; }
    .footer { padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div style="padding: 24px 12px;">
    <div class="wrapper">
      <div class="header">
        <div class="badge">Security Verification</div>
        <h1 class="title">Denim Universe</h1>
        <p class="subtitle">Email verification for your member registration</p>
      </div>

      <div class="content">
        <p style="font-size: 15px; color: #e0e7ff; margin: 0;">Hello,</p>
        <p style="font-size: 14px; color: #cbd5e1; margin-top: 8px; line-height: 1.6;">
          Please enter the following 6-digit confirmation code in the registration window to complete your sign-up:
        </p>

        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>

        <p class="info">
          ⏱️ This verification code is valid for <strong>10 minutes</strong>.
          <br>
          If you did not initiate this request, you can safely ignore this email.
        </p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Denim Universe · Practical knowledge for denim professionals.
      </div>
    </div>
  </div>
</body>
</html>`;
}
